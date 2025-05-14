'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

interface YoutubeScriptDisplayProps {
  blogTitle: string;
  blogContent: string;
}

function generateBasicScript(title: string, content: string): string {
  let script = `Title: ${title}\n\n`;
  script += "--- SCRIPT --- \n\n";
  script += "[SCENE START]\n\n";
  script += `**Intro Hook:** (Grab attention related to "${title}")\n\n`;
  script += `Hey everyone, and welcome back! Today, we're diving deep into "${title}".\n\n`;

  // Basic content transformation: split by paragraphs, treat as points
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim() !== ''); // Split by double newlines

  paragraphs.forEach((p, index) => {
    const cleanedParagraph = p.replace(/<[^>]*>/g, ''); // Strip HTML tags
    if (cleanedParagraph.length < 30 && paragraphs.length > 1 && index > 0 && index < paragraphs.length -1) { // Likely a heading
        script += `**Key Point ${index + 1} (Transition/Heading):** ${cleanedParagraph}\n\n`;
    } else {
        script += `**Detail/Explanation ${index + 1}:**\n${cleanedParagraph}\n\n(Visual: Show relevant B-roll or on-screen text related to this point)\n\n`;
    }
  });

  script += `**Summary/Call to Action:**\nSo, to wrap it up, we've covered [mention key points]. What are your thoughts? Let me know in the comments below!\n\n`;
  script += `Don't forget to like this video, subscribe for more content, and hit that notification bell so you don't miss out.\n\n`;
  script += `**Outro:**\nThanks for watching, and I'll see you in the next video!\n\n`;
  script += "[SCENE END]\n";

  return script;
}

export default function YoutubeScriptDisplay({ blogTitle, blogContent }: YoutubeScriptDisplayProps) {
  const [script, setScript] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (blogTitle && blogContent) {
      setScript(generateBasicScript(blogTitle, blogContent));
    }
  }, [blogTitle, blogContent]);

  const handleCopy = () => {
    navigator.clipboard.writeText(script)
      .then(() => toast({ title: "Copied!", description: "Script copied to clipboard." }))
      .catch(err => toast({ title: "Copy Failed", description: "Could not copy script.", variant: "destructive" }));
  };
  
  const handleDownload = () => {
    const blob = new Blob([script], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${blogTitle.toLowerCase().replace(/\s+/g, '_')}_script.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({ title: "Downloaded!", description: "Script downloaded as a .txt file." });
  };


  return (
    <Card className="w-full paper-shadow">
      <CardHeader>
        <CardTitle className="text-2xl">YouTube Video Script</CardTitle>
        <CardDescription>Generated script based on your blog post: "{blogTitle}"</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={script}
          readOnly
          rows={25}
          className="min-h-[500px] text-sm font-mono bg-muted/30"
          placeholder="Generating script..."
        />
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-end gap-2">
        <Button onClick={handleCopy} variant="outline">
          <Copy className="mr-2 h-4 w-4" />
          Copy Script
        </Button>
         <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download Script
        </Button>
      </CardFooter>
    </Card>
  );
}
