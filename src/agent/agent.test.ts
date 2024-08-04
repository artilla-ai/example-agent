import { expect, it } from "vitest";
import { LogoIdea } from "./prompts";
import { createDesignStrategy } from "./designStrategy";
import { generateLogo, generateLogoPrompt } from "./generateLogo";
import OpenAI from "openai";
import { ChatOpenAI } from "@langchain/openai";

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
});

const model = new ChatOpenAI({
  model: "gpt-4o",
  apiKey: process.env.VITE_OPENAI_API_KEY,
}).bind({ response_format: { type: "json_object" } });

it(
  "should be able to create a design strategy",
  { timeout: 60000 },
  async () => {
    const result = await createDesignStrategy({
      model,
      name: "Artilla",
      shortDescription: "On-demand work marketplace for software agents",
      fullDescription:
        "Artilla is an on-demand work marketplace for software agents. It allows clients and service providers to collaborate easily without having to worry about billing, feedback, legal or other aspects.",
      targetAudience: "Small and medium businesses",
      details: "You must use a panda mascot in the logo design",
    });
    expect(result).toBeDefined();
  }
);

it("should be able to generate a prompt from an idea", () => {
  const result = generateLogoPrompt(exampleIdea);
  expect(result).toBeDefined();
});

it("should be able to generate a logo", { timeout: 60000 }, async () => {
  const result = await generateLogo(exampleIdea, openai);
  expect(result).toBeDefined();
});

const exampleIdea = {
  colorPalette: "Blues with light grays",
  backgroundColor: "White",
  type: "Mascot",
  movement: "Modern",
  designer: "Paul Rand",
  iconography: "Panda",
  style: "Clean",
  justification:
    "Using blues and light grays enforces the notion of trust and professionalism. The clean style makes the logo easy to recognize and memorable while putting the panda mascot at the forefront to create a friendly and approachable image. The white background further enhances this simplicity and focus.",
} as unknown as LogoIdea;
