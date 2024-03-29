import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



export async function GET(
    req: Request,
    { params }: { params: {
        billboardId: string
    } }
  ) {
    try {
    
      if (!params.billboardId) {
        return new NextResponse("billboard id is required", { status: 400 });
      }

    
      const store = await prismadb.billBoard.findUnique({
        where: {
          id: params.billboardId,
        }
      });
    
      return NextResponse.json(store);
    } catch (error) {
      console.log('[BILLBOARD_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };


export async function PATCH (
    req: Request,
    {params}: {params: {
        storeId: string,
        billboardId: string
    }}
) {
    try{
        const {userId}=auth();

        const body=await req.json();

        const {label, imageUrl} =body;
        
        if(!userId){
            return new NextResponse("Unauthenticated ",{status:401})
        }

        if(!label){
            return new NextResponse("label required ",{status:400})
        }

        if(!imageUrl){
            return new NextResponse("imageUrl required ",{status:400})
        }

        if(!params.storeId){
            return new NextResponse("store id required ",{status:400})
        }

        if(!params.billboardId){
            return new NextResponse("billboard id required ",{status:400})
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

        const billBoard=await prismadb.billBoard.updateMany({
            where:{
                id: params.billboardId,
            },
            data:{
                label,
                imageUrl
            }
        })

        return  NextResponse.json(billBoard);
    }
    catch(error){
        console.log('[BILLBOARD_PATCH] ',error);
        return new NextResponse("Internal Error",{status:500});
    }
}



export async function DELETE(
    req: Request,
    { params }: { params: { 
        storeId: string 
        billboardId: string
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

      if (!params.billboardId) {
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


  
      const store = await prismadb.billBoard.deleteMany({
        where: {
          id: params.billboardId,
        }
      });
    
      return NextResponse.json(store);
    } catch (error) {
      console.log('[BILLBOARD_DELETE]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };