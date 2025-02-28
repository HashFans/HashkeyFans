import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/lib/middleware';
import { ApiError, ErrorCode } from '@/types/api';

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  return withErrorHandler(async () => {
    const lottery = await prisma.lottery.findUnique({
      where: { code: params.code },
      include: {
        creator: {
          select: {
            walletAddress: true,
          },
        },
        prizes: {
          orderBy: {
            level: 'asc',
          },
        },
      },
    });

    if (!lottery) {
      throw new ApiError(ErrorCode.NOT_FOUND, 'Lottery not found');
    }

    return NextResponse.json({
      success: true,
      data: lottery,
    });
  });
} 