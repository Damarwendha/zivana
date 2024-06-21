import prisma from "@/libs/prismadb";

interface IParams {
  orderId?: string;
}

export default async function getOrderById(params: IParams) {
  try {
    const { orderId } = params;
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (order?.orderLocationId) {
      const location = await prisma.orderLocation.findUnique({
        where: { id: order.orderLocationId },
      });

      if (location) {
        order.ongkir = location.price;
        order.amount = order.amount - location.price;
      }
    }

    if (!order) return null;
    return order;
  } catch (error: any) {
    throw new Error(error);
  }
}
