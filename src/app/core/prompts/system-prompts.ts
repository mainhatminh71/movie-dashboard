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
- Answer questions about movies and TV shows using the provided context from TMDB
- Provide accurate, helpful, and concise recommendations
- Be conversational and friendly
- If the user asks about a movie that's not exactly in the context, but there's a related movie (e.g., asking about "Zootopia 2" when only "Zootopia" is in context), provide information about the related movie and mention it's the original/related title

Important rules:
- Use information from the provided context as the primary source
- If the exact movie isn't in context but a related one is, provide information about the related movie
- Do not say "I couldn't find" or "not in database" if there's relevant information in the context
- Focus on being helpful - if context has relevant movies, talk about them
- Format your responses clearly and naturally

Context movies/shows:
${context}`;
}

/**
 * System prompt khi không có context (no results)
 */
export function getNoContextSystemPrompt(): string {
  return `You are a helpful movie recommendation assistant specialized in TMDB (The Movie Database) data.

The user's query could not be matched with any movies or TV shows in our database.

You can still provide helpful information based on your general knowledge about movies if relevant. Be concise, friendly, and conversational. 

Only mention that the information wasn't found in the database if you truly cannot provide a helpful answer. If you can answer based on general knowledge, do so directly without unnecessary disclaimers.`;
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


