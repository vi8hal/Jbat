import GenerateBlogForm from '@/components/forms/GenerateBlogForm';

export default function GenerateBlogPage() {
  return (
    <div className="space-y-8">
      <header className="pb-4 border-b">
        <h1 className="text-3xl font-bold tracking-tight">Generate New Blog Post</h1>
        <p className="text-muted-foreground">
          Leverage AI to craft compelling blog articles. Start by providing a news article or a custom prompt.
        </p>
      </header>
      <GenerateBlogForm />
    </div>
  );
}
