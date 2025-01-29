'use client'

import { useState } from 'react';
import { useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { REDPACKET_CONTRACT } from '@/config/contracts';
import { useAccount } from 'wagmi';

export function useCreateRedPacket() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hash, setHash] = useState<`0x${string}`>('0x0');

  const { writeContractAsync } = useWriteContract();

  const handleCreate = async (message: string, amount: number, count: number) => {
    try {
      setLoading(true);
      setError(null);

      const txHash = await writeContractAsync({
        address: REDPACKET_CONTRACT.address as `0x${string}`,
        abi: REDPACKET_CONTRACT.abi,
        functionName: 'createPacket',
        args: [message, BigInt(count)],
        value: parseEther(amount.toString()),
      });

      setHash(txHash);
      return txHash;
    } catch (err) {
      console.error('Failed to create red packet:', err);
      setError(err instanceof Error ? err.message : '创建红包失败');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createRedPacket: handleCreate,
    isLoading: loading,
    error,
    hash,
  };
}

export function useRedPacketInfo(id?: string) {
  const { data: packetInfo, isLoading, refetch } = useReadContract({
    address: REDPACKET_CONTRACT.address as `0x${string}`,
    abi: REDPACKET_CONTRACT.abi,
    functionName: 'packets',
    args: id ? [BigInt(id)] : undefined,
  });

  console.log('RedPacket Query:', {
    id,
    packetInfo,
    isLoading,
    contractAddress: REDPACKET_CONTRACT.address
  });

  if (!packetInfo) return { isLoading, refetch };

  return {
    isLoading,
    refetch,
    info: {
      creator: packetInfo[0],
      message: packetInfo[1],
      totalAmount: formatEther(packetInfo[2]),
      remainingAmount: formatEther(packetInfo[3]),
      totalCount: Number(packetInfo[4]),
      remainingCount: Number(packetInfo[5]),
      claimed: Number(packetInfo[4]) - Number(packetInfo[5]),
      createdAt: new Date(Number(packetInfo[6]) * 1000),
    }
  };
}

export function useRedPacketClaimed(id?: string) {
  const { address } = useAccount();
  const { data: packetInfo, isLoading, refetch } = useReadContract({
    address: REDPACKET_CONTRACT.address as `0x${string}`,
    abi: REDPACKET_CONTRACT.abi,
    functionName: 'getPacketInfo',
    args: id ? [BigInt(id), address || '0x0000000000000000000000000000000000000000'] : undefined,
  });

  // 现在 packetInfo[7] 是 canClaim，packetInfo[6] 是 claimedAmount
  const claimedAmount = packetInfo?.[6] ?? BigInt(0);
  const canClaim = packetInfo?.[7] ?? false;
  const hasClaimed = claimedAmount > BigInt(0);

  return {
    isLoading,
    refetch,
    claimedAmount: formatEther(claimedAmount),
    hasClaimed,
    canClaim
  };
}

export function useClaimRedPacket() {
  const { writeContractAsync } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hash, setHash] = useState<`0x${string}`>('0x0');

  const handleClaim = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const txHash = await writeContractAsync({
        address: REDPACKET_CONTRACT.address as `0x${string}`,
        abi: REDPACKET_CONTRACT.abi,
        functionName: 'claimPacket',
        args: [BigInt(id)],
        gas: BigInt(300000),
      });

      setHash(txHash);
      return txHash;
    } catch (err) {
      console.error('Failed to claim red packet:', err);
      setError(err instanceof Error ? err.message : '领取红包失败');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    claimRedPacket: handleClaim,
    isLoading,
    error,
    hash
  };
}

export function useRedPacketClaims(packetId: string) {
  const { data, isLoading, refetch } = useReadContract({
    address: REDPACKET_CONTRACT.address as `0x${string}`,
    abi: REDPACKET_CONTRACT.abi,
    functionName: 'getPacketClaimers',
    args: [BigInt(packetId)],
  });

  // 使用 useWatchContractEvent 替代 useContractEvent
  useWatchContractEvent({
    address: REDPACKET_CONTRACT.address as `0x${string}`,
    abi: REDPACKET_CONTRACT.abi,
    eventName: 'PacketClaimed',
    onLogs() {
      refetch?.();
    },
  });

  const claims = data ? data[0].map((address, index) => ({
    address,
    amount: formatEther(data[1][index]),
    timestamp: Date.now() / 1000
  })) : [];

  return { claims, isLoading, refetch };
}

export function useUserRedPackets() {
  const { address } = useAccount();
  const { data, isLoading, refetch } = useReadContract({
    address: REDPACKET_CONTRACT.address as `0x${string}`,
    abi: REDPACKET_CONTRACT.abi,
    functionName: 'getUserRelatedPackets',
    args: address ? [address] : undefined,
  });

  console.log('UserRedPackets Query:', {
    address,
    data,
    isLoading,
    contractAddress: REDPACKET_CONTRACT.address
  });

  const [created, claimed] = data || [[], []];

  console.log('UserRedPackets Result:', {
    created,
    claimed
  });

  return {
    isLoading,
    refetch,
    created: created || [],
    claimed: claimed || []
  };
} 