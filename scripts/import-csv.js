/* 実行方法
node scripts/import-csv.js
*/


const { PrismaClient } = require("@prisma/client");
const { getDMMF } = require("@prisma/sdk");
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

const prisma = new PrismaClient();

const FILES = [
  "armor",
  "connection",
  "dlois",
  "elois",
  "faq",
  "general",
  "info",
  "power",
  "vehicle",
  "weapon",
  "work",
];

// DMMF キャッシュ用
let schemaModelCache = null;

/**
 * PrismaスキーマのDMMF（構造情報）を取得
 */
async function loadSchema() {
  if (schemaModelCache) return schemaModelCache;
  const schemaText = fs.readFileSync("prisma/schema.prisma", "utf-8");
  const dmmf = await getDMMF({ datamodel: schemaText });
  schemaModelCache = dmmf.datamodel.models;
  return schemaModelCache;
}

/**
 * モデル名に対応する Prisma 型マップを取得
 */
async function getFieldMap(modelName) {
  const models = await loadSchema();
  const model = models.find((m) => m.name.toLowerCase() === modelName.toLowerCase());
  if (!model) throw new Error(`Model not found: ${modelName}`);
  const map = {};
  for (const field of model.fields) {
    map[field.name] = field.type;
  }
  return map;
}

/**
 * フィールド値の型を Prisma の型に合わせて変換
 */
function sanitizeValue(value, type) {
  if (value === undefined || value === null || (typeof value === "string" && value.trim() === "")) {
    return null;
  }

  const normalized = typeof value === "string" ? value.replace("−", "-").trim() : value;

  switch (type) {
    case "Int":
      const intVal = parseInt(normalized, 10);
      return isNaN(intVal) ? null : intVal;
    case "Float":
      const floatVal = parseFloat(normalized);
      return isNaN(floatVal) ? null : floatVal;
    case "Boolean":
      return normalized.toLowerCase?.() === "true";
    case "String":
    default:
      return normalized;
  }
}

/**
 * 単一モデルのCSVファイルを読み込んでインポート
 */
async function importCsvToModel(model) {
  const filePath = path.join("data", `${model}.csv`);
  console.log(`📄 ${filePath} を読み込み中...`);

  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ ファイルが存在しません: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  if (records.length === 0) {
    console.warn(`⚠️ ${model} にデータがありません`);
    return;
  }

  const fieldMap = await getFieldMap(model);

  const converted = records.map((record) => {
    const row = {};
    for (const key in record) {
      const type = fieldMap[key] || "String";
      row[key] = sanitizeValue(record[key], type);
    }
    return row;
  });

  const createMany = prisma[model]?.createMany;
  if (!createMany) {
    console.error(`❌ モデル ${model} が Prisma に存在しません`);
    return;
  }

  // 🔥 ここで既存データを削除！
  await prisma[model].deleteMany();

  await createMany.call(prisma, {
    data: converted,
  });

  console.log(`✅ ${model} をインポートしました (${converted.length} 件)`);
}

/**
 * 全モデルまとめて処理
 */
async function main() {
  for (const model of FILES) {
    await importCsvToModel(model);
  }
  await prisma.$disconnect();
}

main().catch(console.error);
