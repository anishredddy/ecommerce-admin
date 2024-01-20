import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



export async function GET(
    req: Request,
    { params }: { params: {
        productId: string
    } }
  ) {
    try {
    
      if (!params.productId) {
        return new NextResponse("product id is required", { status: 400 });
      }

    
      const product = await prismadb.product.findUnique({
        where: {
          id: params.productId,
        },
        include: {
          images: true,
          category: true,
          size: true,
          colour: true
        }
      });
    
      return NextResponse.json(product);
    } catch (error) {
      console.log('[PRODUCT_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };


export async function PATCH (
    req: Request,
    {params}: {params: {
        storeId: string,
        productId: string
    }}
) {
    try{
        const {userId}=auth();

        const body=await req.json();

        const {
          name,
          price, 
          categoryId,
          colourId,
          sizeId,
          images,     
          isFeatured,
          isArchived
      }=body;
        
        if(!userId){
            return new NextResponse("Unauthenticated ",{status:401})
        }

        if(!name){
          return new NextResponse("name is required" ,{status:400});
      }

      if(!price){
          return new NextResponse("price is required" ,{status:400});
      }
      
      if(!categoryId){
          return new NextResponse("categoryId is required" ,{status:400});
      }

      if(!colourId){
          return new NextResponse("colourId is required" ,{status:400});
      }

      if(!sizeId){
          return new NextResponse("size Id is required" ,{status:400});
      }

      if(!images || !images.length){
          return new NextResponse("images is required" ,{status:400});
      }

        if(!params.storeId){
            return new NextResponse("store id required ",{status:400})
        }

        if(!params.productId){
            return new NextResponse("product id required ",{status:400})
        }

        
        const storeByUserId= await prismadb.store.findFirst({
          where:{
              id: params.storeId,
              userId
          }
      })

      if(!storeByUserId){
        console.log("buffalo")
          return new NextResponse("unauthorised",{status:403})
      }

        await prismadb.product.update({
            where:{
                id: params.productId,
            },
            data:{
                name,
                price,
                colourId,
                sizeId,
                images: {
                  deleteMany: {}
                },
                isFeatured,
                isArchived,
            }
        })

        const product= await prismadb.product.update({
          where:{
            id: params.productId
          },
          data:{
            images: {
              createMany: {
                data: [
                  ...images.map((image : {url: string}) => image),
                ]
              }
            }
          }
        })

        return  NextResponse.json(product);
    }
    catch(error){
        console.log('[PRODUCT_PATCH] ',error);
        return new NextResponse("Internal Error",{status:500});
    }
}



export async function DELETE(
    req: Request,
    { params }: { params: { 
        storeId: string 
        productId: string
    } }
  ) {
    try {
      const { userId } = auth();
  
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 403 });
      }
  
      if (!params.storeId) {
        return new NextResponse("Store id is required", { status: 400 });
      }

      if (!params.productId) {
        return new NextResponse("billboard id is required", { status: 400 });
      }

      const storeByUserId= await prismadb.store.findFirst({
        where:{
            id: params.storeId,
            userId
        }
    })

    if(!storeByUserId){
        return new NextResponse("unauthorised",{status:403})
    }


  
      const product = await prismadb.product.deleteMany({
        where: {
          id: params.productId,
        }
      });
    
      return NextResponse.json(product);
    } catch (error) {
      console.log('[PRODUCT_DELETE]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };