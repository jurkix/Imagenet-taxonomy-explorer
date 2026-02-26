import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../lib/prisma";
import { toApiNode } from "../../lib/mappers";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const parentPath = req.query.parentPath;

    if (typeof parentPath !== "string" || !parentPath.trim()) {
      res.status(400).json({ error: "parentPath query parameter is required" });
      return;
    }

    if (parentPath.length > 2000) {
      res.status(400).json({ error: "parentPath query parameter is too long" });
      return;
    }

    const children = await prisma.synset.findMany({
      where: { parentPath },
      orderBy: { name: "asc" },
      select: { id: true, path: true, name: true, size: true, depth: true },
    });

    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
    res.json({ data: children.map(toApiNode) });
  } catch (err) {
    console.error("GET /api/tree/children error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
