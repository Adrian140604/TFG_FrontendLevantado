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
  reservedCopies: number;
  catalogStatus: string;
}

export interface Category {
  categoryId: number;
  name: string;
}

export interface CategoryRequest {
  name: string;
}
export interface Sanction {
  sanctionId: number;
  userId: number;
  userName: string;
  userEmail: string;
  loanId: number;
  bookTitle: string;
  startDate: string;
  endDate: string;
  delayDays: number;
  sanctionDays: number;
  reason: string;
  active: boolean;
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

  userId: number;
  userName: string;
  userEmail: string;

  bookId: number;
  bookTitle: string;
  bookCopyId: number;

  loanDate: string;
  expectedReturnDate: string;
  actualReturnDate: string | null;

  status: string;
}
export interface SanctionConfig {
  sanctionConfigId: number;
  sanctionDaysPerDelayDay: number;
  active: boolean;
}

export interface UpdateSanctionConfigRequest {
  sanctionDaysPerDelayDay: number;
}

export interface Reservation {
  reservationId: number;

  userId: number;
  userName: string;
  userEmail: string;

  bookId: number;
  bookTitle: string;
  bookIsbn: string;

  reservationDate: string;
  expirationDate: string;

  status: string;
}