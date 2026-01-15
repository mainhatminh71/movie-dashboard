import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, map, catchError, forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RAGDocument } from '../models/ragdocument.model';

@Injectable({
  providedIn: 'root'
})
export class EmbeddingService {
  private http = inject(HttpClient);
  private embeddingCache = new Map<string, number[]>();

  createEmbedding(text: string): Observable<number[]> {
    if (!text?.trim()) return of([]);

    const cacheKey = this.hashText(text);
    if (this.embeddingCache.has(cacheKey)) {
      return of(this.embeddingCache.get(cacheKey)!);
    }

    if ( environment.nomicApiKey !== 'NOMIC_API_KEY') {
      console.warn('Nomic API key invalid');
      return of([]);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.nomicApiKey}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(
      'https://api-atlas.nomic.ai/v1/embedding/text',
      {
        model: 'nomic-embed-text-v1.5',
        texts: [text],
        task_type: 'search_document'
      },
      { headers }
    ).pipe(
      map(res => {
        const embeddings = res.embeddings;
        if (Array.isArray(embeddings) && embeddings.length > 0 && Array.isArray(embeddings[0])) {
          const embedding = embeddings[0];
          this.embeddingCache.set(cacheKey, embedding);
          return embedding;
        }
        return [];
      }),
      catchError(err => {
        console.error('Embedding error:', err);
        return of([]);
      })
    );
  }
  createEmbeddingsBatch(documents: RAGDocument[]): Observable<RAGDocument[]> {
    if (documents.length === 0) {
      return of([]);
    }

    const requests = documents.map(doc => {
      const text = doc.overview || doc.title || '';
      return this.createEmbedding(text).pipe(
        map(embedding => ({
          ...doc,
          embedding
        }))
      );
    });

    return forkJoin(requests);
  }


  createEmbeddingFromText(embeddingText: string): Observable<number[]> {
    return this.createEmbedding(embeddingText);
  }

  private hashText(text: string): string {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  clearCache(): void {
    this.embeddingCache.clear();
  }

  /**
   * Lấy cache size
   */
  getCacheSize(): number {
    return this.embeddingCache.size;
  }
}

