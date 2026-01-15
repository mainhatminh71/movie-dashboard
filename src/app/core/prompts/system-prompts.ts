import { RAGDocument } from '../models/ragdocument.model';

/**
 * Format context từ retrieved documents thành string
 */
export function formatContext(documents: RAGDocument[]): string {
  if (documents.length === 0) {
    return 'No relevant movies found.';
  }

  return documents
    .map((doc, index) => {
      const parts = [
        `${index + 1}. ${doc.title} (${doc.year})`,
        doc.overview || 'No overview available.',
        `Genres: ${doc.genres.join(', ')}`
      ];

      if (doc.cast && doc.cast.length > 0) {
        parts.push(`Cast: ${doc.cast.slice(0, 5).join(', ')}`);
      }

      if (doc.keywords && doc.keywords.length > 0) {
        parts.push(`Keywords: ${doc.keywords.slice(0, 5).join(', ')}`);
      }

      return parts.join('. ');
    })
    .join('\n\n');
}

/**
 * System prompt cho movie recommendation assistant
 */
export function getSystemPrompt(context: string): string {
  return `You are a helpful movie recommendation assistant specialized in TMDB (The Movie Database) data.

Your role:
- Answer questions about movies and TV shows using ONLY the provided context from TMDB
- Provide accurate, helpful, and concise recommendations
- If information is not available in the context, politely say so
- Focus on the most relevant information from the context
- Be conversational and friendly

Important rules:
- ONLY use information from the provided context
- Do not make up or infer information not in the context
- If asked about movies not in context, say you don't have that information
- Format your responses clearly and naturally

Context movies/shows:
${context}`;
}

/**
 * System prompt khi không có context (no results)
 */
export function getNoContextSystemPrompt(): string {
  return `You are a helpful movie recommendation assistant specialized in TMDB (The Movie Database) data.

The user's query could not be matched with any movies or TV shows in the database.

Please politely inform the user that you couldn't find relevant information and suggest:
- They try rephrasing their query
- They be more specific about what they're looking for
- They check back later as the database is being updated

Be friendly and helpful.`;
}

/**
 * Format context với relevance scores (optional)
 */
export function formatContextWithScores(documents: RAGDocument[]): string {
  if (documents.length === 0) {
    return 'No relevant movies found.';
  }

  return documents
    .map((doc, index) => {
      const parts = [
        `${index + 1}. ${doc.title} (${doc.year})`
      ];

      if (doc.relevance !== undefined) {
        parts.push(`[Relevance: ${(doc.relevance * 100).toFixed(1)}%]`);
      }

      parts.push(doc.overview || 'No overview available.');
      parts.push(`Genres: ${doc.genres.join(', ')}`);

      if (doc.cast && doc.cast.length > 0) {
        parts.push(`Cast: ${doc.cast.slice(0, 5).join(', ')}`);
      }

      return parts.join(' ');
    })
    .join('\n\n');
}


