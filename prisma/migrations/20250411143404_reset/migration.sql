/*
  Warnings:

  - You are about to drop the column `data_id` on the `favorite` table. All the data in the column will be lost.
  - You are about to drop the column `data_kind` on the `favorite` table. All the data in the column will be lost.
  - You are about to drop the column `encroach_int` on the `power` table. All the data in the column will be lost.
  - Added the required column `record_id` to the `favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `record_kind` to the `favorite` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "record_kind" TEXT NOT NULL,
    "record_id" TEXT NOT NULL
);
INSERT INTO "new_favorite" ("id", "user_id") SELECT "id", "user_id" FROM "favorite";
DROP TABLE "favorite";
ALTER TABLE "new_favorite" RENAME TO "favorite";
CREATE TABLE "new_power" (
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
INSERT INTO "new_power" ("category", "dfclty", "effect", "encroach", "flavor", "id", "maxlv", "maxlv_int", "name", "other_ver_id", "premise", "ref_armor_id", "ref_faq_id", "ref_info_id", "ref_weapon_id", "rel_armor_id", "rel_connection_id", "rel_dlois_id", "rel_general_id", "rel_power_id", "rel_vehicle_id", "rel_weapon_id", "restrict", "rng", "ruby", "skill", "supplement", "target", "timing", "type", "type_restrict_order", "update") SELECT "category", "dfclty", "effect", "encroach", "flavor", "id", "maxlv", "maxlv_int", "name", "other_ver_id", "premise", "ref_armor_id", "ref_faq_id", "ref_info_id", "ref_weapon_id", "rel_armor_id", "rel_connection_id", "rel_dlois_id", "rel_general_id", "rel_power_id", "rel_vehicle_id", "rel_weapon_id", "restrict", "rng", "ruby", "skill", "supplement", "target", "timing", "type", "type_restrict_order", "update" FROM "power";
DROP TABLE "power";
ALTER TABLE "new_power" RENAME TO "power";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
