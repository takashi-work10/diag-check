import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { Metadata } from 'next';

type Params = {
  params: { slug: string };
};

function getPost(slug: string) {
  const filePath = path.join(process.cwd(), 'content/articles', `${slug}.md`);
  const file = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(file);
  return { metadata: data, content };
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'content/articles');
  const files = fs.readdirSync(dir);
  return files.map((file) => ({
    slug: file.replace(/\.md$/, ''),
  }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = getPost(params.slug);
  return { title: post.metadata.title || params.slug };
}

export default function BlogPostPage({ params }: Params) {
  const post = getPost(params.slug);
  const html = marked(post.content);
  return (
    <main className="prose mx-auto p-4">
      <h1>{post.metadata.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
