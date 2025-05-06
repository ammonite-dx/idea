/*
  Warnings:

  - You are about to drop the `armor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `connection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dlois` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `elois` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `faq` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `favorite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `general` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `info` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `power` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vehicle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `weapon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `works` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "armor";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "connection";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "dlois";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "elois";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "faq";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "favorite";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "general";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "info";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "power";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "vehicle";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "weapon";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "works";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Power" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supplement" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ruby" TEXT NOT NULL,
    "maxlv" TEXT NOT NULL,
    "maxlv_int" INTEGER,
    "timing" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "dfclty" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "rng" TEXT NOT NULL,
    "encroach" TEXT NOT NULL,
    "restrict" TEXT NOT NULL,
    "premise" TEXT,
    "flavor" TEXT,
    "effect" TEXT,
    "ref_weapon_id" TEXT,
    "ref_armor_id" TEXT,
    "ref_faq_id" TEXT,
    "ref_info_id" TEXT,
    "update" TEXT,
    "other_ver_id" TEXT,
    "rel_power_id" TEXT,
    "rel_weapon_id" TEXT,
    "rel_armor_id" TEXT,
    "rel_vehicle_id" TEXT,
    "rel_connection_id" TEXT,
    "rel_general_id" TEXT,
    "rel_dlois_id" TEXT,
    "type_restrict_order" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Weapon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supplement" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ruby" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "acc" TEXT NOT NULL,
    "acc_int" INTEGER,
    "atk" TEXT NOT NULL,
    "atk_int" INTEGER,
    "guard" TEXT NOT NULL,
    "guard_int" INTEGER,
    "rng" TEXT NOT NULL,
    "rng_int" INTEGER,
    "procure" TEXT,
    "procure_int" INTEGER,
    "stock" TEXT,
    "stock_int" INTEGER,
    "exp" TEXT,
    "exp_int" INTEGER,
    "rec" TEXT,
    "flavor" TEXT,
    "effect" TEXT,
    "price" TEXT,
    "rec_effect" TEXT,
    "ref_faq_id" TEXT,
    "ref_info_id" TEXT,
    "refed_power_id" TEXT,
    "refed_armor_id" TEXT,
    "refed_general_id" TEXT,
    "update" TEXT,
    "other_ver_id" TEXT,
    "rel_power_id" TEXT,
    "rel_weapon_id" TEXT,
    "rel_armor_id" TEXT,
    "rel_vehicle_id" TEXT,
    "rel_connection_id" TEXT,
    "rel_general_id" TEXT,
    "rel_dlois_id" TEXT,
    "type_order" INTEGER NOT NULL,
    "cost_order" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Armor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supplement" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ruby" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "dodge" TEXT NOT NULL,
    "dodge_int" INTEGER,
    "initiative" TEXT NOT NULL,
    "initiative_int" INTEGER,
    "armor" TEXT NOT NULL,
    "armor_int" INTEGER,
    "procure" TEXT,
    "procure_int" INTEGER,
    "stock" TEXT,
    "stock_int" INTEGER,
    "exp" TEXT,
    "exp_int" INTEGER,
    "rec" TEXT,
    "flavor" TEXT,
    "effect" TEXT,
    "price" TEXT,
    "rec_effect" TEXT,
    "ref_weapon_id" TEXT,
    "ref_faq_id" TEXT,
    "ref_info_id" TEXT,
    "refed_power_id" TEXT,
    "update" TEXT,
    "other_ver_id" TEXT,
    "rel_power_id" TEXT,
    "rel_weapon_id" TEXT,
    "rel_armor_id" TEXT,
    "rel_vehicle_id" TEXT,
    "rel_connection_id" TEXT,
    "rel_general_id" TEXT,
    "rel_dlois_id" TEXT,
    "type_order" INTEGER NOT NULL,
    "cost_order" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Connection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supplement" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ruby" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "procure" TEXT,
    "procure_int" INTEGER,
    "stock" TEXT,
    "stock_int" INTEGER,
    "exp" TEXT,
    "exp_int" INTEGER,
    "rec" TEXT,
    "flavor" TEXT,
    "effect" TEXT,
    "price" TEXT,
    "rec_effect" TEXT,
    "ref_faq_id" TEXT,
    "ref_info_id" TEXT,
    "update" TEXT,
    "other_ver_id" TEXT,
    "rel_power_id" TEXT,
    "rel_weapon_id" TEXT,
    "rel_armor_id" TEXT,
    "rel_vehicle_id" TEXT,
    "rel_connection_id" TEXT,
    "rel_general_id" TEXT,
    "rel_dlois_id" TEXT,
    "cost_order" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "General" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supplement" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ruby" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "procure" TEXT,
    "procure_int" INTEGER,
    "stock" TEXT,
    "stock_int" INTEGER,
    "exp" TEXT,
    "exp_int" INTEGER,
    "rec" TEXT,
    "flavor" TEXT,
    "effect" TEXT,
    "price" TEXT,
    "rec_effect" TEXT,
    "ref_weapon_id" TEXT,
    "ref_faq_id" TEXT,
    "ref_info_id" TEXT,
    "update" TEXT,
    "other_ver_id" TEXT,
    "rel_power_id" TEXT,
    "rel_weapon_id" TEXT,
    "rel_armor_id" TEXT,
    "rel_vehicle_id" TEXT,
    "rel_connection_id" TEXT,
    "rel_general_id" TEXT,
    "rel_dlois_id" TEXT,
    "type_order" INTEGER NOT NULL,
    "cost_order" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supplement" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ruby" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "atk" TEXT NOT NULL,
    "atk_int" INTEGER,
    "initiative" TEXT NOT NULL,
    "initiative_int" INTEGER,
    "armor" TEXT NOT NULL,
    "armor_int" INTEGER,
    "dash" TEXT NOT NULL,
    "dash_int" INTEGER,
    "procure" TEXT,
    "procure_int" INTEGER,
    "stock" TEXT,
    "stock_int" INTEGER,
    "exp" TEXT,
    "exp_int" INTEGER,
    "rec" TEXT,
    "flavor" TEXT,
    "effect" TEXT,
    "price" TEXT,
    "rec_effect" TEXT,
    "ref_faq_id" TEXT,
    "ref_info_id" TEXT,
    "update" TEXT,
    "other_ver_id" TEXT,
    "rel_power_id" TEXT,
    "rel_weapon_id" TEXT,
    "rel_armor_id" TEXT,
    "rel_vehicle_id" TEXT,
    "rel_connection_id" TEXT,
    "rel_general_id" TEXT,
    "rel_dlois_id" TEXT,
    "cost_order" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Dlois" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supplement" TEXT NOT NULL,
    "no" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ruby" TEXT NOT NULL,
    "restrict" TEXT NOT NULL,
    "flavor" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rec" TEXT,
    "effect" TEXT NOT NULL,
    "rec_effect" TEXT,
    "ref_power_id" TEXT,
    "ref_faq_id" TEXT,
    "ref_info_id" TEXT,
    "update" TEXT,
    "other_ver_id" TEXT,
    "rel_power_id" TEXT,
    "rel_weapon_id" TEXT,
    "rel_armor_id" TEXT,
    "rel_vehicle_id" TEXT,
    "rel_connection_id" TEXT,
    "rel_general_id" TEXT,
    "rel_dlois_id" TEXT,
    "flavor_summary" TEXT NOT NULL,
    "effect_summary" TEXT NOT NULL,
    "rec_effect_summary" TEXT,
    "type_order" INTEGER NOT NULL,
    "restrict_order" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Elois" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supplement" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ruby" TEXT NOT NULL,
    "timing" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "dfclty" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "rng" TEXT NOT NULL,
    "urge" TEXT NOT NULL,
    "flavor" TEXT NOT NULL,
    "effect" TEXT NOT NULL,
    "ref_faq_id" TEXT,
    "ref_info_id" TEXT,
    "update" TEXT,
    "other_ver_id" TEXT,
    "rel_elois_id" TEXT,
    "type_order" INTEGER NOT NULL,
    "urge_order" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Work" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supplement" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stat" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "emblems" TEXT
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "q" TEXT NOT NULL,
    "a" TEXT NOT NULL,
    "refed_power_id" TEXT,
    "refed_weapon_id" TEXT,
    "refed_armor_id" TEXT,
    "refed_vehicle_id" TEXT,
    "refed_connection_id" TEXT,
    "refed_general_id" TEXT,
    "refed_dlois_id" TEXT,
    "refed_elois_id" TEXT
);

-- CreateTable
CREATE TABLE "Info" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "refed_power_id" TEXT,
    "refed_weapon_id" TEXT,
    "refed_armor_id" TEXT,
    "refed_vehicle_id" TEXT,
    "refed_connection_id" TEXT,
    "refed_general_id" TEXT,
    "refed_dlois_id" TEXT,
    "refed_elois_id" TEXT
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "discordId" TEXT,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Favorite" (
    "userId" TEXT NOT NULL,
    "recordKind" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId", "recordKind", "recordId"),
    CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId");

-- CreateIndex
CREATE INDEX "Favorite_recordKind_recordId_idx" ON "Favorite"("recordKind", "recordId");
