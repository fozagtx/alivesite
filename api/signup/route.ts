import {NextResponse}  from "next/server"
import { PrismaClient } from "@/app/generated/prisma";


const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});

const prisma = new PrismaClient();

export async function POST(req:Request){
  const body = await req.json();
  const results = shema.safeparse(body);
  if (!result.success) {
      return NextResponse.json({error:"invalid data"}, {status:400});
     
    }

  const user = await pisma.create({
    data:result.data,
  })

  return NextResponse.json(user)

}


