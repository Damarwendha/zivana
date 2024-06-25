/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Report } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Heading from "@/app/components/Heading";
import { useRouter } from "next/navigation";
import { getStorage } from "firebase/storage";
import firebaseApp from "@/libs/firebase";
import moment from "moment";

interface ManageFeedbacksClientProps {
  feedbacks: Report[];
}

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
    // {
    //   field: "action",
    //   headerName: "Aksi",
    //   width: 200,
    //   renderCell: (params) => {
    //     return (
    //       <div className="flex justify-between w-full gap-4">
    //         <ActionBtn
    //           icon={MdCached}
    //           onClick={() => {
    //             handleToggleStock(
    //               params.row.id,
    //               params.row.inStock,
    //               params.row.stock
    //             );
    //           }}
    //         />
    //         <ActionBtn
    //           icon={MdDelete}
    //           onClick={() => {
    //             handleDelete(params.row.id, params.row.images);
    //           }}
    //         />
    //         <ActionBtn
    //           icon={MdRemoveRedEye}
    //           onClick={() => {
    //             router.push(`feedback/${params.row.id}`);
    //           }}
    //         />
    //       </div>
    //     );
    //   },
    // },
  ];

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
