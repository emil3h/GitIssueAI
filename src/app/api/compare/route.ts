import { NextRequest, NextResponse } from "next/server";
import { compareFiles } from "@/lib/openai";
import type { CompareRequest, CompareResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CompareRequest;

    const { file1Content, file2Content, file1Name, file2Name, instructions } = body;

    if (!file1Content || !file2Content) {
      return NextResponse.json(
        { error: "Both file contents are required." },
        { status: 400 }
      );
    }

    if (!file1Name || !file2Name) {
      return NextResponse.json(
        { error: "Both file names are required." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured. Add OPENAI_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    const result = await compareFiles(
      file1Content,
      file2Content,
      file1Name,
      file2Name,
      instructions
    );

    const response: CompareResponse = {
      summary: result.summary,
      differences: result.differences,
      ghCommand: result.ghCommand,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("Compare API error:", err);
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
