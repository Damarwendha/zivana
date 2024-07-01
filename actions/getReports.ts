import prisma from '@/libs/prismadb'

export default async function getReports() {
    try {
        return await prisma.report.findMany({
            include: {
                user: {
                    include: {
                        accounts: {},
                    },
                },
            }
        });
    } catch (error: any) {
        throw new Error(error)
    }
}