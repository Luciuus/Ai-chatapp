// app/api/reset/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MEMORY_FILE = path.join(process.cwd(), "memory.json");

export async function POST() {
  try {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify([], null, 2));
    return NextResponse.json({ message: "Memory cleared", history: [] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to clear memory" }, { status: 500 });
  }
}