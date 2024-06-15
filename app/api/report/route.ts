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

    console.log('message : ', message);

    const reportData = {
        user: { connect: { id: currentUser.id } },
        message: message,
    };
    const createdReport = await prisma.report.create({
        data: reportData,
    });

    return NextResponse.json({ createdReport });
}

export async function GET() {
    const reports = await prisma.report.findMany({
        select: {
            id: true,
            message: true,
            createdAt: true,
            user: {
                select: {
                    id: true,
                    email: true,
                    image: true,
                    name: true,
                    accounts: {
                        select: {
                            type: true,
                        },
                    },
                },
            },
        }
    });

    return NextResponse.json({
        data: reports,
        message: 'success get all reports'
    });
}