import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/lib/middleware';
import { ApiError, ErrorCode } from '@/types/api';
import { redis } from '@/lib/redis';

export async function POST(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  return withErrorHandler(async () => {
    const { address } = await req.json();

    if (!address) {
      throw new ApiError(ErrorCode.BAD_REQUEST, 'Address is required');
    }

    // 获取抽奖信息
    const lottery = await prisma.lottery.findUnique({
      where: { code: params.code },
      include: {
        participants: true,
        prizes: true,
      },
    });

    if (!lottery) {
      throw new ApiError(ErrorCode.NOT_FOUND, 'Lottery not found');
    }

    if (lottery.status === 'COMPLETED') {
      throw new ApiError(ErrorCode.BAD_REQUEST, 'Lottery is completed');
    }

    // 获取或创建用户
    const user = await prisma.user.upsert({
      where: { walletAddress: address.toLowerCase() },
      update: {},
      create: {
        walletAddress: address.toLowerCase(),
      },
    });

    // 检查是否已参与
    const key = `lottery:${lottery.code}:participants`;
    const isParticipated = await redis.sismember(key, user.id.toString());
    
    if (isParticipated) {
      throw new ApiError(ErrorCode.BAD_REQUEST, 'Already participated');
    }

    // 添加参与记录到 Redis
    await redis.sadd(key, user.id.toString());

    // 同时保存到数据库
    await prisma.lotteryParticipant.create({
      data: {
        lotteryId: lottery.id,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        message: 'Joined successfully',
      },
    });
  });
} 