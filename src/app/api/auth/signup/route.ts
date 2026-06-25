import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { signUpSchema } from "@/lib/validations"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { Prisma } from "@prisma/client"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password } = signUpSchema.parse(body)

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ user, message: "User created successfully" }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
