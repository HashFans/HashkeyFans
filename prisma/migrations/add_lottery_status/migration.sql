-- 添加 status 和 draw_at 列到 lotteries 表
ALTER TABLE "lotteries" 
ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS "draw_at" TIMESTAMP(3);

-- 更新现有记录的状态
UPDATE "lotteries" SET "status" = 'PENDING' WHERE "status" IS NULL;