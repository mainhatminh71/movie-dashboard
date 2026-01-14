export interface RAGDocument {
    id: string;           // movie_id || tv_id-season
    type: 'movie' | 'tv';
    title: string;
    year: number;
    overview: string;
    genres: string[];
    cast?: string[];      // top 5-7
    keywords?: string[];
    poster_path?: string;
    embedding: number[];  // vector
    relevance?: number;
  }
  