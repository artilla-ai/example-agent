/**
 * This file contains the prompts and schemas for the design agent
 *
 */

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { designers, logoStyles, logoTypes, movements } from "./constants";

const systemRoleTemplate =
  "You are an expert graphic designer specializing in logo design.";

export type DesignStrategy = z.infer<typeof designStrategySchema>;

export type LogoIdea = z.infer<typeof logoIdeaSchema>;

/**
 * A schema for a logo idea
 */
const logoIdeaSchema = z.object({
  colorPalette: z
    .string()
    .describe("The color palette for the design e.g. light blues with greens"),
  backgroundColor: z
    .string()
    .describe("The background color for the design e.g. white, dark blue"),
  type: z.enum(logoTypes).describe("The type of logo for the design"),
  movement: z
    .enum(movements)
    .describe("The genre or movement of the logo design"),
  designer: z
    .enum(designers)
    .describe("A designer who's style the logo should emulate"),
  iconography: z
    .string()
    .describe("A short 1-word icon for the design e.g. tree, rocket, triangle"),
  style: z.enum(logoStyles).describe("The style of the logo design"),
  justification: z.string().describe("The design rationale for this design"),
});

/**
 * A loose version of the logo idea schema that allows for more flexibility when parsing
 */
const looseLogoIdeaSchema = z.object({
  colorPalette: z
    .string()
    .describe("The color palette for the design e.g. light blues with greens"),
  backgroundColor: z
    .string()
    .describe("The background color for the design e.g. white, dark blue"),
  type: z.enum(logoTypes).describe("The type of logo for the design"),
  movement: z.string().describe("The genre or movement of the logo design"),
  designer: z
    .string()
    .describe("A designer who's style the logo should emulate"),
  iconography: z
    .string()
    .describe("A short 1-word icon for the design e.g. tree, rocket, triangle"),
  style: z.string().describe("The style of the logo design"),
  justification: z.string().describe("The design rationale for this design"),
});

/**
 * A schema for a design strategy with 4 separate logo ideas
 */
const designStrategySchema = z.object({
  designApproach: z
    .string()
    .describe("A thoughtful paragraph describing the overall design approach"),
  ideas: z
    .array(logoIdeaSchema)
    .min(4)
    .max(4)
    .describe("A list of ideas for the logo design ordered by priority"),
});

/**
 * A loose version of the design strategy schema that allows for more flexibility when parsing
 */
const looseDesignStrategySchema = z.object({
  designApproach: z
    .string()
    .describe("A thoughtful paragraph describing the overall design approach"),
  ideas: z
    .array(looseLogoIdeaSchema)
    .describe("A list of ideas for the logo design ordered by priority")
    .min(4)
    .max(4),
});

export const designStrategyParser = StructuredOutputParser.fromZodSchema(
  looseDesignStrategySchema
);

const designStrategyTemplate = `Your task is to design a detailed strategy to help a logo design project. You will be provided with various details about the client's product and / or company. Your goal is to use this information create a comprehensive plan that will guide the project. You should explore diverse design approaches, color palettes, iconography, styles, and justifications for each idea. Your strategy should be well-structured and easy to follow. Take your time and think carefully about the project requirements. If the client has specified any requirements, they must be included in every single idea you generate without any deviation or errors.

{formatInstructions}`;

const clientRequestTemplate = `
NAME_OF_PRODUCT_OR_COMPANY: {name}

SHORT_DESCRIPTION: {shortDescription}

FULL_DESCRIPTION: {fullDescription}

TARGET_AUDIENCE_OR_CUSTOMERS: {targetAudience}

DETAILS: {details}
`;

export const promptTemplate = await ChatPromptTemplate.fromMessages([
  ["system", systemRoleTemplate],
  ["system", designStrategyTemplate],
  ["user", clientRequestTemplate],
]).partial({
  formatInstructions: designStrategyParser.getFormatInstructions(),
});
