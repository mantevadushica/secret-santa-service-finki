import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch
} from 'firebase/firestore'

import { db } from '../firebase/firebase'


function makeJoinCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

  return Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('')
}


/* ==============================
   CREATE EVENT
================================ */

export async function createEvent(owner, payload) {

  let joinCode = makeJoinCode()

  let duplicate = await getDocs(
    query(
      collection(db, 'events'),
      where('joinCode', '==', joinCode)
    )
  )

  while (!duplicate.empty) {
    joinCode = makeJoinCode()

    duplicate = await getDocs(
      query(
        collection(db, 'events'),
        where('joinCode', '==', joinCode)
      )
    )
  }


  const eventRef = await addDoc(
    collection(db, 'events'),
    {
      name: payload.name,
      description: payload.description || '',
      budget: Number(payload.budget) || 0,
      drawDate: payload.drawDate || '',
      joinDeadline: payload.joinDeadline || '',

      ownerId: owner.uid,

      // SITE USERS KOI SE CLENOVI NA NASTANOT
      memberIds: [owner.uid],

      joinCode,
      status: 'open',

      createdAt: serverTimestamp()
    }
  )


  // Organizatorot avtomatski stanuva participant
  await setDoc(
    doc(
      db,
      'events',
      eventRef.id,
      'participants',
      owner.uid
    ),
    {
      uid: owner.uid,
      name: owner.name,
      email: owner.email,
      role: 'organizer',
      joinedAt: serverTimestamp()
    }
  )


  return {
    id: eventRef.id,
    joinCode
  }
}


/* ==============================
   GET ONE EVENT
================================ */

export async function getEvent(eventId) {

  const snap = await getDoc(
    doc(db, 'events', eventId)
  )

  return snap.exists()
    ? {
        id: snap.id,
        ...snap.data()
      }
    : null
}


/* ==============================
   GET PARTICIPANTS
================================ */

export async function getParticipants(eventId) {

  const snap = await getDocs(
    collection(
      db,
      'events',
      eventId,
      'participants'
    )
  )

  return snap.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}


/* ==============================
   GET MY EVENTS
================================ */

export async function getMyEvents(uid) {

  const eventsQuery = query(
    collection(db, 'events'),
    where(
      'memberIds',
      'array-contains',
      uid
    )
  )

  const eventSnap =
    await getDocs(eventsQuery)


  const result = []


  for (const eventDocument of eventSnap.docs) {

    const membersSnap =
      await getDocs(
        collection(
          db,
          'events',
          eventDocument.id,
          'participants'
        )
      )


    result.push({
      id: eventDocument.id,
      ...eventDocument.data(),
      members: membersSnap.size
    })
  }


  return result
}


/* ==============================
   JOIN EVENT
================================ */

export async function joinEventByCode(
  user,
  rawCode
) {

  const code =
    rawCode.trim().toUpperCase()


  const snap =
    await getDocs(
      query(
        collection(db, 'events'),
        where(
          'joinCode',
          '==',
          code
        )
      )
    )


  if (snap.empty) {
    throw new Error(
      'Не постои настан со овој код.'
    )
  }


  const eventDocument =
    snap.docs[0]

  const event =
    eventDocument.data()


  if (event.status !== 'open') {
    throw new Error(
      'Настанот веќе не прима нови членови.'
    )
  }


  // Proverka dali vekje e clen
  const participantRef =
    doc(
      db,
      'events',
      eventDocument.id,
      'participants',
      user.uid
    )


  const participantSnap =
    await getDoc(participantRef)


  if (participantSnap.exists()) {
    throw new Error(
      'Веќе сте член на овој настан.'
    )
  }


  // Dodavanje vo participants
  await setDoc(
    participantRef,
    {
      uid: user.uid,
      name: user.name,
      email: user.email,

      role:
        event.ownerId === user.uid
          ? 'organizer'
          : 'member',

      joinedAt:
        serverTimestamp()
    }
  )


  // Dodavanje UID vo memberIds
  await updateDoc(
    doc(
      db,
      'events',
      eventDocument.id
    ),
    {
      memberIds:
        arrayUnion(user.uid)
    }
  )


  return eventDocument.id
}


/* ==============================
   UPDATE EVENT
================================ */

export async function updateEvent(
  eventId,
  payload
) {

  await updateDoc(
    doc(db, 'events', eventId),
    payload
  )
}


/* ==============================
   REMOVE PARTICIPANT
================================ */

export async function removeParticipant(
  eventId,
  uid
) {

  // Brisenje od participants
  await deleteDoc(
    doc(
      db,
      'events',
      eventId,
      'participants',
      uid
    )
  )


  // Brisenje i od memberIds
  await updateDoc(
    doc(
      db,
      'events',
      eventId
    ),
    {
      memberIds:
        arrayRemove(uid)
    }
  )
}


/* ==============================
   SHUFFLE
================================ */

function shuffled(array) {

  const copy =
    [...array]


  for (
    let i = copy.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      )


    ;[
      copy[i],
      copy[j]
    ] = [
      copy[j],
      copy[i]
    ]
  }


  return copy
}


/* ==============================
   SECRET SANTA DRAW
================================ */

export async function drawSecretSanta(
  eventId
) {

  const event =
    await getEvent(eventId)


  if (!event) {
    throw new Error(
      'Настанот не постои.'
    )
  }


  if (event.status === 'drawn') {
    throw new Error(
      'Извлекувањето веќе е направено.'
    )
  }


  const participants =
    await getParticipants(eventId)


  if (participants.length < 3) {
    throw new Error(
      'Потребни се најмалку 3 учесници.'
    )
  }


  const givers =
    [...participants]


  let receivers =
    shuffled(participants)


  let attempts = 0


  // Nikoj ne smee da se izvlece samiot sebe
  while (
    receivers.some(
      (receiver, index) =>
        receiver.uid ===
        givers[index].uid
    ) &&
    attempts < 100
  ) {

    receivers =
      shuffled(participants)

    attempts++
  }


  // Siguren fallback
  if (
    receivers.some(
      (receiver, index) =>
        receiver.uid ===
        givers[index].uid
    )
  ) {

    receivers = [
      ...participants.slice(1),
      participants[0]
    ]
  }


  const batch =
    writeBatch(db)


  givers.forEach(
    (giver, index) => {

      const receiver =
        receivers[index]


      batch.set(
        doc(
          db,
          'events',
          eventId,
          'assignments',
          giver.uid
        ),
        {
          giverUid:
            giver.uid,

          receiverUid:
            receiver.uid,

          receiverName:
            receiver.name,

          receiverEmail:
            receiver.email,

          createdAt:
            serverTimestamp()
        }
      )
    }
  )


  batch.update(
    doc(
      db,
      'events',
      eventId
    ),
    {
      status: 'drawn',
      drawnAt:
        serverTimestamp()
    }
  )


  await batch.commit()
}


/* ==============================
   GET MY SECRET SANTA
================================ */

export async function getMyAssignment(
  eventId,
  uid
) {

  const snap =
    await getDoc(
      doc(
        db,
        'events',
        eventId,
        'assignments',
        uid
      )
    )


  return snap.exists()
    ? snap.data()
    : null
}