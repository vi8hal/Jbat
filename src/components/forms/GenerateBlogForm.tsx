'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { summarizeNewsArticle, SummarizeNewsArticleOutput } from '@/ai/flows/summarize-news-article';
import { generateBlogContent, GenerateBlogContentOutput } from '@/ai/flows/generate-blog-content';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

export default function GenerateBlogForm() {
  const [inputType, setInputType] = useState<'article' | 'prompt'>('prompt');
  const [articleContent, setArticleContent] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryOutput, setSummaryOutput] = useState<SummarizeNewsArticleOutput | null>(null);
  const [summaryProgress, setSummaryProgress] = useState(0);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState<GenerateBlogContentOutput | null>(null);

  const { toast } = useToast();
  const router = useRouter();

  const handleSummarize = async () => {
    if (!articleContent.trim()) {
      toast({ title: "Error", description: "Article content cannot be empty.", variant: "destructive" });
      return;
    }
    setIsSummarizing(true);
    setSummaryOutput(null);
    setSummaryProgress(10); // Initial progress

    try {
      // Simulate progress for demo as the current AI flow doesn't stream progress
      const interval = setInterval(() => {
        setSummaryProgress(prev => Math.min(prev + 15, 80));
      }, 300);
      
      const result = await summarizeNewsArticle({ articleContent });
      clearInterval(interval);
      setSummaryProgress(100);
      setSummaryOutput(result);
      toast({ title: "Summary Complete", description: "News article summarized successfully." });
    } catch (error) {
      console.error("Summarization error:", error);
      toast({ title: "Summarization Failed", description: (error as Error).message || "Could not summarize the article.", variant: "destructive" });
      setSummaryProgress(0);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleGenerateBlog = async () => {
    let finalPrompt = '';
    if (inputType === 'article' && summaryOutput?.summary) {
      finalPrompt = `Based on the following news summary: "${summaryOutput.summary}", and considering its suitability score of ${summaryOutput.suitabilityScore?.toFixed(2)}/1.0, generate a blog post. ${userPrompt ? `Incorporate this specific angle: "${userPrompt}"` : ''}`;
    } else if (userPrompt.trim()) {
      finalPrompt = userPrompt;
    } else {
      toast({ title: "Error", description: "A prompt is required to generate a blog post.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    setGeneratedBlog(null);
    try {
      const result = await generateBlogContent({ prompt: finalPrompt });
      setGeneratedBlog(result);
      toast({ title: "Blog Post Generated!", description: "Your new blog post is ready." });
    } catch (error) {
      console.error("Blog generation error:", error);
      toast({ title: "Generation Failed", description: (error as Error).message || "Could not generate the blog post.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditBlog = () => {
    if (generatedBlog) {
      // For simplicity, passing content via query params.
      // In a real app, save to DB and pass ID or use a state management solution.
      const query = new URLSearchParams({
        title: generatedBlog.title,
        content: generatedBlog.content,
      }).toString();
      router.push(`/admin/edit-blog/new?${query}`);
    }
  };

  return (
    <Card className="w-full paper-shadow">
      <CardHeader>
        <CardTitle className="text-2xl">AI Blog Generator</CardTitle>
        <CardDescription>Create blog content from news articles or your own prompts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex space-x-2">
          <Button variant={inputType === 'prompt' ? 'default' : 'outline'} onClick={() => setInputType('prompt')}>Use Prompt</Button>
          <Button variant={inputType === 'article' ? 'default' : 'outline'} onClick={() => setInputType('article')}>Use News Article</Button>
        </div>

        {inputType === 'article' && (
          <div className="space-y-4 p-4 border rounded-md">
            <Label htmlFor="articleContent">News Article Content</Label>
            <Textarea
              id="articleContent"
              placeholder="Paste the full content of the news article here..."
              value={articleContent}
              onChange={(e) => setArticleContent(e.target.value)}
              rows={10}
              disabled={isSummarizing || isGenerating}
            />
            <Button onClick={handleSummarize} disabled={isSummarizing || !articleContent.trim() || isGenerating}>
              {isSummarizing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Summarize Article
            </Button>
            {isSummarizing && <Progress value={summaryProgress} className="w-full mt-2" />}
            {summaryOutput && (
              <Alert className="mt-4">
                <Sparkles className="h-4 w-4" />
                <AlertTitle>Article Summary</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p><strong>Summary:</strong> {summaryOutput.summary}</p>
                  <p><strong>Suitability Score:</strong> {summaryOutput.suitabilityScore?.toFixed(2)} / 1.0</p>
                  <p><em>Progress: {summaryOutput.progress}</em></p>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="userPrompt">
            {inputType === 'article' ? "Additional context or angle for the blog post (optional)" : "Your Blog Post Prompt"}
          </Label>
          <Textarea
            id="userPrompt"
            placeholder={inputType === 'article' ? "e.g., Focus on the impact on small businesses..." : "e.g., Write about the future of renewable energy..."}
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            rows={3}
            disabled={isSummarizing || isGenerating}
          />
        </div>
        
        <Button onClick={handleGenerateBlog} disabled={isGenerating || isSummarizing || (inputType === 'prompt' && !userPrompt.trim()) || (inputType === 'article' && !summaryOutput) }>
          {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Blog Post
        </Button>

        {generatedBlog && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Generated Blog Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">{generatedBlog.title}</h3>
              <div className="prose prose-sm max-w-none dark:prose-invert h-48 overflow-y-auto border rounded-md p-2 bg-muted/50">
                <p>{generatedBlog.content.substring(0, 500)}...</p> 
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleEditBlog} variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit Full Post
              </Button>
            </CardFooter>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
