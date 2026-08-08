import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

export async function getWishlist(uid) {
  const snap = await getDocs(collection(db, 'users', uid, 'wishlist'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function addWishlistItem(uid, item) {
  await addDoc(collection(db, 'users', uid, 'wishlist'), {
    name: item.name,
    category: item.category || '',
    price: Number(item.price) || 0,
    link: item.link || '',
    createdAt: serverTimestamp()
  })
}

export async function updateWishlistItem(uid, itemId, item) {
  await updateDoc(doc(db, 'users', uid, 'wishlist', itemId), {
    name: item.name,
    category: item.category || '',
    price: Number(item.price) || 0,
    link: item.link || ''
  })
}

export async function deleteWishlistItem(uid, itemId) {
  await deleteDoc(doc(db, 'users', uid, 'wishlist', itemId))
}
