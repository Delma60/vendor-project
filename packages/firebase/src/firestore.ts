import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { firebaseApp } from './config';
import type { AccountStatus, UserRole } from '@foodconnect/shared-types';

export const db = getFirestore(firebaseApp);

export interface NewUserProfileInput {
	uid: string;
	email: string;
	displayName: string;
	role: UserRole;
	status?: AccountStatus;
}

export async function createUserProfile({ uid, email, displayName, role, status = 'pending' }: NewUserProfileInput) {
	await setDoc(doc(db, 'users', uid), {
		id: uid,
		email,
		displayName,
		role,
		status,
		createdAt: new Date().toISOString(),
	});
}
