// /lib/actions/orders.actions.ts

"use server";

import { adminDb } from "@/lib/firebase/server";
import { Order, Stay } from "@/types";
import { Timestamp } from "firebase-admin/firestore";

// Interface para o tipo de dado que a página realmente precisa
export interface BreakfastOrderInfo extends Order {
  guestName: string;
  cabinName: string;
}

// Helper para converter Timestamps
const transformOrderData = (doc: any): any => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate().toISOString(),
    };
  };

export async function getTodaysBreakfastOrders(propertyId: string): Promise<BreakfastOrderInfo[]> {
  if (!propertyId) {
    console.error("Property ID is required.");
    return [];
  }

  try {
    // 1. Encontrar todas as estadias ativas
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const staysRef = adminDb.collection(`properties/${propertyId}/stays`);
    const activeStaysSnapshot = await staysRef
        .where('status', '==', 'active')
        .get();

    if (activeStaysSnapshot.empty) {
      return [];
    }
    
    const allOrders: BreakfastOrderInfo[] = [];

    // 2. Para cada estadia ativa, buscar os pedidos de café da manhã de hoje
    for (const stayDoc of activeStaysSnapshot.docs) {
        const stayData = stayDoc.data() as Stay;
        const guestName = stayData.guestName || "Hóspede";
        const cabinName = stayData.cabinName || "Cabana";

        const ordersRef = stayDoc.ref.collection('orders');
        const ordersSnapshot = await ordersRef
            .where('createdAt', '>=', Timestamp.fromDate(today))
            .where('createdAt', '<', Timestamp.fromDate(tomorrow))
            .get();

        if (ordersSnapshot.empty) {
            continue;
        }

        const stayOrders: BreakfastOrderInfo[] = [];
        // Usaremos Promise.all para enriquecer os pedidos com os nomes dos itens
        const ordersPromises = ordersSnapshot.docs.map(async (orderDoc) => {
            const orderData = transformOrderData(orderDoc) as Order;

            // Buscando o nome do item no catálogo
            if(orderData.catalogItemRef) {
                const itemDoc = await adminDb.collection(`properties/${propertyId}/catalog`).doc(orderData.catalogItemRef).get();
                if(itemDoc.exists) {
                    // Filtra apenas itens de comida e bebida (assumindo que são café da manhã)
                    const itemType = itemDoc.data()?.type;
                    if(itemType === 'food' || itemType === 'beverage'){
                        return {
                            ...orderData,
                            itemName: itemDoc.data()?.name || "Item não encontrado",
                            guestName,
                            cabinName,
                        } as BreakfastOrderInfo;
                    }
                }
            }
            return null;
        });

        const resolvedOrders = (await Promise.all(ordersPromises)).filter(Boolean) as BreakfastOrderInfo[];
        allOrders.push(...resolvedOrders);
    }
    
    return allOrders;

  } catch (error) {
    console.error("Error fetching breakfast orders: ", error);
    return [];
  }
}