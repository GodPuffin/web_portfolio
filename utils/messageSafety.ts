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
            'You are a content moderator for a personal portfolio website where visitors can leave short messages that appear as floating cursors. Respond with a JSON object containing a single boolean field "isSafe". Set it to true only if the message: 1) Contains no inappropriate, offensive, or spam content 2) Is suitable for all ages 3) Does not contain contact information or external links 4) Is not attempting to promote products/services 5) Does not contain hate speech or harassment.',
        },
        {
          role: "user",
          content:
            `Is this message safe and appropriate for the portfolio website?: "${message}"`,
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
