/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Report, User } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Heading from "@/app/components/Heading";
import { useRouter } from "next/navigation";
import {deleteObject, getStorage, ref} from "firebase/storage";
import firebaseApp from "@/libs/firebase";
import moment from "moment";
import ActionBtn from "@/app/components/ActionBtn";
import {MdDelete} from "react-icons/md";
import {useCallback} from "react";
import toast from "react-hot-toast";
import axios from "axios";

interface ManageFeedbacksClientProps {
  feedbacks: ReportSiswaDto[];
}

type ReportSiswaDto = Report & {
  user: User
};

const ManageFeedbacksClient: React.FC<ManageFeedbacksClientProps> = ({
  feedbacks,
}) => {
  const router = useRouter();
  const storage = getStorage(firebaseApp);
  let rows: any = [];

  if (feedbacks) {
    rows = feedbacks.map((feedback) => {
      return {
        id: feedback.id,
        userEmail: feedback.user.email,
        message: feedback.message,
        createdAt: moment(feedback.createdAt).locale("id").format("ll"),
      };
    });
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "userEmail", headerName: "Email", width: 220 },
    {
      field: "message",
      headerName: "Pesan",
      width: 420,
      renderCell: (params) => {
        return (
          <div className="font-bold text-slate-800">{params.row.message}</div>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Tanggal",
      width: 165,
    },
    {
      field: "action",
      headerName: "Aksi",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex justify-between w-full gap-4">
            <ActionBtn
              icon={MdDelete}
              onClick={async () => {
                await handleDelete(params.row.id);
              }}
            />
          </div>
        );
      },
    },
  ];

  const handleDelete = useCallback(async (id: string) => {
    toast("Menghapus report, proses!");

    axios
      .delete(`/api/report/${id}`)
      .then(() => {
        toast.success("Report berhasil dihapus");
        router.refresh();
      }).catch((err) => {
        toast.error("Gagal menghapus report");
        console.log(err);
      });
  }, []);

  return (
    <div className="max-w-[1150px] m-auto text-xl">
      <div className="mt-8 mb-4">
        <Heading title="Kelola Feedback" center />
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

export default ManageFeedbacksClient;
