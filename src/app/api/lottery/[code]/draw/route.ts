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

    // 获取抽奖信息
    const lottery = await prisma.lottery.findUnique({
      where: { code: params.code },
      include: {
        creator: true,
        participants: true,
        prizes: true,
      },
    });

    if (!lottery) {
      throw new ApiError(ErrorCode.NOT_FOUND, 'Lottery not found');
    }

    // 验证是否是创建者
    if (lottery.creator.walletAddress.toLowerCase() !== address.toLowerCase()) {
      throw new ApiError(ErrorCode.UNAUTHORIZED, 'Not authorized');
    }

    if (lottery.status !== 'PENDING') {
      throw new ApiError(ErrorCode.INVALID_REQUEST, 'Invalid lottery status');
    }

    // 开始抽奖
    await prisma.lottery.update({
      where: { id: lottery.id },
      data: { status: 'DRAWING' },
    });

    // 从 Redis 获取所有参与者
    const key = `lottery:${lottery.code}:participants`;
    const participants = await redis.smembers(key);

    // 随机抽取获奖者
    for (const prize of lottery.prizes) {
      const winners = [];
      for (let i = 0; i < prize.amount; i++) {
        if (participants.length === 0) break;
        const winnerIndex = Math.floor(Math.random() * participants.length);
        const winnerId = participants.splice(winnerIndex, 1)[0];
        winners.push(winnerId);
      }

      // 更新中奖记录
      await prisma.lotteryParticipant.updateMany({
        where: {
          lotteryId: lottery.id,
          userId: { in: winners.map(Number) },
        },
        data: {
          prizeId: prize.id,
        },
      });
    }

    // 完成抽奖
    await prisma.lottery.update({
      where: { id: lottery.id },
      data: {
        status: 'COMPLETED',
        drawAt: new Date(),
      },
    });

    // 清理 Redis 数据
    await redis.del(key);

    return NextResponse.json({
      success: true,
      data: {
        message: 'Draw completed',
      },
    });
  });
} 