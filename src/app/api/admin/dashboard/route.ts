import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verify } from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    let decoded;
    try {
      decoded = verify(token, process.env.JWT_SECRET!) as any;
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Fetch dashboard statistics
    const [totalUsers, totalEvents, totalDonations] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.donation.aggregate({
        _sum: {
          amount: true,
        },
      }),
    ]);

    // Fetch recent activity (simplified for now)
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });

    const recentEvents = await prisma.event.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });

    const recentActivity = [
      ...recentUsers.map((user: any) => ({
        id: user.id,
        type: 'user_registration',
        description: `${user.name} joined the platform`,
        timestamp: user.createdAt.toISOString(),
      })),
      ...recentEvents.map((event: any) => ({
        id: event.id,
        type: 'event_created',
        description: `Event "${event.title}" was created`,
        timestamp: event.createdAt.toISOString(),
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

    const stats = {
      totalUsers,
      totalEvents,
      totalDonations: totalDonations._sum.amount || 0,
      recentActivity,
    };
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
