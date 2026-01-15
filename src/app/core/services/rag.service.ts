import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, switchMap, catchError, of } from 'rxjs';
import { RAGDocument } from '../models/ragdocument.model';
import { TmdbDocumentCollectorService } from './tmdb-document-collector.service';
import { EmbeddingService } from './embedding.service';
import { VectorStoreService } from './vector-store.service';
import { AIChatService } from './ai-chat.service';

@Injectable({
  providedIn: 'root'
})
export class RAGService {
  private documentCollector = inject(TmdbDocumentCollectorService);
  private embeddingService = inject(EmbeddingService);
  private vectorStore = inject(VectorStoreService);
  private aiChatService = inject(AIChatService);

  /**
   * Khởi tạo RAG system - collect và index documents
   */
  initializeRAG(limit: number = 100): Observable<number> {
    return this.documentCollector.collectPopularMovies(limit).pipe(
      switchMap(documents => {
        const documentsWithText = documents.map(doc => ({
          document: doc,
          embeddingText: this.documentCollector.createEmbeddingText(doc)
        }));

        // Tạo embeddings
        const embeddingRequests = documentsWithText.map(({ document, embeddingText }) =>
          this.embeddingService.createEmbedding(embeddingText).pipe(
            map(embedding => ({
              ...document,
              embedding
            }))
          )
        );

        return forkJoin(embeddingRequests);
      }),
      switchMap(documents => 
        this.vectorStore.addDocuments(documents)
      ),
      map(count => count)
    );
  }


  query(query: string, topK: number = 5): Observable<string> {
    if (!query || query.trim().length === 0) {
      return of('Please provide a query to search for movies.');
    }

    return this.embeddingService.createEmbedding(query).pipe(
      switchMap(queryEmbedding => {
        if (queryEmbedding.length === 0) {
          // Return empty array để maintain type consistency, AI service sẽ handle error message
          return of<RAGDocument[]>([]);
        }
        
        return this.vectorStore.searchSimilar(queryEmbedding, topK, 0.5);
      }),
      switchMap((relevantDocs: RAGDocument[]) => {
        // Gọi AI chat service với relevant docs (có thể là empty array)
        return this.aiChatService.chat(query, relevantDocs);
      }),
      catchError(error => {
        console.error('Error in RAG query:', error);
        return of('Sorry, I encountered an error processing your query.');
      })
    );
  }


  /**
   * Get relevant documents cho một query (không generate response)
   */
  getRelevantDocuments(query: string, topK: number = 100): Observable<RAGDocument[]> {
    if (!query || query.trim().length === 0) {
      return of([]);
    }

    return this.embeddingService.createEmbedding(query).pipe(
      switchMap(embedding => {
        if (embedding.length === 0) {
          return of([]);
        }
        return this.vectorStore.searchSimilar(embedding, topK, 0.3);
      }),
      switchMap(results => {
        // Nếu embedding search không tìm thấy hoặc ít kết quả, thêm text matching
        return this.vectorStore.getAllDocuments().pipe(
          map(allDocs => {
            const queryLower = query.toLowerCase().trim();
            const words = queryLower.split(/\s+/).filter(w => w.length > 2); // Bỏ qua từ ngắn như "2"
            
            // Text matching với priority
            const textMatches = allDocs
              .map(doc => {
                const titleLower = doc.title?.toLowerCase() || '';
                const overviewLower = doc.overview?.toLowerCase() || '';
                
                // Exact match trong title
                if (titleLower.includes(queryLower)) {
                  return { doc, score: 100 };
                }
                
                // Partial match - tất cả từ đều có trong title
                if (words.every(word => titleLower.includes(word))) {
                  return { doc, score: 80 };
                }
                
                // Một số từ có trong title
                const titleWordMatches = words.filter(word => titleLower.includes(word)).length;
                if (titleWordMatches > 0) {
                  return { doc, score: 50 + (titleWordMatches * 10) };
                }
                
                // Match trong overview
                if (overviewLower.includes(queryLower)) {
                  return { doc, score: 40 };
                }
                
                const overviewWordMatches = words.filter(word => overviewLower.includes(word)).length;
                if (overviewWordMatches > 0) {
                  return { doc, score: 20 + (overviewWordMatches * 5) };
                }
                
                return null;
              })
              .filter((result): result is { doc: RAGDocument; score: number } => result !== null)
              .sort((a, b) => b.score - a.score)
              .slice(0, topK)
              .map(result => result.doc);
            
            // Kết hợp kết quả từ embedding search và text matching
            const combined = [...results];
            textMatches.forEach(textMatch => {
              if (!combined.find(r => r.id === textMatch.id)) {
                combined.push(textMatch);
              }
            });
            
            return combined.slice(0, topK);
          })
        );
      })
    );
  }

  /**
   * Add new document vào RAG system
   */
  addDocument(movieId: number): Observable<boolean> {
    return this.documentCollector.collectMovieDocument(movieId).pipe(
      switchMap(doc => {
        if (!doc) {
          return of(false);
        }
        
        const embeddingText = this.documentCollector.createEmbeddingText(doc);
        return this.embeddingService.createEmbedding(embeddingText).pipe(
          map(embedding => ({ ...doc, embedding })),
          switchMap(docWithEmbedding => 
            this.vectorStore.addDocument(docWithEmbedding)
          )
        );
      }),
      catchError(error => {
        console.error('Error adding document:', error);
        return of(false);
      })
    );
  }

  /**
   * Get document count
   */
  getDocumentCount(): Observable<number> {
    return this.vectorStore.getDocumentCount();
  }

  /**
   * Clear all documents
   */
  clearAll(): Observable<boolean> {
    return this.vectorStore.clearAll();
  }

  /**
   * Initialize với custom movie IDs
   */
  initializeWithMovieIds(movieIds: number[]): Observable<number> {
    return this.documentCollector.collectDocumentsBatch(movieIds).pipe(
      switchMap(documents => {
        const documentsWithText = documents.map(doc => ({
          document: doc,
          embeddingText: this.documentCollector.createEmbeddingText(doc)
        }));

        const embeddingRequests = documentsWithText.map(({ document, embeddingText }) =>
          this.embeddingService.createEmbedding(embeddingText).pipe(
            map(embedding => ({
              ...document,
              embedding
            }))
          )
        );

        return forkJoin(embeddingRequests);
      }),
      switchMap(documents => 
        this.vectorStore.addDocuments(documents)
      ),
      map(count => count)
    );
  }
}

