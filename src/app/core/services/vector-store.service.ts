import { Injectable, inject } from '@angular/core';
import { RAGDocument } from '../models/ragdocument.model';
import { Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VectorStoreService {
  private documents: Map<string, RAGDocument> = new Map();
  private index: RAGDocument[] = [];
  private readonly STORAGE_KEY = 'rag_vector_store';

  constructor() {
    this.loadFromLocalStorage().subscribe();
  }
  addDocument(document: RAGDocument): Observable<boolean> {
    try {
      if (this.documents.has(document.id)) {
        this.documents.set(document.id, document);
        const index = this.index.findIndex(doc => doc.id === document.id);
        if (index >= 0) {
          this.index[index] = document;
        } else {
          this.index.push(document);
        }
      } else {
        this.documents.set(document.id, document);
        this.index.push(document);
      }
      this.saveToLocalStorage();
      return of(true);
    } catch (error) {
      console.error('Error adding document:', error);
      return of(false);
    }
  }

  /**
   * Thêm nhiều documents
   */
  addDocuments(documents: RAGDocument[]): Observable<number> {
    try {
      let addedCount = 0;
      documents.forEach(doc => {
        if (!this.documents.has(doc.id)) {
          addedCount++;
        }
        this.documents.set(doc.id, doc);
        
        // Update hoặc add vào index
        const index = this.index.findIndex(d => d.id === doc.id);
        if (index >= 0) {
          this.index[index] = doc;
        } else {
          this.index.push(doc);
        }
      });
      this.saveToLocalStorage();
      return of(addedCount);
    } catch (error) {
      console.error('Error adding documents:', error);
      return of(0);
    }
  }

  searchSimilar(
    queryEmbedding: number[], 
    topK: number = 5,
    threshold: number = 0.5
  ): Observable<RAGDocument[]> {
    if (queryEmbedding.length === 0 || this.index.length === 0) {
      return of([]);
    }

    const results = this.index
      .map(doc => {
        // Bỏ qua documents không có embedding hoặc embedding rỗng
        if (!doc.embedding || doc.embedding.length === 0) {
          return null;
        }
        const similarity = this.cosineSimilarity(queryEmbedding, doc.embedding);
        return {
          document: doc,
          similarity
        };
      })
      .filter((result): result is { document: RAGDocument; similarity: number } => 
        result !== null && result.similarity >= threshold
      )
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
      .map(result => ({
        ...result.document,
        relevance: result.similarity
      }));

    return of(results);
  }


  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length || vecA.length === 0) {
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator === 0 ? 0 : dotProduct / denominator;
  }

  /**
   * Lấy document theo ID
   */
  getDocument(id: string): Observable<RAGDocument | null> {
    return of(this.documents.get(id) || null);
  }

  /**
   * Xóa document
   */
  removeDocument(id: string): Observable<boolean> {
    const removed = this.documents.delete(id);
    if (removed) {
      this.index = this.index.filter(doc => doc.id !== id);
      this.saveToLocalStorage();
    }
    return of(removed);
  }

  /**
   * Lấy tất cả documents
   */
  getAllDocuments(): Observable<RAGDocument[]> {
    return of(Array.from(this.documents.values()));
  }


  getDocumentCount(): Observable<number> {
    return of(this.documents.size);
  }

  clearAll(): Observable<boolean> {
    try {
      this.documents.clear();
      this.index = [];
      localStorage.removeItem(this.STORAGE_KEY);
      return of(true);
    } catch (error) {
      console.error('Error clearing documents:', error);
      return of(false);
    }
  }


  private saveToLocalStorage(): void {
    const data = Array.from(this.documents.values());
    try {
    
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      try {
        const dataWithoutEmbedding = data.map((doc: RAGDocument) => ({
          ...doc,
          embedding: [] 
        }));
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataWithoutEmbedding));
      } catch (e) {
        console.error('Error saving without embeddings:', e);
      }
    }
  }


  loadFromLocalStorage(): Observable<number> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const documents: RAGDocument[] = JSON.parse(stored);
        documents.forEach(doc => {
          // Giữ nguyên embedding nếu có, không xóa
          // Nếu embedding rỗng hoặc không có, giữ nguyên (sẽ được filter khi search)
          if (!doc.embedding) {
            doc.embedding = [];
          }
          this.documents.set(doc.id, doc);
          const index = this.index.findIndex(d => d.id === doc.id);
          if (index < 0) {
            this.index.push(doc);
          }
        });
        return of(documents.length);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return of(0);
  }


  hasDocument(id: string): Observable<boolean> {
    return of(this.documents.has(id));
  }

  /**
   * Lấy documents theo type (movie hoặc tv)
   */
  getDocumentsByType(type: 'movie' | 'tv'): Observable<RAGDocument[]> {
    const filtered = Array.from(this.documents.values()).filter(doc => doc.type === type);
    return of(filtered);
  }
}


