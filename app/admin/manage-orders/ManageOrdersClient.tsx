/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Order, User } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatPrice } from "@/utils/formatPrice";
import Heading from "@/app/components/Heading";
import Status from "@/app/components/Status";
import StatusOrder from "@/app/components/StatusOrder";
import {
  MdOutlinePayment,
  MdAccessTimeFilled,
  MdDeliveryDining,
  MdDone,
  MdRemoveRedEye,
} from "react-icons/md";
import ActionBtn from "@/app/components/ActionBtn";
import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import moment from "moment";
import Image from "next/image";

interface ManageOrdersClientProps {
  orders: ExtendedOrder[];
}

type ExtendedOrder = Order & {
  user: User;
};

const ManageOrdersClient: React.FC<ManageOrdersClientProps> = ({ orders }) => {
  const router = useRouter();
  let rows: any = [];

  if (orders) {
    rows = orders.map((order) => {
      return {
        id: order.id,
        customer: order.user.name,
        amount: formatPrice(order.amount),
        transferImage: order.transferImage,
        paymentStatus: order.status,
        date: moment(order.createDate).locale("id").format("ll"),
        deliveryStatus: order.deliveryStatus,
      };
    });
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 170 },
    { field: "customer", headerName: "Nama Pelanggan", width: 180 },
    {
      field: "amount",
      headerName: "Jumlah (Rp)",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="font-bold text-slate-800">{params.row.amount}</div>
        );
      },
    },
    {
      field: "paymentStatus",
      headerName: "Status Pembayaran",
      width: 210,
      renderCell: (params) => {
        return (
          <div>
            {params.row.paymentStatus === "pending" ? (
              <Status
                text="Belum Membayar"
                icon={MdAccessTimeFilled}
                bg="bg-slate-200"
                color="text-slate-700"
              />
            ) : params.row.paymentStatus === "complete" ? (
              <Status
                text="Selesai Pembayaran"
                icon={MdDone}
                bg="bg-green-200"
                color="text-green-700"
              />
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
    {
      field: "deliveryStatus",
      headerName: "Status Pengiriman",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            {params.row.deliveryStatus === "pending" ? (
              <StatusOrder
                text="Belum Dikirim"
                bg="bg-slate-200"
                color="text-slate-700"
              />
            ) : params.row.deliveryStatus === "dispatched" ? (
              <StatusOrder
                text="Dalam Perjalanan"
                bg="bg-purple-200"
                color="text-purple-700"
              />
            ) : params.row.deliveryStatus === "delivered" ? (
              <StatusOrder
                text="Sampai Tujuan"
                bg="bg-green-200"
                color="text-green-700"
              />
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
    {
      field: "date",
      headerName: "Tanggal",
      width: 165,
    },
    {
      field: "transferImage",
      headerName: "Bukti TF",
      width: 165,
      renderCell: (params) => {
        return (
          <div
            onClick={() =>
              router.push(
                params?.value ||
                  "https://firebasestorage.googleapis.com/v0/b/pa-zivana.appspot.com/o/products%2F1716109684341-WhatsApp%20Image%202024-04-18%20at%2019.54.55.jpeg?alt=media&token=4ed5dae0-6338-4615-9888-7d0545ed9dc8"
              )
            }
            className="relative w-[70px] aspect-square"
          >
            <Image
              src={
                params?.value ??
                "https://firebasestorage.googleapis.com/v0/b/pa-zivana.appspot.com/o/products%2F1716109684341-WhatsApp%20Image%202024-04-18%20at%2019.54.55.jpeg?alt=media&token=4ed5dae0-6338-4615-9888-7d0545ed9dc8"
              }
              alt="bukti tf"
              fill
              className="object-contain"
            />
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Aksi",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex justify-between gap-4 w-full">
            <ActionBtn
                icon={MdOutlinePayment}
                onClick={() => {
                  handleConfirmPayment(params.row.id);
                }}
            />
            <ActionBtn
              icon={MdDeliveryDining}
              onClick={() => {
                handleDispatch(params.row.id);
              }}
            />
            <ActionBtn
              icon={MdDone}
              onClick={() => {
                handleDeliver(params.row.id);
              }}
            />
            <ActionBtn
              icon={MdRemoveRedEye}
              onClick={() => {
                router.push(`/order/${params.row.id}`);
              }}
            />
          </div>
        );
      },
    },
  ];

  const handleConfirmPayment = useCallback((id: string) => {
    axios.put("/api/order", {
      id,
      status: "complete",
    }).then((res) => {
      toast.success("Pembayaran Dikonfirmasi");
      router.refresh();
    }).catch((err) => {
      toast.error("Konfirmasi pembayaran gagal");
      console.log(err);
    });
  }, []);

  const handleDispatch = useCallback((id: string) => {
    axios
      .put("/api/order", {
        id,
        deliveryStatus: "dispatched",
      })
      .then((res) => {
        toast.success("Pesanan Dikirim");
        router.refresh();
      })
      .catch((err) => {
        toast.error("Oops! Something went wrong");
        console.log(err);
      });
  }, []);

  const handleDeliver = useCallback((id: string) => {
    axios
      .put("/api/order", {
        id,
        deliveryStatus: "delivered",
      })
      .then((res) => {
        toast.success("Pesanan Terkirim");
        router.refresh();
      })
      .catch((err) => {
        toast.error("Oops! gagal");
        console.log(err);
      });
  }, []);

  return (
    <div className="max-w-[1150px] m-auto text-xl">
      <div className="mb-4 mt-8">
        <Heading title="Kelola Orderan" center />
      </div>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 9 },
            },
          }}
          pageSizeOptions={[9, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
};

export default ManageOrdersClient;
