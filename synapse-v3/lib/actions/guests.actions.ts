// /lib/actions/guests.actions.ts

"use server";

import { adminDb } from "@/lib/firebase/server";
import { Guest } from "@/types";

// Helper para converter Timestamps do Firestore para strings JSON-compatíveis
const transformGuestData = (doc: any): any => {
  const data = doc.data();
  // Transforma os timestamps aninhados, se existirem
  const identity = data.identity ? {
    ...data.identity,
    birthDate: data.identity.birthDate?.toDate().toISOString(),
  } : {};

  const history = data.history ? {
    ...data.history,
    lastVisit: data.history.lastVisit?.toDate().toISOString(),
  } : {};

  return {
    id: doc.id,
    ...data,
    identity,
    history,
  };
};

export async function getGuestsForProperty(propertyId: string): Promise<Guest[]> {
  if (!propertyId) {
    console.error("Property ID is required.");
    return [];
  }

  try {
    const guestsRef = adminDb.collection(`properties/${propertyId}/guests`);
    const snapshot = await guestsRef.orderBy("identity.fullName").get();

    if (snapshot.empty) {
      return [];
    }

    const guests = snapshot.docs.map(transformGuestData);
    return guests as Guest[];

  } catch (error) {
    console.error("Error fetching guests: ", error);
    return [];
  }
}