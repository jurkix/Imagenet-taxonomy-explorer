import express from "express";
import cors from "cors";
import type { VercelRequest, VercelResponse } from "@vercel/node";

import rootsHandler from "./api/tree/roots";
import childrenHandler from "./api/tree/children";
import searchHandler from "./api/search";

const app = express();
app.use(cors());

type VercelHandler = (req: VercelRequest, res: VercelResponse) => void | Promise<void>;

// Express req/res are runtime-compatible with VercelRequest/VercelResponse
// (both expose req.query, res.json, res.status etc.)
function wrap(handler: VercelHandler): express.RequestHandler {
  return (req, res, next) => {
    Promise.resolve(handler(req as unknown as VercelRequest, res as unknown as VercelResponse))
      .catch(next);
  };
}

app.get("/api/tree/roots", wrap(rootsHandler));
app.get("/api/tree/children", wrap(childrenHandler));
app.get("/api/search", wrap(searchHandler));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
