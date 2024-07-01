import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const currentUser = await getCurrentUser();

    if (!currentUser) return NextResponse.error();

    if (currentUser.role !== "ADMIN") return NextResponse.error();

    const order = await prisma?.order.delete({
        where: { id: params.id },
    });

    return NextResponse.json(order);
}