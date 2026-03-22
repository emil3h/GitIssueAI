import OpenAI from "openai";

function getClient(): OpenAI {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function compareFiles(
  file1Content: string,
  file2Content: string,
  file1Name: string,
  file2Name: string,
  instructions?: string
): Promise<{ summary: string; differences: string[]; ghCommand: string }> {
  const customInstructions = instructions
    ? `\n\nAdditional instructions from the user:\n${instructions}`
    : "";

  const prompt = `You are a senior developer reviewing two versions of a file. Analyze the differences between these two files and produce a structured comparison.

File 1: "${file1Name}"
\`\`\`
${file1Content}
\`\`\`

File 2: "${file2Name}"
\`\`\`
${file2Content}
\`\`\`
${customInstructions}

Respond in EXACTLY this JSON format (no markdown fences, just raw JSON):
{
  "summary": "A concise 1-2 sentence summary of what changed between the files and why it matters.",
  "differences": [
    "First meaningful difference described clearly",
    "Second meaningful difference described clearly"
  ],
  "issueTitle": "Short descriptive title for a GitHub issue tracking these changes",
  "issueBody": "A well-formatted issue body listing all changes as bullet points"
}

Guidelines:
- Focus on meaningful, substantive differences — skip trivial whitespace or formatting unless significant.
- Group related changes logically.
- Write each difference as a clear, specific bullet that a developer would find useful.
- The issue title should be concise and descriptive.
- The issue body should use markdown bullet points and be readable.
- Keep it professional and useful — this will be used in a real GitHub issue.`;

  const response = await getClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
    max_tokens: 2000,
  });

  const raw = response.choices[0]?.message?.content?.trim() ?? "";

  let parsed: {
    summary: string;
    differences: string[];
    issueTitle: string;
    issueBody: string;
  };

  try {
    parsed = JSON.parse(raw);
  } catch {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("Failed to parse OpenAI response as JSON");
    }
  }

  const escapedBody = parsed.issueBody
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n");

  const ghCommand = `gh issue create --title "${parsed.issueTitle}" --body "${escapedBody}" --label "documentation"`;

  return {
    summary: parsed.summary,
    differences: parsed.differences,
    ghCommand,
  };
}
