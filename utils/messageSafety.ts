import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MessageSafetyResponse = z.object({
  isSafe: z.boolean(),
});

export async function checkMessageSafety(message: string): Promise<boolean> {
  try {
    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            'You are a content moderation assistant. Respond with a JSON object containing a single boolean field "isSafe" indicating if the given message is safe and appropriate for public display.',
        },
        {
          role: "user",
          content: `Is this message safe and appropriate? "${message}"`,
        },
      ],
      temperature: 0,
      max_tokens: 50,
      response_format: zodResponseFormat(
        MessageSafetyResponse,
        "message_safety",
      ),
    });
    const result = response.choices[0]?.message?.parsed;
    if (!result) {
      throw new Error("Invalid response format");
    }
    return result.isSafe;
  } catch (error) {
    console.error("Error checking message safety:", error);
    throw error;
  }
}
