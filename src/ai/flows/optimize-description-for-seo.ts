'use server';

/**
 * @fileOverview This file contains the Genkit flow for optimizing product descriptions for SEO.
 *
 * It includes:
 * - `optimizeDescriptionForSEO` - A function that optimizes a product description for SEO.
 * - `OptimizeDescriptionForSEOInput` - The input type for the `optimizeDescriptionForSEO` function.
 * - `OptimizeDescriptionForSEOOutput` - The output type for the `optimizeDescriptionForSEO` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeDescriptionForSEOInputSchema = z.object({
  productDescription: z
    .string()
    .describe('The product description to optimize for SEO.'),
  productName: z.string().describe('The name of the product.'),
  keywords: z
    .string()
    .describe(
      'Comma separated list of keywords that should be included in the description.'
    )
    .optional(),
});

export type OptimizeDescriptionForSEOInput = z.infer<
  typeof OptimizeDescriptionForSEOInputSchema
>;

const OptimizeDescriptionForSEOOutputSchema = z.object({
  optimizedDescription: z.string().describe('The SEO optimized product description.'),
  metaDescription: z.string().describe('The meta description for the product.'),
  titleSuggestion: z.string().describe('A suggested title for the product listing.'),
});

export type OptimizeDescriptionForSEOOutput = z.infer<
  typeof OptimizeDescriptionForSEOOutputSchema
>;

export async function optimizeDescriptionForSEO(
  input: OptimizeDescriptionForSEOInput
): Promise<OptimizeDescriptionForSEOOutput> {
  return optimizeDescriptionForSEOFlow(input);
}

const optimizeDescriptionForSEOPrompt = ai.definePrompt({
  name: 'optimizeDescriptionForSEOPrompt',
  input: {schema: OptimizeDescriptionForSEOInputSchema},
  output: {schema: OptimizeDescriptionForSEOOutputSchema},
  prompt: `You are an SEO expert specializing in optimizing product descriptions for e-commerce.

  Optimize the provided product description for search engines, incorporating relevant keywords and creating a compelling meta description and a catchy title suggestion.

  Product Name: {{{productName}}}
  Product Description: {{{productDescription}}}
  Keywords: {{{keywords}}}

  Here are a few examples of keywords that often increase the search engine optimization of product descriptions:
  - Benefit keywords
  - Long tail keywords
  - Geo keywords
  - Intent keywords
  - Seasonal keywords
`,
});

const optimizeDescriptionForSEOFlow = ai.defineFlow(
  {
    name: 'optimizeDescriptionForSEOFlow',
    inputSchema: OptimizeDescriptionForSEOInputSchema,
    outputSchema: OptimizeDescriptionForSEOOutputSchema,
  },
  async input => {
    const {output} = await optimizeDescriptionForSEOPrompt(input);
    return output!;
  }
);
