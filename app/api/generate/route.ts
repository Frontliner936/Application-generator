import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "The site owner must add OPENAI_API_KEY in the hosting environment." }, { status: 500 });
    }
    const body = await req.json();
    const { profile, advert, recipient, formatNotes, mode } = body || {};
    if (!profile || !advert) {
      return NextResponse.json({ error: "Both master profile and job advert are required." }, { status: 400 });
    }
    if (mode !== "cv" && mode !== "coverLetter") {
      return NextResponse.json({ error: "Choose either CV or cover letter generation." }, { status: 400 });
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

    const common = `You are a careful professional job-application assistant. Use only facts supported by the applicant's master profile. Never invent dates, credentials, duties, achievements, metrics, employer details or recipient address.

MASTER PROFILE:
${profile}

JOB ADVERT:
${advert}

FORMAT REQUIREMENTS:
${formatNotes || "Use clean, professional, ATS-friendly formatting and preserve the applicant's established format."}`;

    const task = mode === "cv"
      ? `Task: Analyse the vacancy, identify its essential requirements, and select only the most relevant experience and transferable skills from the profile. Produce a complete tailored, ATS-friendly CV. Preserve the applicant's requested CV sections and format. Do not produce a cover letter or email. Add brief review notes for missing information or claims the applicant should verify.

Return valid JSON only with exactly these keys:
{ "cv": "string", "notes": "string" }`
      : `COVER LETTER RECIPIENT ADDRESS (use only supplied lines; do not guess):
${addressLines || "[No recipient address supplied: leave a clearly marked editable recipient block or omit unknown address fields.]"}
Recipient organisation field: ${recipient?.organisation || "[not supplied]"}

Task: Produce a complete tailored cover letter based on the advert and the most relevant evidence in the profile. Preserve the applicant's established letter structure. Use recipient details exactly as supplied and placeholders for unknown details. Also write a concise email subject and short email body for submitting this application. Do not produce a CV. Add brief review notes for missing information or claims the applicant should verify.

Return valid JSON only with exactly these keys:
{ "coverLetter": "string", "emailSubject": "string", "emailBody": "string", "notes": "string" }`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You generate truthful, tailored job application materials. Follow the requested output scope and return JSON only." },
        { role: "user", content: common + "\n\n" + task }
      ]
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("The model returned an empty response.");
    const parsed = JSON.parse(content);
    if (mode === "cv" && typeof parsed.cv !== "string") throw new Error("The model did not return a CV. Please try again.");
    if (mode === "coverLetter" && typeof parsed.coverLetter !== "string") throw new Error("The model did not return a cover letter. Please try again.");
    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err?.message || "Unable to generate documents right now." }, { status: 500 });
  }
}
