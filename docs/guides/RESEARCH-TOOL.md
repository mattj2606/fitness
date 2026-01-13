# YouTube Research Tool

## Purpose
Extract transcripts and insights from YouTube videos to inform project development decisions.

## Usage

### Basic Transcript Extraction
```bash
npm run research "https://www.youtube.com/watch?v=VIDEO_ID"
```

### With AI Summary (Requires API Key)
```bash
npm run research "https://www.youtube.com/watch?v=VIDEO_ID" --summarize
```

## Setup

### 1. Install Dependencies
Already installed:
- `youtube-transcript` - Fetches video transcripts
- `tsx` - TypeScript execution

### 2. Enable AI Summaries (Optional)
Add to your `.env` file:
```
GEMINI_API_KEY=your_api_key_here
```

Get a free API key: https://aistudio.google.com/apikey

## Output
Transcripts are saved to `docs/research/yt-[video-id]-[date].md`

Example output structure:
```markdown
# YouTube Research: dQw4w9WgXcQ
**URL**: https://www.youtube.com/watch?v=dQw4w9WgXcQ
**Date**: 2026-01-13

## AI Summary
[Generated summary if --summarize flag used]

## Full Transcript
[Complete video transcript]
```

## Use Cases
- Research fitness app features from competitor demos
- Extract workout routines from tutorial videos
- Analyze product reviews for feature ideas
- Document technical talks for implementation reference

## Batch Processing

### Design Tutorial Library
Process multiple videos at once:
```bash
npm run research:design
```

This runs a pre-configured batch of 9 design tutorial videos covering:
- Website design principles
- CSS tips and tricks  
- UI improvement techniques
- Typography fundamentals
- Color selection
- Responsive design
- Web animations

Output: `docs/research/design/` with an auto-generated INDEX.md

