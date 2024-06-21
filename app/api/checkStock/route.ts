import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import getCurrentUser from "@/actions/getCurrentUser";

export async function POST(request: Request){
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const body = await request.json();
    const { items } = body;

    for (const itemProduct of items) {
        const productData = await prisma.product.findUnique({
            where: {
                id: itemProduct.id
            }
        });
        if (!productData) {
            return NextResponse.json({error: `data product id: ${itemProduct.id} tidak ada`}, {status: 400});
        }
        if (productData.stock < itemProduct.quantity) {
            return NextResponse.json({error: `stok product id: ${itemProduct.id}, nama: ${productData.name} tidak cukup`}, {status: 400});
        }
    }

    return NextResponse.json({message: 'stok semua product cukup'}, {status: 200});
}