import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { BillBoardClient } from "./components/client";
import { BillboardColumn } from "./components/columns";

const BillBoardsPage = async ({
  params,
}: {
  params: {
    StoreId: string;
  };
}) => {
  const billboards = await prismadb.billBoard.findMany({
    where: {
      storeId: params.StoreId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillBoardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillBoardsPage;
