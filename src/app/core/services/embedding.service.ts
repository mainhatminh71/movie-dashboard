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
    if (!text || text.trim().length === 0) {
      return of([]);
    }

    const cacheKey = this.hashText(text);
    
    if (this.embeddingCache.has(cacheKey)) {
      return of(this.embeddingCache.get(cacheKey)!);
    }

    if (!environment.openaiApiKey || environment.openaiApiKey === 'OPENAI_API_KEY') {
      console.warn('OpenAI API not found');
      return of([]);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.openaiApiKey}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<{ data: Array<{ embedding: number[] }> }>(
      'https://api.openai.com/v1/embeddings',
      {
        model: 'text-embedding-3-small', 
        input: text
      },
      { headers }
    ).pipe(
      map(response => response.data[0]?.embedding || []),
      map(embedding => {
        if (embedding.length > 0) {
          this.embeddingCache.set(cacheKey, embedding);
        }
        return embedding;
      }),
      catchError(error => {
        console.error('Error creating embedding:', error);
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

