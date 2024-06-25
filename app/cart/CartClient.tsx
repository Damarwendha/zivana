"use client";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import Heading from "../components/Heading";
import Button from "../components/Button";
import ItemContent from "./ItemContent";
import { formatPrice } from "@/utils/formatPrice";
import { SafeUser } from "@/types";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

interface CartClientProps {
  currentUser: SafeUser | null;
}

const CartClient: React.FC<CartClientProps> = ({ currentUser }) => {
  const { cartProducts, handleClearCart, cartTotalAmount } = useCart();

  const router = useRouter();

  // console.log("cartprods", cartProducts);

  async function onCheckout() {
    await axios
      .post("/api/checkStock", {
        items: cartProducts?.map((c) => {
          return { id: c.id, quantity: c.quantity };
        }),
      })
      .then((res) => {
        router.push("/checkout");
      })
      .catch((err: any) => {
        toast.error(
          err.response.data.error.split("nama:")[1] +
            ". Tolong kurangi jumlah-nya"
        );
        console.log("error", err);
      });
  }

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-2xl">Keranjang masih kosong</div>
        <div>
          <Link
            href={"/"}
            className="flex items-center gap-1 mt-2 text-slate-500"
          >
            <MdArrowBack />
            <span>Belanja dulu</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Heading title="Keranjang Belanja" center />
      <div className="grid items-center grid-cols-5 gap-4 pb-2 mt-8 text-xs ">
        <div className="col-span-2 justify-self-start">PRODUk</div>
        <div className="justify-self-center">HARGA</div>
        <div className="justify-self-center">JUMLAH</div>
        <div className="justify-self-end">TOTAL</div>
      </div>
      <div>
        {cartProducts &&
          cartProducts.map((item) => {
            return <ItemContent key={item.id} item={item} />;
          })}
      </div>
      <div className="border-t-[1.5px] border-slate-200 py-4 flex justify-between gap-4">
        <div className="w-[120px]">
          <Button
            small
            outline
            label="Bersihkan keranjang"
            onClick={() => {
              handleClearCart();
            }}
          />
        </div>
        <div className="flex flex-col items-start gap-1 text-sm">
          <div className="flex justify-between w-full text-base font-semibold">
            <span>Subtotal</span>
            <span>{formatPrice(cartTotalAmount)}</span>
          </div>
          <p className="text-slate-500"></p>
          <Button
            label={currentUser ? "Pembayaran" : "Login untuk Pembayaran"}
            outline={currentUser ? false : true}
            onClick={() => {
              currentUser ? onCheckout() : router.push("/login");
            }}
          />
          <Link
            href={"/"}
            className="flex items-center gap-1 mt-2 text-slate-500"
          >
            <MdArrowBack />
            <span>Lanjut Belanja</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartClient;
