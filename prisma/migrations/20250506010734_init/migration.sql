/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Armor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Connection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Dlois` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Elois` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Faq` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Favorite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `General` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Info` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Power` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehicle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Weapon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Work` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Account";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Armor";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Connection";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Dlois";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Elois";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Faq";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Favorite";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "General";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Info";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Power";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Session";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Vehicle";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "VerificationToken";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Weapon";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Work";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "power" (
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
CREATE TABLE "weapon" (
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
CREATE TABLE "armor" (
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
CREATE TABLE "connection" (
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
CREATE TABLE "general" (
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
CREATE TABLE "vehicle" (
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
CREATE TABLE "dlois" (
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
CREATE TABLE "elois" (
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
CREATE TABLE "faq" (
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
CREATE TABLE "info" (
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
CREATE TABLE "favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "record_kind" TEXT NOT NULL,
    "record_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "work" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supplement" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stat" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "emblems" TEXT
);
