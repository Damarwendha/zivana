import prisma from '@/libs/prismadb'

export default async function getReports() {
    try {
        return await prisma.report.findMany({
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
    } catch (error: any) {
        throw new Error(error)
    }
}