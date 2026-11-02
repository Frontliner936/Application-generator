# Charles Career Assistant — Website starter

A Next.js starter for generating tailored CVs, cover letters and application emails from a master profile and job advert.

## Features
- Editable master professional profile and job advert input.
- Recipient address fields before cover-letter generation.
- Generates tailored CV, cover letter, email subject and short email body.
- Uses relevant experience only and instructs the model not to invent facts.
- Copy and download generated text files.
- OpenAI API key remains server-side.

## Requirements
- Node.js 18.18+ (Node 20 LTS recommended)
- OpenAI API key

## Run locally
1. Run `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Add `OPENAI_API_KEY=your_key_here` to `.env.local`.
4. Run `npm run dev` and open http://localhost:3000.

## Deploy
Import this repository into Vercel and add `OPENAI_API_KEY` under Project Settings → Environment Variables.

## Current limitations
- The master profile is held in browser state and is not persisted across devices.
- Exports are plain text, not formatted DOCX/PDF.
- Authentication, database storage and rate limiting are not included. Add these before sharing publicly.
- Review all generated materials before submitting applications.

Never commit `.env.local` or expose the API key in frontend code.