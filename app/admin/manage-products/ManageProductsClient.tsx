/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Product } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatPrice } from "@/utils/formatPrice";
import Heading from "@/app/components/Heading";
import Status from "@/app/components/Status";
import {
  MdCached,
  MdClose,
  MdDelete,
  MdDone,
  MdRemoveRedEye,
} from "react-icons/md";
import ActionBtn from "@/app/components/ActionBtn";
import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteObject, getStorage, ref } from "firebase/storage";
import firebaseApp from "@/libs/firebase";

interface ManageProductsClientProps {
  products: Product[];
}

const ManageProductsClient: React.FC<ManageProductsClientProps> = ({
  products,
}) => {
  const router = useRouter();
  const storage = getStorage(firebaseApp);
  let rows: any = [];

  if (products) {
    rows = products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: formatPrice(product.price),
        category: product.category,
        brand: product.brand,
        inStock: product.inStock,
        stock: product.stock,
        images: product.images,
      };
    });
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "name", headerName: "Nama Produk", width: 220 },
    {
      field: "price",
      headerName: "Harga (Rp)",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="font-bold text-slate-800">{params.row.price}</div>
        );
      },
    },
    { field: "category", headerName: "Kategori", width: 100 },
    { field: "brand", headerName: "Merek", width: 100 },
    {
      field: "inStock",
      headerName: "Stok Barang",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row.inStock === true ? (
              <Status
                text={"Stok tersedia"}
                icon={MdDone}
                bg="bg-teal-200"
                color="text-teal-700"
              />
            ) : (
              <Status
                text="Stok Kosong"
                icon={MdClose}
                bg="bg-rose-200"
                color="text-rose-700"
              />
            )}
          </div>
        );
      },
    },
    {
      field: "stock",
      headerName: "Jumlah Stok",
      width: 150,
      renderCell: (params) => {
        return <div>{params.row.stock}</div>;
      },
    },
    {
      field: "action",
      headerName: "Aksi",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex justify-between w-full gap-4">
            <ActionBtn
              icon={MdCached}
              onClick={() => {
                handleToggleStock(
                  params.row.id,
                  params.row.inStock,
                  params.row.stock
                );
              }}
            />
            <ActionBtn
              icon={MdDelete}
              onClick={() => {
                handleDelete(params.row.id, params.row.images);
              }}
            />
            <ActionBtn
              icon={MdRemoveRedEye}
              onClick={() => {
                router.push(`product/${params.row.id}`);
              }}
            />
          </div>
        );
      },
    },
  ];

  const handleToggleStock = useCallback(
    (id: string, inStock: boolean, stock: number) => {
      axios
        .put("/api/product", {
          id,
          // stock: stock - 1,
          inStock: !inStock,
        })
        .then((res) => {
          toast.success("Status produk berubah");
          router.refresh();
        })
        .catch((err) => {
          toast.error("Terjadi kesalahan");
          console.log(err);
        });
    },
    []
  );

  const handleDelete = useCallback(async (id: string, images: any[]) => {
    toast("Menghapus produk, proses!");

    const handleImageDelete = async () => {
      try {
        for (const item of images) {
          if (item.image) {
            const imageRef = ref(storage, item.image);
            await deleteObject(imageRef);
            console.log("Menghapus Gambar", item.image);
          }
        }
      } catch (error) {
        return console.log("Gagal Menghapus Gambar", error);
      }
    };

    await handleImageDelete();

    axios
      .delete(`/api/product/${id}`)
      .then((res) => {
        toast.success("Produk Berhasil Dihapus");
        router.refresh();
      })
      .catch((err) => {
        toast.error("Gagal Menghapus Produk");
        console.log(err);
      });
  }, []);

  return (
    <div className="max-w-[1150px] m-auto text-xl">
      <div className="mt-8 mb-4">
        <Heading title="Kelola Produk" center />
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

export default ManageProductsClient;
