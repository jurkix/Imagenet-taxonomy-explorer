import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import { parseXmlToSeedNodes } from "./parseXml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BATCH_SIZE = 500;

async function main() {
  const prisma = new PrismaClient();

  try {
    const count = await prisma.synset.count();
    if (count > 0) {
      console.log(`Database already seeded with ${count} rows. Skipping.`);
      return;
    }

    const xmlPath = path.resolve(__dirname, "structure_released.xml");
    console.log(`Reading XML from ${xmlPath}...`);
    const xml = fs.readFileSync(xmlPath, "utf-8");

    console.log("Parsing XML...");
    const start = performance.now();
    const nodes = parseXmlToSeedNodes(xml);
    console.log(
      `Parsed ${nodes.length} nodes in ${(performance.now() - start).toFixed(0)}ms`,
    );

    console.log("Seeding database...");
    const seedStart = performance.now();

    for (let i = 0; i < nodes.length; i += BATCH_SIZE) {
      const batch = nodes.slice(i, i + BATCH_SIZE);
      await prisma.synset.createMany({ data: batch, skipDuplicates: true });

      if ((i / BATCH_SIZE) % 20 === 0) {
        const progress = Math.round((i / nodes.length) * 100);
        console.log(`  ${progress}% (${i}/${nodes.length})`);
      }
    }

    console.log(
      `Seeded ${nodes.length} rows in ${(performance.now() - seedStart).toFixed(0)}ms`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
