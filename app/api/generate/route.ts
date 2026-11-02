import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "The site owner must add OPENAI_API_KEY in the hosting environment." }, { status: 500 });
    }
    const body = await req.json();
    const { profile, advert, recipient, formatNotes } = body || {};
    if (!profile || !advert) {
      return NextResponse.json({ error: "Both master profile and job advert are required." }, { status: 400 });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const addressLines = [
      recipient?.recipientName,
      recipient?.department,
      recipient?.organisation,
      recipient?.physicalAddress,
      recipient?.poBox,
      recipient?.townCountry
    ].filter(Boolean).join("\n");

    const prompt = `You are a careful professional job-application assistant. Use only facts supported by the applicant's master profile. Never invent dates, credentials, duties, achievements, metrics, employer details or recipient address.

MASTER PROFILE:
${profile}

JOB ADVERT:
${advert}

FORMAT REQUIREMENTS:
${formatNotes || "Use clean, professional, ATS-friendly formatting and preserve the applicant's established CV and letter structure."}

COVER LETTER RECIPIENT ADDRESS (use only supplied lines; do not guess):
${addressLines || "[No recipient address supplied: leave a clearly marked editable recipient block or omit unknown address fields.]"}
Recipient organisation field: ${recipient?.organisation || "[not supplied]"}

Task:
1. Analyse the vacancy and select only relevant experience. Do not include all experience automatically. Prioritise the best evidence and relevant transferable skills.
2. Produce a complete tailored CV, preserving the requested CV sections and professional format.
3. Produce a complete tailored cover letter, preserving the applicant's original structure and using the recipient details exactly as supplied. If no recipient details are supplied, keep placeholders rather than inventing them.
4. Produce a concise email subject and short email body.
5. Add review notes for any missing information or claims the applicant should verify.

Return valid JSON only, with these exact keys:
{
 "cv": "string",
 "coverLetter": "string",
 "emailSubject": "string",
 "emailBody": "string",
 "notes": "string"
}`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You generate truthful, tailored job application materials. Follow the supplied format and return JSON only." },
        { role: "user", content: prompt }
      ]
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("The model returned an empty response.");
    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err?.message || "Unable to generate documents right now." }, { status: 500 });
  }
}
