import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { firebaseApp } from './config';

export const auth = getAuth(firebaseApp);

export function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUpWithEmail(email: string, password: string, displayName: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  return credential;
}

export function signOutUser() {
  return signOut(auth);
}

export function sendResetEmail(email: string) {
  return sendPasswordResetEmail(auth, email);
}
