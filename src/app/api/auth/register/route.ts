import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { name, email, password, graduationYear, department, currentJobTitle, currentCompany } = await request.json();

    // Check if user already exists
    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({
        where: { email }
      });
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    let user;
    try {
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          graduationYear: graduationYear ? parseInt(graduationYear) : undefined,
          department: department || undefined,
          currentJobTitle: currentJobTitle || undefined,
          currentCompany: currentCompany || undefined,
          role: 'USER'
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          graduationYear: true,
          department: true,
          currentJobTitle: true,
          currentCompany: true,
        }
      });
    } catch (createError) {
      console.error('User creation error:', createError);
      return NextResponse.json(
        { error: 'Failed to create user account. Please try again.' },
        { status: 500 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        name: user.name,
        role: user.role 
      },
      process.env.JWT_SECRET || 'Hello World',
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'User created successfully',
      user,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
