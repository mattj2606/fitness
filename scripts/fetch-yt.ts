import { YoutubeTranscript } from 'youtube-transcript';
import * as fs from 'fs';
import * as path from 'path';

const url = process.argv[2] as string;
const shouldSummarize = process.argv.includes('--summarize');

if (!url) {
    console.error('Usage: npm run research <youtube-url> [--summarize]');
    process.exit(1);
}

async function summarizeWithAI(transcript: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.warn('⚠️  GEMINI_API_KEY not found. Skipping AI summary.');
        return '';
    }

    try {
        console.log('🤖 Generating AI summary...');

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Analyze this YouTube transcript and provide:
1. A concise summary (2-3 sentences)
2. Key takeaways (bullet points)
3. Any actionable insights for a fitness app project

Transcript:
${transcript.slice(0, 30000)}`
                        }]
                    }]
                })
            }
        );

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Summary generation failed.';
    } catch (error) {
        console.error('AI summarization error:', error);
        return '';
    }
}

async function run() {
    try {
        console.log(`Fetching transcript for: ${url}`);

        // 1. Fetch Transcript
        const transcriptItems = await YoutubeTranscript.fetchTranscript(url);
        const fullText = transcriptItems.map((item: { text: string }) => item.text).join(' ');

        // 2. AI Summary (optional)
        let aiSummary = '';
        if (shouldSummarize) {
            aiSummary = await summarizeWithAI(fullText);
        }

        // 3. Format Output
        const videoId = (url && url.split('v=')[1]?.split('&')[0]) || 'video';
        const date = new Date().toISOString().split('T')[0];
        const fileName = `yt-${videoId}-${date}.md`;
        const outDir = path.join(process.cwd(), 'docs', 'research');

        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }

        const filePath = path.join(outDir, fileName);

        const fileContent = `# YouTube Research: ${videoId}
**URL**: ${url}
**Date**: ${date}

${aiSummary ? `## AI Summary\n${aiSummary}\n\n---\n\n` : ''}## Full Transcript
${fullText}
`;

        // 4. Save
        fs.writeFileSync(filePath, fileContent);
        console.log(`✅ Success! Transcript saved to: ${filePath}`);

    } catch (error) {
        console.error('Error fetching transcript:', error);
    }
}

run();
