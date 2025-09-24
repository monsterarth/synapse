// /lib/actions/resources.actions.ts

"use server";

import { adminDb } from "@/lib/firebase/server";
import { Resource, ScheduleRule } from "@/types";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

const transformData = (doc: any): any => {
    const data = doc.data();
    return { id: doc.id, ...data };
};

export async function getResources(propertyId: string): Promise<Resource[]> {
    if (!propertyId) {
        console.error("Property ID is required.");
        return [];
    }
    try {
        const resourcesRef = adminDb.collection(`properties/${propertyId}/resources`);
        const snapshot = await resourcesRef.orderBy("name").get();
        if (snapshot.empty) return [];
        return snapshot.docs.map(transformData) as Resource[];
    } catch (error) {
        console.error("Error fetching resources: ", error);
        return [];
    }
}

export async function createResource(propertyId: string, resourceData: Omit<Resource, 'id'>) {
    if (!propertyId || !resourceData) {
        return { success: false, message: "Dados inválidos." };
    }
    try {
        const resourcesRef = adminDb.collection(`properties/${propertyId}/resources`);
        await resourcesRef.add(resourceData);
        revalidatePath("/recursos");
        return { success: true, message: "Recurso criado com sucesso!" };
    } catch (error) {
        console.error("Error creating resource:", error);
        return { success: false, message: "Falha ao criar o recurso." };
    }
}

export async function deleteResource(propertyId: string, resourceId: string) {
    if (!propertyId || !resourceId) {
        return { success: false, message: "IDs inválidos." };
    }
    try {
        const resourceRef = adminDb.doc(`properties/${propertyId}/resources/${resourceId}`);
        await resourceRef.delete();
        revalidatePath("/recursos");
        return { success: true, message: "Recurso excluído com sucesso!" };
    } catch (error) {
        console.error("Error deleting resource:", error);
        return { success: false, message: "Falha ao excluir o recurso." };
    }
}

export async function getResourceById(propertyId: string, resourceId: string): Promise<Resource | null> {
    if (!propertyId || !resourceId) return null;
    try {
        const resourceRef = adminDb.doc(`properties/${propertyId}/resources/${resourceId}`);
        const doc = await resourceRef.get();
        if (!doc.exists) {
            notFound();
        }
        return transformData(doc) as Resource;
    } catch (error) {
        console.error("Error fetching resource by ID:", error);
        return null;
    }
}

export async function updateResource(propertyId: string, resourceId: string, resourceData: Partial<Resource>) {
    if (!propertyId || !resourceId || !resourceData) {
        return { success: false, message: "Dados inválidos." };
    }
    try {
        const resourceRef = adminDb.doc(`properties/${propertyId}/resources/${resourceId}`);
        await resourceRef.update(resourceData);
        revalidatePath("/recursos");
        revalidatePath(`/recursos/${resourceId}/edit`);
        return { success: true, message: "Recurso atualizado com sucesso!" };
    } catch (error) {
        console.error("Error updating resource:", error);
        return { success: false, message: "Falha ao atualizar o recurso." };
    }
}

/**
 * Atualiza apenas as regras de horário de um recurso.
 */
export async function updateResourceSchedules(propertyId: string, resourceId: string, schedules: ScheduleRule[]) {
    if (!propertyId || !resourceId) {
        return { success: false, message: "Dados inválidos." };
    }
    try {
        const resourceRef = adminDb.doc(`properties/${propertyId}/resources/${resourceId}`);
        // O Firestore aceita 'undefined' para remover um campo, então garantimos que seja um array.
        await resourceRef.update({ schedules: schedules || [] });
        
        revalidatePath(`/recursos/${resourceId}/horarios`);
        
        return { success: true, message: "Horários atualizados com sucesso!" };
    } catch (error) {
        console.error("Error updating resource schedules:", error);
        return { success: false, message: "Falha ao atualizar os horários." };
    }
}