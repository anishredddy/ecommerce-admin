import prismadb from "@/lib/prismadb";

interface DashboardPageProps {
  params: {
    storeId: string;
  };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });
  return (
    <div className="h-screen  flex flex-col items-center justify-center">
      <p className="text-7xl font-extrabold">Store: {store?.name}</p>
      <p className="text-3xl font-semibold">Please Add required items</p>
    </div>
  );
};

export default DashboardPage;
