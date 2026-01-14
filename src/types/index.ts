export interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: "user" | "admin";
  readingGoal?: {
    year: number;
    targetBooks: number;
  };
  followers?: string[];
  following?: string[];
  createdAt: string;
}

export interface Genre {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  createdAt: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: Genre;
  description: string;
  coverImage: string;
  totalPages: number;
  publicationYear?: number;
  isbn?: string;
  averageRating: number;
  totalRatings: number;
  totalShelved: number;
  createdAt: string;
}

export interface Review {
  _id: string;
  book: Book | string;
  user: User | string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface UserBook {
  _id: string;
  user: string;
  book: Book;
  shelf: "wantToRead" | "currentlyReading" | "read";
  progress: {
    pagesRead: number;
    percentage: number;
  };
  startedAt?: string;
  finishedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface Tutorial {
  _id: string;
  title: string;
  description?: string;
  youtubeUrl: string;
  videoId: string;
  thumbnail: string;
  category:
    | "book-review"
    | "reading-tips"
    | "author-interview"
    | "book-recommendation"
    | "other";
  createdBy: User | string;
  createdAt: string;
}

export interface Activity {
  _id: string;
  user: User;
  type: "added-to-shelf" | "finished-book" | "rated-book" | "started-reading";
  book: Book;
  shelf?: string;
  rating?: number;
  createdAt: string;
}

export interface Recommendation {
  book: Book;
  reason: string;
}

export interface ReadingStats {
  booksReadThisYear: number;
  totalPages: number;
  averageRating: string | number;
  readingStreak: number;
  favoriteGenre: string;
  genreBreakdown: Record<string, number>;
  monthlyReading: number[];
  totalBooksRead: number;
  currentlyReading: number;
  wantToRead: number;
}

export interface AdminStats {
  overview: {
    totalUsers: number;
    totalBooks: number;
    totalGenres: number;
    totalReviews: number;
    pendingReviews: number;
  };
  booksPerGenre: Array<{ genre: string; count: number }>;
  topRatedBooks: Book[];
  mostShelvedBooks: Book[];
  recentUsers: User[];
  userRoles: Array<{ _id: string; count: number }>;
  monthlyUsers: Array<{ _id: { year: number; month: number }; count: number }>;
}
