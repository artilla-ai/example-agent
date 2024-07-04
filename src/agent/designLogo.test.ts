import { expect, it } from "vitest";
import { LogoIdea, createDesignStrategy } from "./designLogo/designStrategy";
import { generateLogo, generatePrompt } from "./designLogo/generateLogo";

it(
  "should be able to create a design strategy",
  { timeout: 60000 },
  async () => {
    const result = await createDesignStrategy({
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
  const result = generatePrompt(exampleIdea);
  expect(result).toBeDefined();
});

it("should be able to generate a logo", { timeout: 60000 }, async () => {
  const result = await generateLogo(exampleIdea);
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
