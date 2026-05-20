// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// Store file in the root project directory
const MEMORY_FILE = path.join(process.cwd(), "memory.json");

function loadMemory() {
  if (!fs.existsSync(MEMORY_FILE)) {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify([], null, 2));
    return [];
  }
  try {
    const data = fs.readFileSync(MEMORY_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveMemory(memory: any[]) {
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
}

// 1. GET Handler - Loads memory.json when page loads
export async function GET() {
  const history = loadMemory();
  return NextResponse.json({ history });
}

// 2. POST Handler - Receives message, gets Gemini reply, saves it, and returns updated log
export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    let chatHistory = loadMemory();

    // Append user input
    chatHistory.push({
      role: "user",
      parts: [{ text: message }],
    });

    // Request Gemini response
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: chatHistory,
    });

    const reply = response.text;

    // Append model response
    chatHistory.push({
      role: "model",
      parts: [{ text: reply }],
    });

    saveMemory(chatHistory);

    return NextResponse.json({ reply, history: chatHistory });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}