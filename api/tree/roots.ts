import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../lib/prisma.js";
import { toApiNode } from "../../lib/mappers.js";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  if (_req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const roots = await prisma.synset.findMany({
      where: { parentPath: null },
      orderBy: { name: "asc" },
      select: { id: true, path: true, name: true, size: true, depth: true },
    });

    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
    res.json({ data: roots.map(toApiNode) });
  } catch (err) {
    console.error("GET /api/tree/roots error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
