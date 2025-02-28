import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/lib/middleware';
import { ApiError, ErrorCode } from '@/types/api';
import { ethers } from 'ethers';

interface Prize {
  level: number;
  name: string;
  amount: number;
}

interface CreateLotteryRequest {
  title: string;
  description: string;
  imageUrl?: string;
  prizes: Prize[];
  signature: string;
  address: string;
}

// 验证签名
async function verifySignature(data: Omit<CreateLotteryRequest, 'signature'>, signature: string) {
  // 构建要签名的消息，需要和前端完全一致
  const message = JSON.stringify({
    title: data.title,
    description: data.description,
    imageUrl: data.imageUrl,
    prizes: data.prizes,
    address: data.address
  });

  try {
    console.log('Backend message to verify:', message);
    const recoveredAddress = ethers.verifyMessage(message, signature);
    console.log('Recovered address:', recoveredAddress);
    console.log('Expected address:', data.address);
    return recoveredAddress.toLowerCase() === data.address.toLowerCase();
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

// 生成唯一的 8 位抽奖码
async function generateUniqueCode(): Promise<string> {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // 去掉容易混淆的字符
  let code: string;
  let isUnique = false;

  while (!isUnique) {
    code = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const existing = await prisma.lottery.findUnique({ where: { code } });
    if (!existing) {
      isUnique = true;
    }
  }

  return code!;
}

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const data = await req.json() as CreateLotteryRequest;

    // 验证必填字段
    if (!data.title || !data.description || !data.prizes || !data.signature || !data.address) {
      throw new ApiError(ErrorCode.INVALID_REQUEST, 'Missing required fields');
    }

    // 验证签名
    const isValidSignature = await verifySignature(data, data.signature);
    if (!isValidSignature) {
      throw new ApiError(ErrorCode.UNAUTHORIZED, 'Invalid signature');
    }

    // 获取或创建用户
    const user = await prisma.user.upsert({
      where: { walletAddress: data.address.toLowerCase() },
      update: {},
      create: {
        walletAddress: data.address.toLowerCase(),
      },
    });

    // 生成唯一代码
    const code = await generateUniqueCode();

    // 创建抽奖
    const lottery = await prisma.lottery.create({
      data: {
        code,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        creatorId: user.id,
        signature: data.signature,
        prizes: {
          create: data.prizes.map(prize => ({
            level: prize.level,
            name: prize.name,
            amount: prize.amount,
          }))
        }
      },
      include: {
        prizes: true,
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        ...lottery,
        shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/lottery/${code}`
      }
    });
  });
} 