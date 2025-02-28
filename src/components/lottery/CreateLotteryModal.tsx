'use client';

import { Icon } from '@/components/common/Icon';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { FileUpload } from '@/components/common/FileUpload';
import { useAccount, useWallets } from '@particle-network/connectkit';
import { ethers } from 'ethers';

interface Prize {
  level: number;
  name: string;
  amount: number;
}

interface CreateLotteryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: {
    title: string;
    description: string;
    imageUrl?: string;
    prizes: Prize[];
  }) => void;
}

export function CreateLotteryModal({ isOpen, onClose, onCreate }: CreateLotteryModalProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [prizes, setPrizes] = useState<Prize[]>([
    { level: 1, name: '', amount: 1 }
  ]);
  const [primaryWallet] = useWallets();

  const handleAddPrize = () => {
    if (prizes.length >= 5) return;
    setPrizes([...prizes, { level: prizes.length + 1, name: '', amount: 1 }]);
  };

  const handleRemovePrize = (level: number) => {
    if (prizes.length <= 1) return;
    setPrizes(prizes.filter(p => p.level !== level).map((p, i) => ({ ...p, level: i + 1 })));
  };

  const handlePrizeChange = (level: number, field: 'name' | 'amount', value: string | number) => {
    setPrizes(prizes.map(p => p.level === level ? { ...p, [field]: value } : p));
  };

  const handleSubmit = async () => {
    if (!title || !description || prizes.some(p => !p.name)) return;
    
    try {
      // 构建消息对象，确保和后端完全一致
      const messageObj = {
        title,
        description,
        imageUrl,
        prizes,
        address: primaryWallet.accounts[0].toLowerCase() // 确保地址小写
      };

      // 转换为字符串
      const message = JSON.stringify(messageObj);
      console.log('Frontend message to sign:', message);

      // 获取签名
      const provider = await primaryWallet.connector.getProvider();
      const ethersProvider = new ethers.BrowserProvider(provider as ethers.Eip1193Provider);
      const signer = await ethersProvider.getSigner();
      const signature = await signer.signMessage(message);

      console.log('Signature:', signature);

      // 发送请求
      const response = await fetch('/api/lottery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...messageObj,
          signature,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create lottery');
      }

      const result = await response.json();
      if (result.success) {
        onClose();
      }
    } catch (error) {
      console.error('Error creating lottery:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative bg-base-100 rounded-2xl w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">
          {/* 标题栏 - 固定在顶部 */}
          <div className="px-6 py-4 border-b border-base-200 flex justify-between items-center shrink-0">
            <h3 className="text-xl font-bold">{t('lottery.create_modal.title')}</h3>
            <button className="btn btn-ghost btn-circle" onClick={onClose}>
              <Icon name="close" className="h-5 w-5" />
            </button>
          </div>

          {/* 表单内容 - 可滚动区域 */}
          <div className="p-6 space-y-6 overflow-y-auto">
            {/* 基本信息 */}
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t('lottery.create_modal.event_title')}</span>
                </label>
                <input 
                  type="text"
                  className="input input-bordered w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('lottery.create_modal.event_title_placeholder')}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t('lottery.create_modal.description')}</span>
                </label>
                <textarea 
                  className="textarea textarea-bordered h-24"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('lottery.create_modal.description_placeholder')}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t('lottery.create_modal.image')} ({t('common.optional')})</span>
                </label>
                <FileUpload
                  value={imageUrl}
                  onChange={setImageUrl}
                  accept="image/*"
                  maxSize={5}
                  aspectRatio={16/9}
                  placeholder={t('lottery.create_modal.image_placeholder')}
                  module="lottery"
                />
              </div>
            </div>
            {/* 奖品设置 */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold">{t('lottery.create_modal.prizes')}</h4>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={handleAddPrize}
                  disabled={prizes.length >= 5}
                >
                  <Icon name="plus" className="h-4 w-4" />
                  {t('lottery.create_modal.add_prize')}
                </button>
              </div>

              <div className="space-y-4">
                {prizes.map((prize) => (
                  <div key={prize.level} className="flex gap-4 items-start">
                    <div className="badge badge-lg">{prize.level}</div>
                    <div className="flex-1 space-y-2">
                      <input 
                        type="text"
                        className="input input-bordered w-full"
                        value={prize.name}
                        onChange={(e) => handlePrizeChange(prize.level, 'name', e.target.value)}
                        placeholder={t('lottery.create_modal.prize_name_placeholder')}
                      />
                      <input 
                        type="number"
                        className="input input-bordered w-full"
                        value={prize.amount}
                        min={1}
                        onChange={(e) => handlePrizeChange(prize.level, 'amount', parseInt(e.target.value))}
                      />
                    </div>
                    {prizes.length > 1 && (
                      <button 
                        className="btn btn-ghost btn-circle btn-sm"
                        onClick={() => handleRemovePrize(prize.level)}
                      >
                        <Icon name="trash" className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 底部按钮 - 固定在底部 */}
          <div className="px-6 py-4 border-t border-base-200 flex justify-end gap-2 shrink-0">
            <button className="btn btn-ghost" onClick={onClose}>
              {t('common.cancel')}
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!title || !description || prizes.some(p => !p.name)}
            >
              {t('lottery.create_modal.create')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 