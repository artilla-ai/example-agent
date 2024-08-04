import { Runnable, RunnableSequence } from "@langchain/core/runnables";
import { type ChatOpenAI } from "@langchain/openai";
import { Config } from "sst/node/config";
import { designStrategyParser, promptTemplate } from "./prompts";

export interface LogoDesignTaskDescription {
  model: Runnable;
  name?: string;
  shortDescription: string;
  fullDescription: string;
  targetAudience: string;
  details?: string;
}

export async function createDesignStrategy({
  model,
  name,
  shortDescription,
  fullDescription,
  targetAudience,
  details = "Not avaliable",
}: LogoDesignTaskDescription) {
  const chain = RunnableSequence.from([
    promptTemplate,
    model,
    designStrategyParser,
  ]);

  return chain.invoke({
    name,
    shortDescription,
    fullDescription,
    targetAudience,
    details,
  });
}
