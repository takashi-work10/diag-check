import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

function getAllPosts() {
  const dir = path.join(process.cwd(), 'content/articles');
  return fs.readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const content = fs.readFileSync(path.join(dir, file), 'utf8');
      const { data } = matter(content);
      return { slug, title: data.title || slug };
    });
}

export default function BlogListPage() {
  const posts = getAllPosts();

  return (
    <main className="prose mx-auto p-4">
      <h1>ブログ一覧</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
