import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { RAGDocument } from '../models/ragdocument.model';
import { 
  getSystemPrompt, 
  getNoContextSystemPrompt, 
  formatContext 
} from '../prompts/system-prompts';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ChatOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AIChatService {
  private http = inject(HttpClient);

  private readonly DEFAULT_MODEL = 'llama-3.1-8b-instant';
  private readonly DEFAULT_TEMPERATURE = 0.7;
  private readonly DEFAULT_MAX_TOKENS = 500;

  /**
   * Send chat query với RAG context
   * @param query User query
   * @param contextDocs Retrieved documents từ RAG
   * @param options Chat options (model, temperature, max_tokens)
   */
 chat(
  query: string,
  contextDocs: RAGDocument[],
  options: ChatOptions = {}
): Observable<string> {
  if (!query?.trim()) {
    return of('Please provide a query.');
  }

  if (!this.hasValidApiKey()) {
    // return this.getFallbackResponse(query, contextDocs);
  }

  const context = contextDocs.length > 0 ? formatContext(contextDocs) : '';
  const systemPrompt = context
    ? getSystemPrompt(context)
    : getNoContextSystemPrompt();

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    // Thêm history nếu có: ...previousMessages,
    { role: 'user', content: query }
  ];

  const defaultOptions = {
    model: 'llama-3.3-70b-versatile',  // Hoặc từ env / config
    temperature: 0.7,
    max_tokens: 1024,
    stream: false
  };

  const finalOptions = { ...defaultOptions, ...options };

  return this.callGroqAPI(messages, finalOptions).pipe(
    map(response => {
      if (finalOptions.stream) {
        return ''; 
      }
      return response.choices?.[0]?.message?.content || 'No response';
    }),
    catchError(error => {
      console.error('Groq API error:', error);
      return this.getFallbackResponse(query, contextDocs);
    })
  );
}

  /**
   * Streaming chat response (for future implementation)
   * @param query User query
   * @param contextDocs Retrieved documents từ RAG
   * @param options Chat options
   */
  streamChat(
    query: string,
    contextDocs: RAGDocument[],
    options?: ChatOptions
  ): Observable<string> {
    // For now, fallback to regular chat
    return this.chat(query, contextDocs, options);
  }

  /**
   * Call GROQ API
   */
  private callGroqAPI(
    messages: ChatMessage[],
    options?: ChatOptions
  ): Observable<GroqChatResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.groqApiKey}`,
      'Content-Type': 'application/json'
    });

    const requestBody = {
      model: options?.model || this.DEFAULT_MODEL,
      messages: messages,
      temperature: options?.temperature ?? this.DEFAULT_TEMPERATURE,
      max_tokens: options?.max_tokens ?? this.DEFAULT_MAX_TOKENS,
      stream: options?.stream || false
    };

    return this.http.post<GroqChatResponse>(
      `${environment.groqBaseUrl}/chat/completions`,
      requestBody,
      { headers }
    );
  }

  /**
   * Check if GROQ API key is valid
   */
  private hasValidApiKey(): boolean {
    return !!(
      environment.groqApiKey && 
      environment.groqApiKey !== 'GROQ_API_KEY' &&
      environment.groqApiKey.trim().length > 0
    );
  }

  /**
   * Fallback response khi không có API key hoặc API error
   */
  private getFallbackResponse(
    query: string, 
    contextDocs: RAGDocument[]
  ): Observable<string> {
    if (contextDocs.length === 0) {
      return of(
        'Sorry, I could not find any relevant movies based on your query. ' +
        'Please try rephrasing your question or be more specific.'
      );
    }

    const context = formatContext(contextDocs);
    return of(
      `Based on your query "${query}", here are some relevant movies:\n\n${context}\n\n` +
      `Note: AI chat feature requires GROQ API key configuration. ` +
      `Currently showing raw search results.`
    );
  }

  /**
   * Validate chat configuration
   */
  isConfigured(): boolean {
    return this.hasValidApiKey() && 
           !!environment.groqBaseUrl &&
           environment.groqBaseUrl.trim().length > 0;
  }
}

