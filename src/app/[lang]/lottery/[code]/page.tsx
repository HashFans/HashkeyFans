'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/common/Icon';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useWallets } from '@particle-network/connectkit';

interface Prize {
  level: number;
  name: string;
  amount: number;
}

interface LotteryInfo {
  id: number;
  code: string;
  title: string;
  description: string;
  imageUrl: string | null;
  prizes: Prize[];
  createdAt: string;
  status: 'PENDING' | 'DRAWING' | 'COMPLETED';
  drawAt: string | null;
  creator: {
    walletAddress: string;
  };
}

export default function LotteryDetailPage({ params }: { params: { code: string } }) {
  const { t } = useTranslation();
  const [ primaryWallet ] = useWallets();
  const [lottery, setLottery] = useState<LotteryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const fetchLotteryInfo = async () => {
    try {
      const response = await fetch(`/api/lottery/${params.code}`);
      if (!response.ok) throw new Error('Failed to fetch lottery info');
      const data = await response.json();
      setLottery(data.data);
    } catch (error) {
      console.error('Error fetching lottery:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLotteryInfo();
  }, [params.code]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success(t('lottery.share_success'));
  };

  const handleJoin = async () => {
    if (!primaryWallet.accounts[0]) return;
    
    try {
      setIsJoining(true);
      const response = await fetch(`/api/lottery/${params.code}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: primaryWallet.accounts[0] }),
      });

      if (!response.ok) throw new Error('Failed to join lottery');
      
      toast.success(t('lottery.join_success'));
      // 重新获取抽奖信息
      fetchLotteryInfo();
    } catch (error) {
      console.error('Error joining lottery:', error);
      toast.error(t('lottery.join_error'));
    } finally {
      setIsJoining(false);
    }
  };

  const handleDraw = async () => {
    if (!primaryWallet.accounts[0]) return;
    
    try {
      setIsDrawing(true);
      const response = await fetch(`/api/lottery/${params.code}/draw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: primaryWallet.accounts[0] }),
      });

      if (!response.ok) throw new Error('Failed to draw lottery');
      
      toast.success(t('lottery.draw_success'));
      // 重新获取抽奖信息
      fetchLotteryInfo();
    } catch (error) {
      console.error('Error drawing lottery:', error);
      toast.error(t('lottery.draw_error'));
    } finally {
      setIsDrawing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="space-y-4 text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-gray-400 animate-pulse">{t('lottery.loading')}</p>
        </div>
      </div>
    );
  }

  if (!lottery) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-6">
            <Icon name="error" className="h-12 w-12 text-error" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{t('lottery.not_found')}</h2>
          <p className="text-gray-400 mb-6">{t('lottery.not_found_desc')}</p>
          <a href="/lottery" className="btn btn-primary">
            <Icon name="arrow-left" className="h-5 w-5" />
            {t('lottery.back_to_list')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] relative py-16">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10" />
      <div className="absolute inset-0 backdrop-blur-3xl" />

      {/* 内容 */}
      <div className="relative container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* 抽奖信息卡片 */}
          <div className="card bg-base-100/50 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden">
            {/* 封面图片 */}
            {lottery.imageUrl && (
              <figure className="relative h-64 w-full">
                <Image
                  src={lottery.imageUrl.startsWith('ipfs://')
                    ? `https://ipfs.io/ipfs/${lottery.imageUrl.replace('ipfs://', '')}`
                    : lottery.imageUrl}
                  alt={lottery.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base-100/80 to-transparent" />
              </figure>
            )}

            <div className="card-body">
              {/* 状态标签 */}
              <div className="flex justify-between items-center mb-6">
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {lottery.title}
                  </h1>
                  <p className="text-gray-400 text-lg">{lottery.description}</p>
                </div>
                <div className={`badge badge-lg ${
                  lottery.status === 'COMPLETED' ? 'badge-success' :
                  lottery.status === 'DRAWING' ? 'badge-warning' :
                  'badge-info'
                }`}>
                  {/* {t(`lottery.status.${lottery.status.toLowerCase()}`)} */}
                  {lottery.status}
                </div>
              </div>

              {/* 创建者信息 */}
              <div className="flex items-center gap-3 my-6 p-4 rounded-lg bg-base-200/50 border border-white/5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="user" className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">{t('lottery.created_by')}</div>
                  <code className="text-sm font-mono">{lottery.creator.walletAddress}</code>
                </div>
              </div>

              {/* 奖品列表 */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Icon name="gift" className="h-5 w-5 text-primary" />
                  {t('lottery.prizes')}
                </h2>
                <div className="grid gap-4">
                  {lottery.prizes.map((prize) => (
                    <div
                      key={prize.level}
                      className="flex items-center gap-4 p-4 rounded-lg bg-base-200/50 border border-white/5 hover:bg-base-200/70 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-lg font-bold text-secondary">
                        {prize.level}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{prize.name}</h3>
                        <p className="text-sm text-gray-400">
                          {t('lottery.amount')}: {prize.amount}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="card-actions justify-end mt-8 space-x-4">
                {lottery.status === 'PENDING' && (
                  <>
                    <button
                      className="btn btn-primary btn-lg gap-2"
                      onClick={handleJoin}
                      disabled={isJoining}
                    >
                      {isJoining && <span className="loading loading-spinner" />}
                      <Icon name="ticket" className="h-5 w-5" />
                      {t('lottery.join')}
                    </button>

                    {lottery.creator.walletAddress.toLowerCase() === primaryWallet.accounts[0]?.toLowerCase() && (
                      <button
                        className="btn btn-secondary btn-lg gap-2"
                        onClick={handleDraw}
                        disabled={isDrawing}
                      >
                        {isDrawing && <span className="loading loading-spinner" />}
                        <Icon name="gift" className="h-5 w-5" />
                        {t('lottery.draw')}
                      </button>
                    )}
                  </>
                )}

                {lottery.status === 'COMPLETED' && (
                  <div className="text-sm text-gray-400">
                    {t('lottery.drawn_at')}: {new Date(lottery.drawAt!).toLocaleString()}
                  </div>
                )}

                <button
                  className="btn btn-ghost btn-lg gap-2"
                  onClick={handleShare}
                >
                  <Icon name="share" className="h-5 w-5" />
                  {t('lottery.share')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 