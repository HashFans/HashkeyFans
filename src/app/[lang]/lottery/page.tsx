'use client';

import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/common/Icon';
import { useState } from 'react';
import { useAccount } from '@particle-network/connectkit';
import { CreateLotteryModal } from '@/components/lottery/CreateLotteryModal';

export default function LotteryPage() {
  const { t } = useTranslation();
  const { address, isConnected } = useAccount();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreate = (data: any) => {
    console.log('Creating lottery:', data);
    // TODO: 调用合约创建抽奖
  };

  return (
    <div className="min-h-[80vh] relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10" />
      <div className="absolute inset-0 backdrop-blur-3xl" />
      
      {/* 主要内容 */}
      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* 标题区域 */}
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
              {t('lottery.title')}
            </h1>
            <p className="text-lg text-gray-400">
              {t('lottery.description')}
            </p>
          </div>

          {/* 卡片区域 */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* 创建抽奖卡片 */}
            <div className="card bg-base-100/50 hover:bg-base-100/70 transition-all backdrop-blur-xl border border-white/10 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icon name="gift" className="h-8 w-8 text-primary" />
                </div>
                <h2 className="card-title mb-2">{t('lottery.create_card_title')}</h2>
                <p className="text-gray-400 mb-6">{t('lottery.create_card_desc')}</p>
                <button 
                  className="btn btn-primary btn-lg w-full gap-2 glass"
                  disabled={!isConnected}
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Icon name="plus" className="h-5 w-5" />
                  {t('lottery.create')}
                </button>
              </div>
            </div>

            {/* 查看历史卡片 */}
            <div className="card bg-base-100/50 hover:bg-base-100/70 transition-all backdrop-blur-xl border border-white/10 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <Icon name="history" className="h-8 w-8 text-secondary" />
                </div>
                <h2 className="card-title mb-2">{t('lottery.history_card_title')}</h2>
                <p className="text-gray-400 mb-6">{t('lottery.history_card_desc')}</p>
                <button 
                  className="btn btn-secondary btn-lg w-full gap-2 glass"
                  onClick={() => setIsHistoryOpen(true)}
                >
                  <Icon name="eye" className="h-5 w-5" />
                  {t('lottery.history')}
                </button>
              </div>
            </div>
          </div>

          {/* 未连接钱包提示 */}
          {!isConnected && (
            <div className="alert alert-warning backdrop-blur-xl mt-8">
              <Icon name="info" className="h-5 w-5" />
              <span>{t('lottery.connect_wallet_tip')}</span>
            </div>
          )}
        </div>
      </div>

      {/* 抽奖历史抽屉 */}
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-50 ${isHistoryOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div 
          className={`fixed inset-y-0 right-0 w-full sm:w-[480px] bg-base-100 transform transition-transform ${
            isHistoryOpen ? 'translate-x-0' : 'translate-x-full'
          } overflow-y-auto border-l border-white/10`}
        >
          {/* 抽屉标题 */}
          <div className="sticky top-0 z-10 bg-base-100/80 backdrop-blur-xl border-b border-base-200 p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">{t('lottery.history_title')}</h2>
            <button 
              className="btn btn-circle btn-ghost"
              onClick={() => setIsHistoryOpen(false)}
            >
              <Icon name="close" className="h-5 w-5" />
            </button>
          </div>

          {/* 抽奖历史列表 */}
          <div className="p-6">
            <div className="text-center py-16 opacity-50">
              <div className="w-16 h-16 rounded-full bg-base-200 mx-auto flex items-center justify-center mb-4">
                <Icon name="inbox" className="h-8 w-8" />
              </div>
              <p className="text-lg">{t('lottery.no_history')}</p>
            </div>
          </div>
        </div>
      </div>

      <CreateLotteryModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
} 