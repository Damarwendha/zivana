import prisma from '@/libs/prismadb'

export default async function getLocations(){
    try {
        const locations = await prisma.orderLocation.findMany({
            select: {
                id: true,
                city: true,
                price: true
            }
        })

        return locations
    } catch (error: any) {
        throw new Error(error)
    }
}