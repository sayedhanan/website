import fs from 'fs';
import path from 'path';

const postsDir = path.join(process.cwd(), 'src', 'content', 'blog');

export const blogCategories = fs
  .readdirSync(postsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => ({
    href: `/blog/${d.name}`,
    label: d.name.charAt(0).toUpperCase() + d.name.slice(1),
  }));
