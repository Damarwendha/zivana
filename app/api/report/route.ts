import prisma from "@/libs/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const body = await request.json();
    const { message } = body;

    const reportData = {
        user: { connect: { id: currentUser.id } },
        message: message,
    };
    const createdReport = await prisma.report.create({
        data: reportData,
    });

    return NextResponse.json({ createdReport });
}