'use server';

/**
 * @fileOverview Summarizes a news article to determine suitability for a blog.
 *
 * - summarizeNewsArticle - A function that summarizes a news article.
 * - SummarizeNewsArticleInput - The input type for the summarizeNewsArticle function.
 * - SummarizeNewsArticleOutput - The return type for the summarizeNewsArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNewsArticleInputSchema = z.object({
  articleContent: z.string().describe('The content of the news article to summarize.'),
});
export type SummarizeNewsArticleInput = z.infer<typeof SummarizeNewsArticleInputSchema>;

const SummarizeNewsArticleOutputSchema = z.object({
  summary: z.string().describe('A short summary of the news article.'),
  suitabilityScore: z
    .number()
    .describe('A score from 0 to 1 indicating the suitability of the article for the blog.'),
  progress: z.string().describe('A short progress update on the summary generation.'),
});
export type SummarizeNewsArticleOutput = z.infer<typeof SummarizeNewsArticleOutputSchema>;

export async function summarizeNewsArticle(input: SummarizeNewsArticleInput): Promise<SummarizeNewsArticleOutput> {
  return summarizeNewsArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNewsArticlePrompt',
  input: {schema: SummarizeNewsArticleInputSchema},
  output: {schema: SummarizeNewsArticleOutputSchema},
  prompt: `Summarize the following news article and determine its suitability for a blog, providing a score from 0 to 1. Also provide a progress update.

Article Content:
{{articleContent}}

Summary:
{{summary}}
Suitability Score:
{{suitabilityScore}}
Progress:
{{progress}}`,
});

const summarizeNewsArticleFlow = ai.defineFlow(
  {
    name: 'summarizeNewsArticleFlow',
    inputSchema: SummarizeNewsArticleInputSchema,
    outputSchema: SummarizeNewsArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt({
      ...input,
      summary: '',
      suitabilityScore: 0.0,
      progress: 'Generating summary...',
    });
    return output!;
  }
);
