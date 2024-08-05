import { Runnable, RunnableSequence } from "@langchain/core/runnables";
import { designStrategyParser, promptTemplate } from "./prompts";

export interface LogoDesignTaskDescription {
  model: Runnable;
  name?: string;
  shortDescription: string;
  fullDescription: string;
  targetAudience: string;
  details?: string;
}

/**
 * Create a design strategy for a logo design task. This function uses a RunnableSequence to
 * prompt the user for the design strategy and then parse the design strategy using the designStrategyParser.
 * @param model The model to use
 * @param name The name of the design strategy
 * @param shortDescription The short description of the design strategy
 * @param fullDescription The full description of the design strategy
 * @param targetAudience The target audience of the design strategy
 * @param details The details of the design strategy
 * @returns {Promise<string>} The design strategy
 */
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
