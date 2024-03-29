import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: {storeId: string}}

) {
    try{
        const {userId} = auth();
        const body=await req.json();


        const {name , value}=body;

        if(!userId){
            return new NextResponse("unauthenticated ",{status:401});
        }

        if(!name){
            return new NextResponse("label is required" ,{status:400});
        }

        if(!value){
            return new NextResponse("Value is required" ,{status:400});
        }
        

        if(!params.storeId){
            return new NextResponse("store Id is required" ,{status:400});
        }

        const storeByUserId= await prismadb.store.findFirst({
            where:{
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("Unauthoried" ,{status:403});
        }

        const colour= await prismadb.colour.create({
            data:{
                name,
                value,
                storeId: params.storeId
            }
        });

        return NextResponse.json(colour);

    }
    catch(error)
    {
        console.log('[COLOUR_POST] ',error);
        return new NextResponse("int error",{status:500});
    }
}


export async function GET(
    req: Request,
    { params }: { params: {storeId: string}}

) {
    try{
        

        if(!params.storeId){
            return new NextResponse("store Id is required" ,{status:400});
        }


        const colours= await prismadb.colour.findMany({
            where: {
                storeId: params.storeId,
            }
        });

        return NextResponse.json(colours);

    }
    catch(error)
    {
        console.log('[COLOURS_GET] ',error);
        return new NextResponse("int error",{status:500});
    }
}