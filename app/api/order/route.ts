import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { CartProductType } from "@/app/product/[productId]/ProductDetails";
import getCurrentUser from "@/actions/getCurrentUser";

const calculateOrderAmount = (items: CartProductType[]) => {
  const totalPrice = items.reduce((acc, item) => {
    const itemTotal = item.price * item.quantity;
    return acc + itemTotal;
  }, 0);

  const price: any = Math.floor(totalPrice);

  return price;
};

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { items, location_id, address, transfer_image, account_target } = body;

  const location = await prisma.orderLocation.findUnique({
    where: { id: location_id },
  });

  if (!location) {
    return NextResponse.json({ error: `Location ${location_id} is not found` }, { status: 400 });
  }

  const total = calculateOrderAmount(items) * 100 + location.price;
  const orderData = {
    user: { connect: { id: currentUser.id } },
    amount: total,
    currency: "IDR",
    status: "pending",
    deliveryStatus: "pending",
    orderLocation: { connect: { id: location_id } },
    products: items,
    address: address,
    transferImage: transfer_image,
    accountTarget: account_target,
  };

  const createdOrder = await prisma.order.create({
    data: orderData,
  });

  return NextResponse.json({ createdOrder });
}

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) return NextResponse.error();

  if (currentUser.role !== "ADMIN") {
    return NextResponse.error();
  }

  const body = await request.json();
  const { id, deliveryStatus } = body;

  const order = await prisma.order.update({
    where: { id: id },
    data: { deliveryStatus },
  });

  return NextResponse.json(order);
}
