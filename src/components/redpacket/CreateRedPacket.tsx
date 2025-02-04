'use client'

import { useState } from 'react';
import { Button } from '../common/Button';
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import { useCreateRedPacket } from '@/hooks/useRedPacket';
import { formatAddress } from '@/utils/format';

interface CreateRedPacketProps {
  onSubmit: (data: {
    amount: number;
    count: number;
    message: string;
  }) => void;
  preview: {
    message: string;
    amount: number;
    count: number;
  };
  setPreview: (data: {
    message: string;
    amount: number;
    count: number;
  }) => void;
  isLoading?: boolean;
  error?: string | null;
}

interface Token {
  address: string;
  symbol: string;
  icon?: string;
}

const SUPPORTED_TOKENS = [
  {
    address: '0xF1B50eD67A9e2CC94Ad3c477779E2d4cBfFf9029',
    symbol: 'USDT',
    icon: '/img/usdt.svg'
  },
  {
    address: '0xefd4bC9afD210517803f293ABABd701CaeeCdfd0',
    symbol: 'WETH',
    icon: '/img/weth.png'
  }
];

const fetchTokens = async (address: string) => {
  const isTestnet = process.env.NODE_ENV === 'development';
  const baseUrl = isTestnet ? "https://hashkeychain-testnet-explorer.alt.technology/" : "https://explorer.hsk.xyz/ ";
    
  try {
    const response = await fetch(
      `${baseUrl}/api/v2/tokens/${address}`
    );
    const data = await response.json();
    
    return [{
      address: data.address,
      symbol: data.symbol,
      icon: data.icon_url || '/img/logo.png'  // 使用默认图标
    }];
  } catch (err) {
    console.error('Failed to fetch token:', err);
    return [];
  }
};

export function CreateRedPacket({ 
  onSubmit, 
  preview, 
  setPreview,
  isLoading,
  error 
}: CreateRedPacketProps) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [count, setCount] = useState('');
  const [message, setMessage] = useState('HashKey Chain');
  const [activeTab, setActiveTab] = useState<'HSK' | 'ERC20'>('HSK');
  const [showTokenSelect, setShowTokenSelect] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token>(SUPPORTED_TOKENS[0]);

  const { createRedPacket } = useCreateRedPacket();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    const countNum = parseInt(count);

    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error(t('redpacket.create.form.invalidAmount'), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (amountNum < 0.01) {
      toast.error(t('redpacket.create.form.minAmount'), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (isNaN(countNum) || !Number.isInteger(countNum) || countNum <= 0) {
      toast.error(t('redpacket.create.form.invalidCount'), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    onSubmit({
      amount: amountNum,
      count: countNum,
      message,
    });
  };

  const TokenSelectModal = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Token[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (value: string) => {
      setSearchTerm(value);
      if (value.length === 42 && value.startsWith('0x')) {
        setIsSearching(true);
        try {
          const tokens = await fetchTokens(value);
          setSearchResults(tokens);
        } catch (err) {
          console.error('Failed to fetch tokens:', err);
        } finally {
          setIsSearching(false);
        }
      }
    };

    const allTokens = [...SUPPORTED_TOKENS, ...searchResults];

    const filteredTokens = allTokens.filter(token => 
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1a1a1a] rounded-2xl p-6 max-w-sm w-full">
          <h3 className="text-lg font-bold text-white mb-4">{t('redpacket.create.selectToken')}</h3>
          
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={t('redpacket.create.searchToken')}
              className="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FF3B3B]"
            />
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {isSearching ? (
              <div className="text-center py-4 text-white/60">
                {t('common.loading')}...
              </div>
            ) : filteredTokens.length > 0 ? (
              filteredTokens.map(token => (
                <button
                  key={token.address}
                  onClick={() => {
                    setSelectedToken(token);
                    setShowTokenSelect(false);
                  }}
                  className="w-full flex items-center p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  {token.icon && (
                    <img src={token.icon} alt={token.symbol} className="w-8 rounded-full h-8 mr-3" />
                  )}
                  <div className="text-left">
                    <div className="text-white font-medium">{token.symbol}</div>
                    <div className="text-white/60 text-sm">{formatAddress(token.address)}</div>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-4 text-white/60">
                {t('redpacket.create.noTokensFound')}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-b from-[#FFD700] to-[#FF5B5C] rounded-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 text-center drop-shadow-sm">
        {t('redpacket.create.title')}
      </h2>

      <div className="bg-white/10 p-1 rounded-full flex mb-6">
        <button
          onClick={() => setActiveTab('HSK')}
          className={`flex-1 py-2 rounded-full text-center transition-colors ${
            activeTab === 'HSK' 
              ? 'bg-white text-[#FF3B3B]' 
              : 'text-white'
          }`}
        >
          HSK
        </button>
        <button
          onClick={() => setActiveTab('ERC20')}
          className={`flex-1 py-2 rounded-full text-center transition-colors ${
            activeTab === 'ERC20' 
              ? 'bg-white text-[#FF3B3B]' 
              : 'text-white'
          }`}
        >
          ERC20
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-white mb-2 drop-shadow-sm">
            {t('redpacket.create.form.message')}
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setPreview({ ...preview, message: e.target.value });
            }}
            className="w-full px-4 py-3 bg-white rounded-lg text-gray-700 font-medium placeholder-gray-400 border-2 border-white/30 focus:border-white/50 focus:outline-none transition-all"
            placeholder={t('redpacket.create.form.messagePlaceholder')}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-2 drop-shadow-sm">
            {t('redpacket.create.form.amount')}
          </label>
          {activeTab === 'ERC20' ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowTokenSelect(true)}
                className="bg-white/10 text-white px-4 py-3 rounded-lg flex items-center gap-2"
              >
                <img src={selectedToken.icon} alt={selectedToken.symbol} className="w-6 h-6 rounded-full" />
                <span>{selectedToken.symbol}</span>
              </button>
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setPreview({ ...preview, amount: parseFloat(e.target.value) || 0 });
                }}
                className="flex-1 px-4 py-3 bg-white rounded-lg text-gray-700 font-medium placeholder-gray-400 border-2 border-white/30 focus:border-white/50 focus:outline-none transition-all"
                placeholder={t('redpacket.create.form.amountPlaceholder')}
                min="0.01"
                step="0.0001"
              />
            </div>
          ) : (
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setPreview({ ...preview, amount: parseFloat(e.target.value) || 0 });
              }}
              className="w-full px-4 py-3 bg-white rounded-lg text-gray-700 font-medium placeholder-gray-400 border-2 border-white/30 focus:border-white/50 focus:outline-none transition-all"
              placeholder={t('redpacket.create.form.amountPlaceholder')}
              min="0.01"
              step="0.0001"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-2 drop-shadow-sm">
            {t('redpacket.create.form.count')}
          </label>
          <input
            type="number"
            min="1"
            step="1"
            value={count}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setCount(value);
                setPreview({
                  ...preview,
                  count: parseInt(value) || 0
                });
              }
            }}
            className="w-full px-4 py-2 bg-[#2a2a2a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF3B3B]"
            placeholder={t('redpacket.create.form.countPlaceholder')}
          />
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full mt-8 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFC000] hover:from-[#FFE55C] hover:to-[#FFD700] text-[#FF3B3B] text-lg font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-[#FFE55C]/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('redpacket.create.form.processing') : t('redpacket.create.form.submit')}
        </Button>
      </div>

      {showTokenSelect && <TokenSelectModal />}
    </div>
  );
} 