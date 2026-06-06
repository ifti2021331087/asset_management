"use server";

import { success, z } from "zod";
import { auth } from "../lib/auth";
import { headers } from "next/headers";
import { db } from "../lib/db";
import { asset, category, user } from "../lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const CategorySchema = z.object({
    name:
        z.string().
            min(2, "Category name must be at least 2 characters").
            max(50, "Category name must be at max 50 characters")
})

export type categoryFormValues = z.infer<typeof CategorySchema>;

export async function addNewCategoryAction(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user || session?.user.role !== 'admin') {
        throw new Error('You must be admin to add categories');
    }

    try {
        const name = formData.get('name') as string;
        const validateFields = CategorySchema.parse({ name });
        const existingCategories = await db.select().from(category).
            where(eq(category.name, validateFields.name)).limit(1);

        if (existingCategories.length > 0) {
            return {
                success: false,
                message: 'Category already exists! Please try with a different name.'
            }
        }

        await db.insert(category).values({
            name: validateFields.name,
        })
        revalidatePath('/admin/settings')
        return {
            success: true,
            message: "New category added"
        }
    }
    catch (e) {
        return {
            success: false,
            message: 'Failed to add category'
        }
    }
}

export async function getAllCategoriesAction() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user || session?.user.role !== 'admin') {
        throw new Error('You must be admin to access this data');
    }
    try {
        return await db.select().from(category).orderBy(category.name);
    }
    catch (e) {
        console.log(e);
        return [];
    }
}

export async function getTotalUserCount() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user || session?.user.role !== 'admin') {
        throw new Error('You must be admin to access this data');
    }

    try {
        const result = await db.select({ count: sql<number>`count(*)` }).from(user);
        return result[0]?.count || 0;
    }
    catch (e) {
        console.log(e);
        return 0;
    }
}

export async function deleteCategoryAction(categoryId: number) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user || session?.user.role !== 'admin') {
        throw new Error('You must be admin to delete the category');
    }

    try {
        await db.delete(category).where(eq(category.id, categoryId));
        revalidatePath('/admin/settings');
        return {
            success: true,
            message: 'Category deleted successfully'
        }
    }
    catch (e) {
        return {
            success: false,
            message: 'Failed to delete category'
        }
    }
}

export async function approveAssetAction(assetId: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user || session?.user.role !== 'admin') {
        throw new Error('You must be admin to approve this data');
    }
    try {
        await db.update(asset).set({ isApproved: 'approved', updatedAt: new Date() }).where(eq(asset.id, assetId))
        revalidatePath("/admin/asset-approval");
        return {
            success: true
        }
    }

    catch (e) {
        return {
            success: false
        }
    }
}

export async function rejectAssetAction(assetId: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user || session?.user.role !== 'admin') {
        throw new Error('You must be admin to reject this data');
    }

    try {
        await db.update(asset).set({ isApproved: 'rejected', updatedAt: new Date() }).where(eq(asset.id, assetId))
        revalidatePath("/admin/asset-approval");
        return {
            success: true
        }
    }
    catch (e) {
        return {
            success: false
        }
    }

}

export async function getTotalAssetsCount() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user || session?.user.role !== 'admin') {
        throw new Error('You must be admin to access this data');
    }

    try {
        const result = await db.select({ count: sql<number>`count(*)` }).from(asset);
        return result[0]?.count || 0;
    }
    catch (e) {
        console.log(e);
        return 0;
    }
}

export async function getPendingAssetsAction() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user || session?.user.role !== 'admin') {
        throw new Error('You must be admin to access this data');
    }
    try {
        const pendingAssets = await db
        .select({
            asset:asset,
            userName:user.name
        })
        .from(asset)
        .leftJoin(user,eq(asset.userId,user.id))
        .where(eq(asset.isApproved,"pending"));

        return pendingAssets;
    }
    catch (e) {
        return [];
    }

}