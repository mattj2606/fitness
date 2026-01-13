#!/usr/bin/env tsx
import { YoutubeTranscript } from 'youtube-transcript';
import * as fs from 'fs';
import * as path from 'path';

const videos = [
    { url: 'https://www.youtube.com/watch?v=qyomWr_C_jA', title: 'Design Top Tier Websites' },
    { url: 'https://www.youtube.com/watch?v=xyA-1YBXNB4', title: 'Design & CSS Tips' },
    { url: 'https://www.youtube.com/watch?v=wcZ6jSlZqDc', title: 'Fix Boring UIs' },
    { url: 'https://www.youtube.com/watch?v=9-oefwZ6Z74', title: 'UI Typography' },
    { url: 'https://www.youtube.com/watch?v=vvPklRN0Tco', title: 'Pick UI Colors' },
    { url: 'https://www.youtube.com/watch?v=AmY3db_Qs94', title: '23 Website Hacks' },
    { url: 'https://www.youtube.com/watch?v=l04dDYW-QaI', title: 'Responsive Websites' },
    { url: 'https://www.youtube.com/watch?v=PgxT1wItu8M', title: 'Learn New Skills' },
    { url: 'https://www.youtube.com/watch?v=hZh-CiPt91w', title: 'Web Animations' },
];

async function summarizeWithAI(transcript: string, title: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.warn('⚠️  GEMINI_API_KEY not set. Skipping AI summary.');
        return '';
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Extract actionable design principles from this "${title}" tutorial transcript.

Format as:
## Key Principles
- [Principle 1]
- [Principle 2]

## Actionable Tips
- [Tip 1]
- [Tip 2]

## Fitness App Application
- How to apply these concepts to a fitness tracking app

Transcript:
${transcript.slice(0, 25000)}`
                        }]
                    }]
                })
            }
        );

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
        console.error(`AI error for "${title}":`, error);
        return '';
    }
}

async function processVideo(video: typeof videos[0], index: number) {
    try {
        console.log(`\n[${index + 1}/${videos.length}] Processing: ${video.title}...`);

        const transcriptItems = await YoutubeTranscript.fetchTranscript(video.url);
        const fullText = transcriptItems.map((item: { text: string }) => item.text).join(' ');

        const summary = await summarizeWithAI(fullText, video.title);

        const videoId = video.url.split('v=')[1]?.split('&')[0] || 'video';
        const outDir = path.join(process.cwd(), 'docs', 'research', 'design');

        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }

        const fileName = `${index + 1}-${videoId}.md`;
        const filePath = path.join(outDir, fileName);

        const content = `# ${video.title}
**URL**: ${video.url}
**Video ID**: ${videoId}

${summary ? `${summary}\n\n---\n\n` : ''}## Full Transcript
${fullText}
`;

        fs.writeFileSync(filePath, content);
        console.log(`✅ Saved: ${fileName}`);

        return { title: video.title, summary, videoId };
    } catch (error) {
        console.error(`❌ Failed: ${video.title}`, error);
        return null;
    }
}

async function run() {
    console.log('🎨 Starting Design Research Batch Process...\n');

    const results = [];
    for (let i = 0; i < videos.length; i++) {
        const result = await processVideo(videos[i], i);
        if (result) results.push(result);

        // Rate limiting
        if (i < videos.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    // Create index
    const indexPath = path.join(process.cwd(), 'docs', 'research', 'design', 'INDEX.md');
    const indexContent = `# Design Research Library
**Generated**: ${new Date().toISOString().split('T')[0]}
**Videos Processed**: ${results.length}/${videos.length}

## Videos
${results.map((r, i) => `${i + 1}. [${r.title}](${i + 1}-${r.videoId}.md)`).join('\n')}

## Quick Reference
Review individual files for detailed insights. Each contains:
- AI-extracted principles
- Actionable tips
- Fitness app application notes
- Full transcript
`;

    fs.writeFileSync(indexPath, indexContent);

    console.log(`\n✅ Complete! Processed ${results.length} videos.`);
    console.log(`📁 Location: docs/research/design/`);
    console.log(`📋 Index: docs/research/design/INDEX.md`);
}

run();
