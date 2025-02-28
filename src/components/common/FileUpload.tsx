'use client';

import { useState } from 'react';
import { Icon } from './Icon';
import Image from 'next/image';

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  maxSize?: number; // 单位：MB
  aspectRatio?: number; // 宽高比，如 1 表示正方形，16/9 表示宽屏
  placeholder?: string;
  className?: string;
  previewClassName?: string;
  showInput?: boolean;
  module: string; // 新增：上传模块
  id?: string;    // 新增：关联ID
}

function getImageUrl(url: string) {
  if (url.startsWith('ipfs://')) {
    return `https://ipfs.io/ipfs/${url.replace('ipfs://', '')}`;
  }
  return url;
}

export function FileUpload({
  value,
  onChange,
  accept = 'image/*',
  maxSize = 5,
  aspectRatio,
  placeholder = 'Enter URL or upload a file',
  className = '',
  previewClassName = '',
  showInput = true,
  module,
  id
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件大小
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // 检查文件类型
    if (!file.type.match(accept.replace('*', ''))) {
      setError(`Only ${accept} files are allowed`);
      return;
    }

    try {
      setIsUploading(true);
      setError('');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('module', module);
      if (id) {
        formData.append('id', id);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { success, data } = await response.json();
      if (success && data.url) {
        onChange(data.url);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError('Failed to upload file');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* 预览区域 */}
      {value && accept.includes('image') && (
        <div 
          className={`relative rounded-lg overflow-hidden bg-base-200 ${previewClassName}`}
          style={{ aspectRatio: aspectRatio }}
        >
          <Image
            src={getImageUrl(value)}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized
          />
          <button
            className="absolute top-2 right-2 btn btn-circle btn-sm btn-ghost bg-base-100/50 hover:bg-base-100"
            onClick={() => onChange('')}
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 上传区域 */}
      <div className="flex gap-2">
        {showInput && (
          <input
            type="text"
            className="input input-bordered flex-1"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        )}
        
        <div className="relative">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <button 
            className={`btn ${isUploading ? 'loading' : ''}`}
            disabled={isUploading}
          >
            {!isUploading && <Icon name="upload" className="h-5 w-5" />}
            Upload
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="text-error text-sm">
          {error}
        </div>
      )}
    </div>
  );
} 