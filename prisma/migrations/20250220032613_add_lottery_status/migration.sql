-- CreateTable
CREATE TABLE "cards" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "image_url" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "wallet_address" VARCHAR(42) NOT NULL,
    "display_address" VARCHAR(50),
    "share_code" VARCHAR(8),
    "initial_card_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_cards" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "card_id" INTEGER NOT NULL,
    "original_owner_id" INTEGER NOT NULL,
    "original_owner_address" VARCHAR(42) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_connections" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "connected_user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lotteries" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(8) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "image_url" VARCHAR(255),
    "creator_id" INTEGER NOT NULL,
    "signature" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "draw_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lotteries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lottery_participants" (
    "id" SERIAL NOT NULL,
    "lottery_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "prize_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lottery_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prizes" (
    "id" SERIAL NOT NULL,
    "lottery_id" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prizes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cards_id_title_idx" ON "cards"("id", "title");

-- CreateIndex
CREATE UNIQUE INDEX "users_wallet_address_key" ON "users"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "users_share_code_key" ON "users"("share_code");

-- CreateIndex
CREATE INDEX "users_wallet_address_idx" ON "users"("wallet_address");

-- CreateIndex
CREATE INDEX "user_cards_user_id_card_id_idx" ON "user_cards"("user_id", "card_id");

-- CreateIndex
CREATE INDEX "user_cards_card_id_idx" ON "user_cards"("card_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_cards_user_id_card_id_original_owner_id_key" ON "user_cards"("user_id", "card_id", "original_owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_connections_user_id_connected_user_id_key" ON "user_connections"("user_id", "connected_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "lotteries_code_key" ON "lotteries"("code");

-- CreateIndex
CREATE INDEX "lotteries_code_idx" ON "lotteries"("code");

-- CreateIndex
CREATE UNIQUE INDEX "lottery_participants_lottery_id_user_id_key" ON "lottery_participants"("lottery_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "prizes_lottery_id_level_key" ON "prizes"("lottery_id", "level");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_initial_card_id_fkey" FOREIGN KEY ("initial_card_id") REFERENCES "cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_cards" ADD CONSTRAINT "user_cards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_cards" ADD CONSTRAINT "user_cards_original_owner_id_fkey" FOREIGN KEY ("original_owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_cards" ADD CONSTRAINT "user_cards_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_connections" ADD CONSTRAINT "user_connections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_connections" ADD CONSTRAINT "user_connections_connected_user_id_fkey" FOREIGN KEY ("connected_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lotteries" ADD CONSTRAINT "lotteries_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lottery_participants" ADD CONSTRAINT "lottery_participants_lottery_id_fkey" FOREIGN KEY ("lottery_id") REFERENCES "lotteries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lottery_participants" ADD CONSTRAINT "lottery_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lottery_participants" ADD CONSTRAINT "lottery_participants_prize_id_fkey" FOREIGN KEY ("prize_id") REFERENCES "prizes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prizes" ADD CONSTRAINT "prizes_lottery_id_fkey" FOREIGN KEY ("lottery_id") REFERENCES "lotteries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
