import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: {storeId: string}}

) {
    try{
        const body=await req.json();

        const {
            productIds,
            phone,
            address,
        }=body;

        if(!productIds || !productIds.length){
            return new NextResponse("Add products to cart buffalo",{status:400});
        }

        const order= await prismadb.order.create({
            data:{
                storeId: params.storeId,
                phone: phone,
                address: address,
                orderItems: {
                    createMany: {
                        data:[
                            ...productIds.map((productId: string)=> productId)
                        ]
                    }
                }
            }
        })

        console.log(body);
        console.log(order);

        return NextResponse.json("a");

    }
    catch(error)
    {
        console.log('[CHECKOUT_POST] ',error);
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


        const orders= await prismadb.order.findMany({
            where: {
                storeId: params.storeId,
            },
            include:{
                orderItems: {
                    include:{
                        product: true,
                    }
                }
            }
        });

        console.log(orders);

        return NextResponse.json(orders);

    }
    catch(error)
    {
        console.log('[CHECKOUT_GET] ',error);
        return new NextResponse("int error",{status:500});
    }
}