import OpenAI from "openai";
import { LogoIdea } from "./prompts";
import { Config } from "sst/node/config";

export function generateLogoPrompt(idea: LogoIdea) {
  return `one logo, ${idea.style} style with ${idea.iconography} motif, ${idea.colorPalette} on a flat ${idea.backgroundColor} background, very simple vector shapes, no swatch, no variations, no text or lettering`;
}

export async function generateLogo(idea: LogoIdea, openai: OpenAI) {
  // const openai = new OpenAI({
  //   apiKey: process.env.OPENAI_API_KEY || Config.OPENAI_API_KEY,
  // });

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
