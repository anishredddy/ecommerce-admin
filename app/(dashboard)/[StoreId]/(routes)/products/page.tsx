import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { ProductsClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const ProductsPage = async ({
  params,
}: {
  params: {
    StoreId: string;
  };
}) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.StoreId,
    },
    include: {
      category: true,
      size: true,
      colour: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    category: item.category.name,
    colour: item.colour.value,
    size: item.size.name,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
