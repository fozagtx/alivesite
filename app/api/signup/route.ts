import { NextResponse } from "next/server"
import { PrismaClient } from "@/app/generated/prisma"
import { z } from "zod"

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
})

// Initialize Prisma client with error handling
let prisma: PrismaClient | null = null;

function getPrismaClient() {
  if (!prisma) {
    try {
      console.log("Initializing PrismaClient...")
      console.log("All env vars:", Object.keys(process.env).filter(key => key.includes('DATABASE')))
      console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL)

      if (!process.env.DATABASE_URL) {
        console.error("Environment variables available:", Object.keys(process.env))
        throw new Error("DATABASE_URL environment variable is not set")
      }

      // Try to create PrismaClient without custom config first
      prisma = new PrismaClient({
        log: ['query', 'error', 'warn', 'info'],
      })

      console.log("PrismaClient initialized successfully")

      // Test the connection
      prisma.$connect().then(() => {
        console.log("Database connected successfully")
      }).catch((connectError) => {
        console.error("Database connection test failed:", connectError)
      })

    } catch (error) {
      console.error("Failed to initialize PrismaClient:", error)
      throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  return prisma
}

export async function POST(req: Request) {
  try {
    console.log("=== API Route Started ===")
    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL)

    const body = await req.json()
    console.log("Request body:", body)

    const result = schema.safeParse(body)

    if (!result.success) {
      console.log("Validation failed:", result.error)
      return NextResponse.json({ error: "invalid data", details: result.error }, { status: 400 })
    }

    console.log("Creating user with username:", result.data.username)

    // Get Prisma client safely
    const client = getPrismaClient()

    const user = await client.user.create({
      data: {
        username: result.data.username,
      },
    })

    console.log("User created:", user)
    return NextResponse.json(user)
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}


