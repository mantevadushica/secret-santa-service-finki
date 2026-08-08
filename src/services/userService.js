import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/firebase'

export async function createUserProfile(uid, data) {
  await setDoc(doc(db, 'users', uid), {
    name: data.name,
    email: data.email,
    department: data.department || '',
    createdAt: serverTimestamp()
  })
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function updateUserProfile(uid, data) {
  await setDoc(doc(db, 'users', uid), data, { merge: true })
}
