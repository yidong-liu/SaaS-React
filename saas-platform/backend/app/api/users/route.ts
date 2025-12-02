import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET() {
  const users = await prisma.user.findMany({ include: { posts: true } });
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: body.password ?? 'test123',
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 400 });
  }
}
