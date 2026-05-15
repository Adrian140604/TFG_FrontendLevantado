export interface RegisterRequest {
  name: string;
  institutionalEmail: string;
  password: string;
  repeatPassword: string;
  course: string | null;
  department: string | null;
}
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  path: string;
}

export interface User {
  userId: number;
  name: string;
  institutionalEmail: string;
  role: string;
  course: string | null;
  department: string | null;
}

export interface JwtPayload {
  userId: number;
  name: string;
  institutionalEmail: string;
  role: string;
  course: string | null;
  department: string | null;
  sub: string;
  iat: number;
  exp: number;
}

export interface LoginRequest {
  institutionalEmail: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface Book {
  bookId: number;
  isbn: string;
  title: string;
  publisher: string;
  publicationYear: number;
  category: string;
  authors: string[];
  totalCopies: number;
  availableCopies: number;
  loanedCopies: number;
}

export interface CreateBookRequest {
  isbn: string;
  title: string;
  publisher: string;
  publicationYear: number;
  category: string;
  authors: string[];
  copies: number;
}

export interface Loan {
  loanId: number;
  loanDate: string;
  expectedReturnDate: string;
  actualReturnDate: string | null;
  status: string;
}