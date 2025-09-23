// /types/index.ts

import { FieldValue, Timestamp } from "firebase/firestore";

// ============================================================================
// 🪐 PILAR 1: O ECOSSISTEMA (system)
// ============================================================================

/**
 * Representa uma pousada (tenant) dentro da plataforma Synapse.
 * Coleção: /tenants/{propertyId}
 */
export interface Tenant {
  id: string; // O mesmo que propertyId
  name: string;
  plan: "premium" | "basic";
  status: "active" | "suspended";
  ownerUid: string; // UID do Firebase Auth do proprietário
  createdAt: Timestamp | FieldValue;
}

/**
 * Representa um administrador da plataforma Synapse.
 * Coleção: /platformAdmins/{adminUid}
 */
export interface PlatformAdmin {
  uid: string;
  email: string;
  role: "superadmin" | "support";
}

// ============================================================================
// 🏡 PILAR 2: A PROPRIEDADE (properties)
// ============================================================================

/**
 * O documento central que define uma pousada e suas configurações.
 * Coleção: /properties/{propertyId}
 */
export interface Property {
  id: string;
  profile: {
    name: string;
    logoUrl?: string;
    address: {
      street: string;
      city: string;
      mapsLink?: string;
    };
    contact: {
      phone: string;
      whatsapp: string;
      email: string;
    };
  };
  customization: {
    primaryColor: string;
    font: string;
  };
  settings: {
    module_concierge: {
      enabled: boolean;
      operatingHours: { start: string; end: string }; // Ex: "08:00", "22:00"
    };
    module_housekeeping: {
      enabled: boolean;
      bookingHours: { start: string; end: string };
    };
    module_breakfast: {
      enabled: boolean;
      modality: "delivery" | "salon" | "both";
      orderDeadline: string; // Ex: "20:00"
      servingHours: { start: string; end: string };
    };
    generalAccess: {
      mainGateCode?: string;
      socialAreaWifiSsid?: string;
      socialAreaWifiPassword?: string;
    };
  };
}

/**
 * Item do inventário que um hóspede pode solicitar (produtos e serviços).
 * Subcoleção: /properties/{propertyId}/catalog/{itemId}
 */
export interface CatalogItem {
  id: string;
  name: string;
  type: "loan" | "consumable" | "food" | "beverage";
  category: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isActive: boolean;
  stockControl: {
    enabled: boolean;
    quantity: number;
  };
}

/**
 * Item do inventário que um hóspede pode agendar (recursos e serviços com horário).
 * Subcoleção: /properties/{propertyId}/resources/{resourceId}
 */
export interface Resource {
  id: string;
  name: string;
  type: "amenity" | "service"; // Ex: Jacuzzi | Limpeza de Quarto
  capacity: number;
  bookingDuration: number; // Em minutos
  rules?: string;
  requiresConfirmation: boolean;
  isActive: boolean;
}

/**
 * Conteúdo do CMS da pousada (guias, políticas, etc.).
 * Subcoleção: /properties/{propertyId}/content/{contentId}
 */
export interface Content {
  id: string;
  title: string;
  type: "policy" | "guide" | "event" | "manual" | "procedure";
  category: string;
  targetAudience: Array<"reception" | "guest" | "all">;
  body: string; // Rich text ou markdown
  isPublished: boolean;
  eventDetails?: {
    start: Timestamp;
    end: Timestamp;
    location: string;
  };
}

/**
 * Representa uma acomodação (cabana, quarto, etc.).
 * Subcoleção: /properties/{propertyId}/cabins/{cabinId}
 */
export interface Cabin {
  id: string;
  name: string;
  description?: string;
  capacity: number;
  isPetFriendly: boolean;
  isActive: boolean;
  details: {
    bedrooms: number;
    bathrooms: number;
    hasKitchen: boolean;
  };
  linkedEquipment?: string[]; // Ex: ["jacuzzi", "cofre"]
  accessInfo: {
    wifiSsid: string;
    wifiPassword?: string;
    gateCode?: string;
  };
}

/**
 * Membro da equipe da pousada.
 * Subcoleção: /properties/{propertyId}/staff/{staffMemberId}
 */
export interface StaffMember {
  id: string;
  uid: string; // Firebase Auth UID
  name: string;
  email: string;
  role: "reception" | "housekeeping" | "manager" | "kitchen";
  isActive: boolean;
}

/**
 * Template de mensagem para comunicação automatizada ou manual.
 * Subcoleção: /properties/{propertyId}/messageTemplates/{templateId}
 */
export interface MessageTemplate {
  id: string;
  name: string;
  trigger: "check-in" | "checkout-morning" | "manual";
  channel: "whatsapp" | "email" | "push";
  body: string; // Ex: "Olá, {guestName}!"
}

// ============================================================================
// 👤 PILAR 3: O HÓSPEDE (guests)
// ============================================================================

/**
 * Armazena o histórico de um hóspede na pousada (CRM).
 * Subcoleção: /properties/{propertyId}/guests/{guestCPF}
 */
export interface Guest {
  id: string; // O CPF do hóspede
  identity: {
    fullName: string;
    cpf: string;
    birthDate?: Timestamp;
    email: string;
    phone: string;
    address?: string;
  };
  history: {
    totalStays: number;
    totalSpent: number;
    lastVisit?: Timestamp;
  };
  notes?: {
    preferences?: string;
    warnings?: string;
  };
}

// ============================================================================
// 🛎️ PILAR 4: A ESTADIA (stays)
// ============================================================================

/**
 * O registro mestre de uma hospedagem.
 * Subcoleção: /properties/{propertyId}/stays/{stayId}
 */
export interface Stay {
  id: string;
  guestRef: string; // Document ID (CPF) do hóspede
  cabinRef: string; // Document ID da cabana
  checkIn: Timestamp;
  checkOut: Timestamp;
  status: "active" | "upcoming" | "completed" | "cancelled";
  breakfastModalityOverride?: "delivery" | "salon";
  checkInForm?: any; // A ser definido conforme o formulário
  // Para facilitar o acesso, podemos desnormalizar alguns dados
  guestName?: string;
  cabinName?: string;
}

/**
 * Um pedido feito pelo hóspede durante a estadia.
 * Subcoleção: /properties/{propertyId}/stays/{stayId}/orders/{orderId}
 */
export interface Order {
  id: string;
  catalogItemRef: string; // Document ID do CatalogItem
  quantity: number;
  totalPrice: number;
  observations?: string;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  createdAt: Timestamp | FieldValue;
  // Desnormalização para facilitar a exibição
  itemName?: string;
}

/**
 * Um agendamento feito pelo hóspede durante a estadia.
 * Subcoleção: /properties/{propertyId}/stays/{stayId}/bookings/{bookingId}
 */
export interface Booking {
  id: string;
  resourceRef: string; // Document ID do Resource
  scheduledFor: Timestamp;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: Timestamp | FieldValue;
  // Desnormalização
  resourceName?: string;
}

/**
 * Um evento na linha do tempo da estadia.
 * Subcoleção: /properties/{propertyId}/stays/{stayId}/timeline/{eventId}
 */
export interface TimelineEvent {
  id: string;
  timestamp: Timestamp;
  actor: string; // "guest", "system", ou "staff:email@pousada.com"
  message: string;
}

/**
 * Registro de uma comunicação enviada ao hóspede.
 * Subcoleção: /properties/{propertyId}/stays/{stayId}/communications/{communicationId}
 */
export interface Communication {
  id: string;
  templateRef: string; // Document ID do MessageTemplate
  channel: "whatsapp" | "email" | "push";
  status: "sent" | "delivered" | "failed";
  sentBy: string; // "automation:check-in" ou "staff:email@pousada.com"
  sentAt: Timestamp;
  messageBody: string; // O corpo da mensagem com as variáveis preenchidas
}