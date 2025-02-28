import { NextResponse } from 'next/server';
import { S3 } from '@aws-sdk/client-s3';

// 创建 S3 客户端
const s3 = new S3({
  endpoint: "https://endpoint.4everland.co",
  credentials: {
    accessKeyId: process.env['4EVERLAND-Bucket-APIKey']!,
    secretAccessKey: process.env['4EVERLAND-Bucket-APISecret']!
  },
  region: "4EVERLAND",
});

// 文件类型到目录的映射
const typeToDirectory: Record<string, string> = {
  'image/jpeg': 'images',
  'image/png': 'images',
  'image/gif': 'images',
  'image/webp': 'images',
  'application/pdf': 'documents',
  'video/mp4': 'videos',
  // 可以添加更多类型
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const module = formData.get('module') as string; // 例如：'avatar', 'lottery', 'post'
    const id = formData.get('id') as string; // 可选的关联ID

    if (!file || !module) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // 获取文件类型对应的目录
    const typeDir = typeToDirectory[file.type] || 'others';
    
    // 生成文件名
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomStr}.${fileExtension}`;

    // 构建存储路径：类型/模块/[id]/文件名
    const key = id 
      ? `${typeDir}/${module}/${id}/${fileName}`
      : `${typeDir}/${module}/${fileName}`;

    // 转换文件为 buffer
    const buffer = await file.arrayBuffer();

    // 上传参数
    const uploadParams = {
      Bucket: "hashfans",
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: file.type,
      Metadata: {
        'module': module,
        'original-name': file.name,
        ...(id && { 'reference-id': id })
      }
    };

    // 上传文件
    await s3.putObject(uploadParams);

    // 获取 IPFS CID
    const headData = await s3.headObject({
      Bucket: "hashfans",
      Key: key,
    });

    const ipfsCid = headData.Metadata?.['ipfs-hash'];

    if (!ipfsCid) {
      throw new Error('Failed to get IPFS CID');
    }

    // 返回成功响应
    return NextResponse.json({
      success: true,
      data: {
        url: `ipfs://${ipfsCid}`,
        path: key,
        size: file.size,
        type: file.type,
        filename: fileName,
        originalName: file.name
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed' 
      },
      { status: 500 }
    );
  }
}

// 文件大小限制：10MB
export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '10mb',
  },
};