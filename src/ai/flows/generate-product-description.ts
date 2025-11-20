'use server';

/**
 * @fileOverview An AI agent to generate compelling product descriptions.
 *
 * - generateProductDescription - A function that generates product descriptions.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productFeatures: z
    .string()
    .describe('A list of key features for the product, separated by commas.'),
  productBenefits: z
    .string()
    .optional()
    .describe('A list of key benefits of the product, separated by commas.'),
  targetAudience: z
    .string()
    .optional()
    .describe('Description of the target audience for the product.'),
  keywords: z.string().optional().describe('A list of SEO keywords, separated by commas.'),
  tone: z
    .string()
    .optional()
    .describe('The tone of the description (e.g., professional, friendly, humorous).'),
});
export type GenerateProductDescriptionInput = z.infer<
  typeof GenerateProductDescriptionInputSchema
>;

const GenerateProductDescriptionOutputSchema = z.object({
  productDescription: z.string().describe('The generated product description.'),
  metaDescription: z.string().optional().describe('The generated meta description.'),
  titleSuggestion: z.string().optional().describe('Suggested title for the product.'),
});
export type GenerateProductDescriptionOutput = z.infer<
  typeof GenerateProductDescriptionOutputSchema
>;

export async function generateProductDescription(
  input: GenerateProductDescriptionInput
): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: {schema: GenerateProductDescriptionInputSchema},
  output: {schema: GenerateProductDescriptionOutputSchema},
  prompt: `You are an expert copywriter specializing in e-commerce product descriptions.

  Based on the following information, generate a compelling and SEO-optimized product description:

  Product Name: {{{productName}}}
  Key Features: {{{productFeatures}}}
  {{#if productBenefits}}Key Benefits: {{{productBenefits}}}{{/if}}
  {{#if targetAudience}}Target Audience: {{{targetAudience}}}{{/if}}
  {{#if keywords}}SEO Keywords: {{{keywords}}}{{/if}}
  {{#if tone}}Tone: {{{tone}}}{{/if}}

  Your goal is to create a description that highlights the product's features and benefits,
  appeals to the target audience, and incorporates relevant keywords for SEO.

  In addition to the product description, also provide a suggested meta description and a title suggestion.
  Make sure the product description is optimized for sales and adheres to e-commerce best practices.

  Here's the product description:
  `,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
