import OpenAI from "openai";
import { LogoIdea } from "./prompts";

/**
 * Generates a prompt for the OpenAI API to generate a logo
 * @param idea The logo idea
 * @returns {string} The prompt
 */
export function generateLogoPrompt(idea: LogoIdea) {
  return `one logo, ${idea.style} style with ${idea.iconography} motif, ${idea.colorPalette} on a flat ${idea.backgroundColor} background, very simple vector shapes, no swatch, no variations, no text or lettering`;
}

/**
 * Generates a logo using the OpenAI API
 * @param idea The logo idea
 * @param openai The OpenAI API client
 * @returns {Promise<string>} The URL of the generated logo
 */
export async function generateLogo(idea: LogoIdea, openai: OpenAI) {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: generateLogoPrompt(idea),
    n: 1,
    size: "1024x1024",
    quality: "hd",
    style: "vivid",
    response_format: "url",
  });
  return response.data[0].url!;
}
