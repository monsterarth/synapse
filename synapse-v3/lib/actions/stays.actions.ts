// /lib/actions/stays.actions.ts

"use server";

import { adminDb } from "@/lib/firebase/server";
import { Stay } from "@/types";
import { DocumentData, QueryDocumentSnapshot } from "firebase-admin/firestore";

// Helper para converter Timestamps do Firestore para strings JSON-compatíveis
const transformData = (doc: QueryDocumentSnapshot<DocumentData>): Omit<Stay, 'guestName' | 'cabinName'> => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    checkIn: data.checkIn?.toDate().toISOString(),
    checkOut: data.checkOut?.toDate().toISOString(),
  } as Omit<Stay, 'guestName' | 'cabinName'>;
};


export async function getStaysForProperty(propertyId: string): Promise<Stay[]> {
  if (!propertyId) {
    console.error("Property ID is required.");
    return [];
  }

  try {
    const staysRef = adminDb.collection(`properties/${propertyId}/stays`);
    const snapshot = await staysRef.orderBy("checkIn", "desc").get();

    if (snapshot.empty) {
      return [];
    }

    // Usaremos Promise.all para buscar dados relacionados (hóspede e cabana) em paralelo
    const staysPromises = snapshot.docs.map(async (doc) => {
      const stayData = transformData(doc);
      let guestName = 'Hóspede não encontrado';
      let cabinName = 'Cabana não encontrada';

      // Busca o nome do hóspede
      if (stayData.guestRef) {
        const guestDoc = await adminDb.collection(`properties/${propertyId}/guests`).doc(stayData.guestRef).get();
        if (guestDoc.exists) {
          guestName = guestDoc.data()?.identity.fullName || guestName;
        }
      }

      // Busca o nome da cabana
      if (stayData.cabinRef) {
        const cabinDoc = await adminDb.collection(`properties/${propertyId}/cabins`).doc(stayData.cabinRef).get();
        if (cabinDoc.exists) {
           cabinName = cabinDoc.data()?.name || cabinName;
        }
      }
      
      return { ...stayData, guestName, cabinName } as Stay;
    });

    const stays = await Promise.all(staysPromises);
    return stays;

  } catch (error) {
    console.error("Error fetching stays: ", error);
    // Em um app de produção, você poderia logar este erro em um serviço de monitoramento
    return [];
  }
}