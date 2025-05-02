import { join } from 'path';

export const NOTES_CONTENT_PATH = join(process.cwd(), 'src', 'content', 'notes');
export const NOTES_META_FILENAME = '_meta.json';
export type Slug = string[];
