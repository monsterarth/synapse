// /app/api/setup/route.ts

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/server";
import { Property } from "@/types";

export async function POST(req: NextRequest) {
  try {
    // --- PASSO 1: Proteger a Rota ---
    const bearer = req.headers.get("Authorization");
    const token = bearer?.split("Bearer ")[1];

    if (token !== process.env.SETUP_SECRET_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // --- PASSO 2: Definir os Dados Iniciais ---
    const propertyId = "pousada-fazenda-digital";
    const propertyRef = adminDb.collection("properties").doc(propertyId);
    
    // Verifica se a propriedade já existe para não sobrescrever
    const docSnapshot = await propertyRef.get();
    if (docSnapshot.exists) {
      return NextResponse.json({ message: "Property already exists. Setup not needed." }, { status: 200 });
    }
    
    // Dados completos da propriedade, como definimos anteriormente
    const propertyData: Omit<Property, 'id'> = {
        profile: {
            name: "Pousada Fazenda Digital (Gerada via Setup)",
            address: { street: "Rua Teste, 123", city: "Garopaba" },
            contact: { phone: "48999999999", whatsapp: "48999999999", email: "contato@fazendadigital.com" }
        },
        customization: {
            primaryColor: "#16a34a",
            font: "Inter"
        },
        settings: {
            module_concierge: { enabled: true, operatingHours: { start: "08:00", end: "22:00" } },
            module_housekeeping: { enabled: true, bookingHours: { start: "09:00", end: "16:00" } },
            module_breakfast: {
                enabled: true,
                modality: "delivery",
                orderDeadline: "20:00",
                servingHours: { start: "08:00", end: "10:30" }
            },
            generalAccess: { mainGateCode: "1234" }
        }
    };

    // --- PASSO 3: Criar o Documento ---
    await propertyRef.set(propertyData);

    return NextResponse.json({ success: true, message: `Property '${propertyId}' created successfully.` }, { status: 201 });

  } catch (error: any) {
    console.error("SETUP_ROUTE_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}