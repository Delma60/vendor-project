import { FirebaseError } from 'firebase/app';

const FRIENDLY_MESSAGES: Record<string, string> = {
  'permission-denied': "You don't have permission to do that. If this seems wrong, try signing in again or contact support.",
  unauthenticated: 'Your session has expired. Please sign in again.',
  'not-found': 'We could not find that record. It may have been removed.',
  unavailable: 'FoodConnect services are temporarily unavailable. Please try again in a moment.',
  'deadline-exceeded': 'That took too long to respond. Check your connection and try again.',
  'resource-exhausted': "We're experiencing high demand right now. Please try again shortly.",
  'already-exists': 'That record already exists.',
  'failed-precondition': 'This action cannot be completed right now. Please refresh and try again.',
  cancelled: 'The request was cancelled.',
};

export function isFirebaseError(error: unknown): error is FirebaseError {
  return typeof error === 'object' && error !== null && 'code' in error && typeof (error as { code: unknown }).code === 'string';
}

export function isPermissionError(error: unknown): boolean {
  return isFirebaseError(error) && error.code.replace(/^auth\//, '') === 'permission-denied';
}

export function isAuthExpiredError(error: unknown): boolean {
  return isFirebaseError(error) && ['unauthenticated', 'auth/user-token-expired', 'auth/invalid-user-token'].includes(error.code);
}

export function getFirebaseErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (isFirebaseError(error)) {
    const code = error.code.replace(/^auth\//, '').replace(/^firestore\//, '');
    if (FRIENDLY_MESSAGES[code]) return FRIENDLY_MESSAGES[code];
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}