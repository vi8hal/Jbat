
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BotMessageSquare, Edit, Youtube } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <BotMessageSquare className="h-10 w-10 text-primary" />,
    title: 'AI-Powered Blog Generation',
    description: 'Go from a simple prompt or news article to a full-fledged blog post in seconds. Our AI understands context and crafts engaging content.',
  },
  {
    icon: <Youtube className="h-10 w-10 text-primary" />,
    title: 'YouTube Script Creator',
    description: 'Repurpose your blog content effortlessly. Generate compelling video scripts based on your articles to expand your reach on YouTube.',
  },
  {
    icon: <Edit className="h-10 w-10 text-primary" />,
    title: 'Full Content Management',
    description: 'A complete CRUD interface to manage your posts. Edit, delete, and feature articles on your landing page with a simple click.',
  },
];

function BackgroundSquares() {
    return (
        <div className="absolute inset-0 -z-10 h-full w-full">
            <div className="relative h-full w-full">
                {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white/5"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.5,
                            delay: i * 0.1,
                            ease: 'easeInOut',
                        }}
                        style={{
                            width: `${Math.floor(Math.random() * 50) + 20}px`,
                            height: `${Math.floor(Math.random() * 50) + 20}px`,
                            top: `${Math.floor(Math.random() * 90)}%`,
                            left: `${Math.floor(Math.random() * 90)}%`,
                            borderRadius: '8px',
                        }}
                    />
                ))}
            </div>
        </div>
    );
}


function AnimatedHeroSection() {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative w-full py-20 md:py-32 lg:py-40 bg-secondary/50 overflow-hidden"
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(200, 200, 220, 0.15), transparent 40%)`,
        transition: 'background 0.2s ease-out'
      }}
    >
      <BackgroundSquares />
      <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
            AI-Powered Content Creation, Simplified.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            Welcome to JBat. Your intelligent partner for creating compelling blog content and YouTube scripts effortlessly.
          </p>
        </div>
      </div>
    </section>
  );
}


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <AnimatedHeroSection />

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Everything You Need to Scale Your Content</h2>
              <p className="mt-4 text-muted-foreground">
                From ideation to publication, JBat provides the tools to streamline your entire content workflow.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="flex flex-col items-center text-center p-6 paper-shadow">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground flex-grow">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="w-full py-20 md:py-24 lg:py-32 bg-secondary/50">
            <div className="container mx-auto px-4 md:px-6">
                 <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Get Started in 3 Easy Steps</h2>
                    <p className="mt-4 text-muted-foreground">
                        Creating content has never been this simple.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">1</div>
                        <h3 className="text-xl font-semibold mb-2">Provide a Prompt</h3>
                        <p className="text-muted-foreground">Start with a news article URL or your own creative idea.</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">2</div>
                        <h3 className="text-xl font-semibold mb-2">Generate Content</h3>
                        <p className="text-muted-foreground">Let our AI generate a high-quality draft for your blog or video.</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">3</div>
                        <h3 className="text-xl font-semibold mb-2">Edit & Publish</h3>
                        <p className="text-muted-foreground">Use our rich editor to finalize and publish your masterpiece.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Final CTA Section */}
        <section className="w-full py-20 md:py-24">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Revolutionize Your Content?</h2>
              <p className="mt-4 text-muted-foreground">
                Click the button below to log in and start generating amazing content with the power of AI.
              </p>
              <div className="mt-8">
                <Button asChild size="lg" variant="default">
                  <Link href="/admin/dashboard">
                    Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
