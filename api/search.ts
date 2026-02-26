import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../lib/prisma.js";
import { toSearchResult } from "../lib/mappers.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const limit = Math.min(Math.max(1, Number(req.query.limit) || 50), 100);
    const offset = Math.min(Math.max(0, Number(req.query.offset) || 0), 100_000);

    if (!q) {
      res.status(400).json({ error: "q query parameter is required" });
      return;
    }

    if (q.length < 2) {
      res.status(400).json({ error: "q query parameter must be at least 2 characters" });
      return;
    }

    if (q.length > 200) {
      res.status(400).json({ error: "q query parameter must be at most 200 characters" });
      return;
    }

    const where = { name: { contains: q, mode: "insensitive" as const } };

    const [results, total] = await prisma.$transaction([
      prisma.synset.findMany({
        where,
        orderBy: [{ depth: "asc" }, { name: "asc" }],
        take: limit,
        skip: offset,
        select: { id: true, path: true, name: true, size: true, depth: true },
      }),
      prisma.synset.count({ where }),
    ]);

    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
    res.json({ data: results.map(toSearchResult), total, limit, offset });
  } catch (err) {
    console.error("GET /api/search error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
