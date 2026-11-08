import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const rawVideos = JSON.parse(readFileSync(join(process.cwd(), 'public', 'videos.json'), 'utf8'));

// Newest first, like the rest of the site
export const videos = [...rawVideos].sort((a, b) => new Date(b.date) - new Date(a.date));
