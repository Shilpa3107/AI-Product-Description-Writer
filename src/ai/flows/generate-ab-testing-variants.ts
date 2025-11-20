'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating A/B testing variants of product descriptions.
 *
 * generateABTestingVariants - A function that generates multiple versions of a product description for A/B testing.
 * GenerateABTestingVariantsInput - The input type for the generateABTestingVariants function.
 * GenerateABTestingVariantsOutput - The return type for the generateABTestingVariants function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateABTestingVariantsInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('A detailed description of the product.'),
  keyFeatures: z.string().describe('The key features of the product, separated by commas.'),
  targetAudience: z.string().describe('The target audience for the product.'),
  numberOfVariants: z.number().describe('The number of description variants to generate.').default(3),
});
export type GenerateABTestingVariantsInput = z.infer<typeof GenerateABTestingVariantsInputSchema>;

const GenerateABTestingVariantsOutputSchema = z.object({
  descriptionVariants: z.array(z.string()).describe('An array of generated product description variants.'),
});
export type GenerateABTestingVariantsOutput = z.infer<typeof GenerateABTestingVariantsOutputSchema>;

export async function generateABTestingVariants(input: GenerateABTestingVariantsInput): Promise<GenerateABTestingVariantsOutput> {
  return generateABTestingVariantsFlow(input);
}

const generateABTestingVariantsPrompt = ai.definePrompt({
  name: 'generateABTestingVariantsPrompt',
  input: {schema: GenerateABTestingVariantsInputSchema},
  output: {schema: GenerateABTestingVariantsOutputSchema},
  prompt: `You are an expert copywriter specializing in creating high-converting product descriptions for e-commerce.
  Your goal is to generate multiple distinct and compelling product descriptions for A/B testing. Each description should highlight different aspects of the product and appeal to the target audience.

  Product Name: {{{productName}}}
  Product Description: {{{productDescription}}}
  Key Features: {{{keyFeatures}}}
  Target Audience: {{{targetAudience}}}

  Generate {{{numberOfVariants}}} different product description variants, each with a unique angle and focus.  Make sure the descriptions are different from each other, highlighting different benefits and features. Write each description in a professional, engaging tone that is likely to increase sales.

  Output the variants as a JSON array of strings under the key "descriptionVariants". Ensure valid JSON format.
  `,
});

const generateABTestingVariantsFlow = ai.defineFlow(
  {
    name: 'generateABTestingVariantsFlow',
    inputSchema: GenerateABTestingVariantsInputSchema,
    outputSchema: GenerateABTestingVariantsOutputSchema,
  },
  async input => {
    const {output} = await generateABTestingVariantsPrompt(input);
    return output!;
  }
);
