import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const root = process.cwd();
  const assetDirs = ["logos", "stickers", "backgrounds", "3d-assets"];
  const result: Record<string, string[]> = {};

  const allowedExts = new Set([".png", ".jpg", ".jpeg", ".svg", ".gif", ".webp"]);

  for (const dir of assetDirs) {
    try {
      const fullPath = path.join(root, "public", dir);
      const files = fs
        .readdirSync(fullPath)
        .filter((f) => {
          if (f.startsWith(".")) return false;
          const ext = path.extname(f).toLowerCase();
          return allowedExts.has(ext);
        });
      // prefix with leading slash so the client can fetch directly
      result[dir] = files.map((f) => `/${dir}/${f}`);
    } catch (err) {
      // if directory doesn't exist or other error, just return empty list
      result[dir] = [];
    }
  }

  return NextResponse.json(result);
}
