// packages/shared-utils/src/index.ts

import type { AccountStatus, BankAccountDetails, Currency, MenuItem, Seller, User, UserRole, VerificationDocument } from '@foodconnect/shared-types';
import { useEffect, useState } from 'react';
import { auth, db, uploadFile } from '@foodconnect/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { getFirebaseErrorMessage } from './errors';

export * from './errors';

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
  try {
    const snapshot = await getDoc(doc(db, 'users', uid));
    return snapshot.exists() ? snapshot.data() as User : null;
  } catch (error) {
    console.error('getUserProfile failed', error);
    return null;
  }
}

export async function updateUserStatus(uid: string, status: AccountStatus): Promise<void> {
  try { await setDoc(doc(db, 'users', uid), { status }, { merge: true }); }
  catch (error) { throw new Error(getFirebaseErrorMessage(error, 'Could not update account status.')); }
}

export async function createSellerProfile(seller: Seller): Promise<void> {
  try { await setDoc(doc(db, 'sellers', seller.id), seller); }
  catch (error) { throw new Error(getFirebaseErrorMessage(error, 'Could not create seller profile.')); }
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
  try {
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
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error, 'Could not submit your application. Please try again.'));
  }
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

export function useSellerProfile(sellerId: string | null): { seller: Seller | null; loading: boolean; error: Error | null } {
  const [state, setState] = useState<{ seller: Seller | null; loading: boolean; error: Error | null }>({ seller: null, loading: Boolean(sellerId), error: null });
  useEffect(() => {
    if (!sellerId) { setState({ seller: null, loading: false, error: null }); return; }
    setState(current => ({ ...current, loading: true }));
    return onSnapshot(doc(db, 'sellers', sellerId), snapshot => setState({ seller: snapshot.exists() ? snapshot.data() as Seller : null, loading: false, error: null }), error => setState({ seller: null, loading: false, error: new Error(getFirebaseErrorMessage(error, 'Could not load your seller profile.')) }));
  }, [sellerId]);
  return state;
}

export async function setSellerCookingToday(sellerId: string, isCookingToday: boolean): Promise<void> { try { await updateDoc(doc(db, 'sellers', sellerId), { isCookingToday }); } catch (error) { throw new Error(getFirebaseErrorMessage(error, 'Could not update your cooking status.')); } }
export async function updateSellerOperatingHours(sellerId: string, operatingHours: Seller['operatingHours']): Promise<void> { try { await updateDoc(doc(db, 'sellers', sellerId), { operatingHours }); } catch (error) { throw new Error(getFirebaseErrorMessage(error, 'Could not save operating hours.')); } }

export interface MenuItemInput { name: string; description: string; category: string; price: number; currency: Currency; bulkCapable: boolean; photoFile?: File | null; }
export function useMenuItems(sellerId: string | null): { items: MenuItem[]; loading: boolean; error: Error | null } {
  const [state, setState] = useState<{ items: MenuItem[]; loading: boolean; error: Error | null }>({ items: [], loading: Boolean(sellerId), error: null });
  useEffect(() => {
    if (!sellerId) { setState({ items: [], loading: false, error: null }); return; }
    const menuQuery = query(collection(db, 'menuItems'), where('sellerId', '==', sellerId), orderBy('createdAt', 'desc'));
    return onSnapshot(menuQuery, snapshot => setState({ items: snapshot.docs.map(item => item.data() as MenuItem), loading: false, error: null }), error => setState({ items: [], loading: false, error: new Error(getFirebaseErrorMessage(error, 'Could not load your menu items.')) }));
  }, [sellerId]);
  return state;
}
export async function saveMenuItem(sellerId: string, input: MenuItemInput, existingItem?: MenuItem): Promise<void> {
  try {
    const id = existingItem?.id ?? crypto.randomUUID(); let photoUrl = existingItem?.photoUrl;
    if (input.photoFile) photoUrl = await uploadFile(`sellers/${sellerId}/menu/${id}-${input.photoFile.name}`, input.photoFile);
    await setDoc(doc(db, 'menuItems', id), { id, sellerId, name: input.name, description: input.description, category: input.category, price: input.price, currency: input.currency, photoUrl, available: existingItem?.available ?? true, bulkCapable: input.bulkCapable, createdAt: existingItem?.createdAt ?? new Date().toISOString(), updatedAt: new Date().toISOString() } satisfies MenuItem);
  } catch (error) { throw new Error(getFirebaseErrorMessage(error, 'Could not save this menu item. Please try again.')); }
}
export async function setMenuItemAvailability(itemId: string, available: boolean): Promise<void> { try { await updateDoc(doc(db, 'menuItems', itemId), { available }); } catch (error) { throw new Error(getFirebaseErrorMessage(error, 'Could not update availability.')); } }
export async function deleteMenuItem(itemId: string): Promise<void> { try { await deleteDoc(doc(db, 'menuItems', itemId)); } catch (error) { throw new Error(getFirebaseErrorMessage(error, 'Could not delete this menu item.')); } }
