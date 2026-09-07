// packages/shared-utils/src/index.ts

import type { AccountStatus, BankAccountDetails, Seller, User, UserRole, VerificationDocument } from '@foodconnect/shared-types';
import { useEffect, useState } from 'react';
import { auth, db, uploadFile } from '@foodconnect/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export interface ApiClient { request<T>(path: string, init?: RequestInit): Promise<T>; }
export const apiClient: ApiClient = {
  async request<T>(path: string, init?: RequestInit) {
    const response = await fetch(path, { ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } });
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    return response.json() as Promise<T>;
  },
};

export function useApiQuery<T>(path: string | null): { data: T | null; error: Error | null; loading: boolean } {
  const [state, setState] = useState<{ data: T | null; error: Error | null; loading: boolean }>({ data: null, error: null, loading: Boolean(path) });
  useEffect(() => {
    if (!path) { setState({ data: null, error: null, loading: false }); return; }
    let active = true;
    setState({ data: null, error: null, loading: true });
    apiClient.request<T>(path).then(data => active && setState({ data, error: null, loading: false })).catch(error => active && setState({ data: null, error, loading: false }));
    return () => { active = false; };
  }, [path]);
  return state;
}

export async function getUserProfile(uid: string): Promise<User | null> {
  const snapshot = await getDoc(doc(db, 'users', uid));
  return snapshot.exists() ? snapshot.data() as User : null;
}

export async function updateUserStatus(uid: string, status: AccountStatus): Promise<void> {
  await setDoc(doc(db, 'users', uid), { status }, { merge: true });
}

export async function createSellerProfile(seller: Seller): Promise<void> {
  await setDoc(doc(db, 'sellers', seller.id), seller);
}

export interface SellerApplicationInput {
  businessName: string;
  category: string;
  description: string;
  address: string;
  city: string;
  operatingHours: Seller['operatingHours'];
  bankDetails: BankAccountDetails;
  documents: { label: string; file: File }[];
}

export async function submitSellerApplication(uid: string, input: SellerApplicationInput): Promise<void> {
  const uploadedDocuments: VerificationDocument[] = await Promise.all(
    input.documents.map(async ({ label, file }) => {
      const fileUrl = await uploadFile(`sellers/${uid}/documents/${label.replace(/\s+/g, '-').toLowerCase()}-${file.name}`, file);
      return { id: crypto.randomUUID(), label, fileName: file.name, uploadedAt: new Date().toISOString(), fileUrl };
    })
  );

  const seller: Seller = {
    id: uid,
    ownerId: uid,
    businessName: input.businessName,
    category: input.category,
    description: input.description,
    address: `${input.address}${input.city ? `, ${input.city}` : ''}`,
    operatingHours: input.operatingHours,
    bankDetails: input.bankDetails,
    documents: uploadedDocuments,
    verificationStatus: 'pending',
    rating: 0,
    totalOrders: 0,
    isCookingToday: false,
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'sellers', uid), seller);
  await updateDoc(doc(db, 'users', uid), { status: 'pending' });
}

export function useCurrentUser(): { user: User | null; loading: boolean } {
  const [state, setState] = useState<{ user: User | null; loading: boolean }>({ user: null, loading: true });
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (!firebaseUser) { setState({ user: null, loading: false }); return; }
      const profile = await getUserProfile(firebaseUser.uid);
      setState({ user: profile, loading: false });
    });
    return unsubscribe;
  }, []);
  return state;
}

export function hasRole(user: User | null, allowedRoles: UserRole[]): boolean { return Boolean(user && allowedRoles.includes(user.role)); }
export function canAccessRoute(user: User | null, allowedRoles: UserRole[]): boolean { return hasRole(user, allowedRoles) && user?.status === 'active'; }
export function requireRole(user: User | null, allowedRoles: UserRole[]): void { if (!canAccessRoute(user, allowedRoles)) throw new Error('You do not have permission to access this route.'); }
