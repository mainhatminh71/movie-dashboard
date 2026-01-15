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

    if (!environment.groqApiKey) {
      console.warn('Groq API not found');
      return of([]);
    }
    // if (environment.groqApiKey !== 'GROQ_API_KEY') {
    //   console.warn('Groq API key is not valid');
    //   return of([]);
    // }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.groqApiKey}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(
      `${environment.groqBaseUrl}/chat/completions`,
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'user',
            content: `Please create an embedding vector for this text: "${text}". Return only a JSON array of numbers representing the embedding.`
          }
        ],
        temperature: 0.1,
        max_tokens: 2000
      },
      { headers }
    ).pipe(
      map(response => {
        // Parse response từ chat completions
        const content = response.choices?.[0]?.message?.content || '';
        try {
          // Thử parse JSON array từ response
          const embedding = JSON.parse(content);
          if (Array.isArray(embedding) && embedding.length > 0) {
            return embedding;
          }
        } catch (e) {
          console.warn('Could not parse embedding from chat response:', content);
        }
        return [];
      }),
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

