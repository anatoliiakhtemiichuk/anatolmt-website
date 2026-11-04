import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  content: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
}

const postsDirectory = path.join(process.cwd(), 'content/blog');

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug: data.slug || slug,
        title: data.title || '',
        description: data.description || '',
        date: data.date || '',
      };
    })
    .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));

  return posts;
}

export function getPostBySlug(slug: string): BlogPost | null {
  if (!fs.existsSync(postsDirectory)) {
    return null;
  }

  const fileNames = fs.readdirSync(postsDirectory);

  for (const fileName of fileNames) {
    if (!fileName.endsWith('.mdx')) continue;

    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const postSlug = data.slug || fileName.replace(/\.mdx$/, '');

    if (postSlug === slug) {
      return {
        slug: postSlug,
        title: data.title || '',
        description: data.description || '',
        date: data.date || '',
        content,
      };
    }
  }

  return null;
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      return data.slug || fileName.replace(/\.mdx$/, '');
    });
}
