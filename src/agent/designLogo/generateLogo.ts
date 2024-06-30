import OpenAI from "openai";
import { LogoIdea } from "./designStrategy";
import { Config } from "sst/node/config";

export function generatePrompt(idea: LogoIdea) {
  return `a single ${idea.style} logo featuring "${idea.iconography}" motif inspired by ${idea.designer} with ${idea.colorPalette} on a single-color ${idea.backgroundColor} background`;
}

export async function generateLogo(idea: LogoIdea) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || Config.OPENAI_API_KEY,
  });

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: generatePrompt(idea),
    n: 1,
    size: "1024x1024",
    quality: "hd",
    style: "vivid",
    response_format: "url",
  });
  return response.data[0].url!;
}
