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
  const result = generatePrompt(exampleStrategy.ideas[0]);
  expect(result).toBeDefined();
});

it("should be able to generate a logo", { timeout: 60000 }, async () => {
  const result = await generateLogo(exampleStrategy.ideas[0]);
  expect(result).toBeDefined();
});

const exampleStrategy = {
  designApproach:
    "The overall design approach for the Artilla logo should be modern, approachable, and tech-savvy. Given that Artilla is an on-demand work marketplace for software agents, the logo should communicate trust, efficiency, and innovation. The panda mascot will play a central role, made to appear friendly and professional to appeal to small and medium businesses. It should also reflect the ease of use and reliability that Artilla promises to its clients and service providers. The design will lean toward a clean, minimalistic style with a touch of modernity to fit industry standards.",
  ideas: [
    {
      colorPalette: "Blues with light grays",
      backgroundColor: "White",
      type: "Mascot",
      movement: "Modern",
      designer: "Paul Rand",
      iconography: "Panda",
      style: "Clean",
      justification:
        "Using blues and light grays enforces the notion of trust and professionalism. The clean style makes the logo easy to recognize and memorable while putting the panda mascot at the forefront to create a friendly and approachable image. The white background further enhances this simplicity and focus.",
    },
    {
      colorPalette: "Green with white and black accents",
      backgroundColor: "Light green",
      type: "Mascot",
      movement: "Eco-Modern",
      designer: "Saul Bass",
      iconography: "Panda",
      style: "Minimalistic",
      justification:
        "Green symbolizes growth and vitality, which aligns well with the service's role in business efficiency. The panda mascot, combined with a minimalistic approach, ensures that the logo conveys a sense of reliability and modernity. Light green background symbolizes freshness and new opportunities.",
    },
    {
      colorPalette: "Dark blue and white",
      backgroundColor: "Dark blue",
      type: "Emblem",
      movement: "Tech-Savvy",
      designer: "Lindon Leader",
      iconography: "Panda",
      style: "Bold",
      justification:
        "Dark blue and white create a strong contrast and indicate a high level of professionalism and trust. The emblem type makes the logo appear more structured and authoritative. This reinforces the narrative of a tech-savvy, reliable marketplace. The bold style ensures that the logo stands out in digital environments.",
    },
    {
      colorPalette: "Orange and white",
      backgroundColor: "Gray",
      type: "Abstract Logo Mark",
      movement: "Abstract Tech",
      designer: "Josef Müller-Brockmann",
      iconography: "Panda",
      style: "Geometric",
      justification:
        "Orange is energetic and inviting, which helps position Artilla as a dynamic and future-forward platform. The geometric style gives a nod to the tech industry while still incorporating the panda mascot in an abstract form, making it both unique and engaging. A gray background balances the vibrancy of the orange.",
    },
  ] as any[],
};
