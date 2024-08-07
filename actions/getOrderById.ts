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

    if (!order) return null;

    let newOrder: any = order;

    if (order?.orderLocationId) {
      const location = await prisma.orderLocation.findUnique({
        where: { id: order.orderLocationId },
      });

      if (location) {
        newOrder.ongkir = location.price;
        newOrder.amount = order.amount - location.price;
      }
    }

    return newOrder;
  } catch (error: any) {
    throw new Error(error);
  }
}
