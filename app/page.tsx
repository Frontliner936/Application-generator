"use client";

import { useState } from "react";

const defaultProfile = `CHARLES FROLENCE TUNG’OMBE
Dar es Salaam, Tanzania | +255 638 386 459 | charlestungombe133@gmail.com

CAREER DIRECTIONS
1) Scientific/technical: Biotechnology, bioinformatics, microbiology, pharmaceutical quality control, laboratory operations and quality assurance.
2) General/digital: IT support, online services, digital marketing, website design, business support, community engagement, programme activities and event coordination.

EDUCATION
Bachelor’s Degree in Biotechnology and Bioinformatics — University of Dodoma (2022–2025)
Advanced Certificate of Secondary Education — Kisarika Secondary School (2020–2022)
Certificate of Secondary Education — Kilimani Maweni Secondary School (2016–2019)

SCIENTIFIC EXPERIENCE
Quality Control Microbiologist Trainee — Keko Pharmaceutical Industries (1997) Ltd, Dar es Salaam | July–September 2024
• Microbiological QC testing of water, raw materials and finished pharmaceutical products.
• Microbial identification, culture and biochemical analysis.
• Environmental sampling and monitoring.
• Culture media preparation and laboratory equipment maintenance.
• Cleaning/sterilization monitoring; GLP/SOP documentation.

Laboratory Microbiologist Trainee — Tanzania Veterinary Laboratory Agency (TVLA), Arusha | July–September 2023
• Sample collection, processing and preparation.
• Gram staining, biochemical tests and antimicrobial susceptibility testing (AST).
• Assisted with ELISA and rapid diagnostic testing.
• Prepared/sterilized equipment and culture media; maintained QA records.

ADDITIONAL EXPERIENCE
Programme Officer — Empower Women Development Initiative | 2026
• Supported women’s empowerment initiatives and programme activities.
• Helped organise events, including marathon activities.
Note: Confirm exact months, official organisation name and additional duties before use.

IT and Service Provider — FN Technology, Morogoro | July–December 2025
• IT and online service support.
• Supported clients with BRELA, TRA and AJIRA Portal-related online services.
Note: Do not claim services beyond those actually performed.

Online Services & Personal Digital Marketing — Self-managed | July 2025–Present
• Online services, website design, digital marketing and IT solutions.
• Manages WhatsApp groups and a channel with a reported community of 7,000+ active members.
Note: Verify how “active members” is measured before making a precise claim.

SKILLS
Pharmaceutical microbiology; QC testing; microbial identification; environmental monitoring; microbiological water testing; aseptic techniques; sterilisation; culture media; GLP/SOP compliance; laboratory documentation; laboratory safety; Gram staining; AST; ELISA support; online service support; website design; digital marketing; IT support; WhatsApp community management; event support; community programme support.

PERSONAL SKILLS
Attention to detail, problem-solving, communication, teamwork, time management, adaptability and safety consciousness.

LANGUAGES
English; Swahili.

REFEREES
Samwel Fabian Sanga — Field Technician, Sokoine University of Agriculture | P.O. Box 3000 | +255 767 522 860 | samwelsanga39@gmail.com
Alex Shayo — Lecturer, University of Dodoma | P.O. Box 259, Dodoma | +255 698 598 411 | alex.shayo@udom.ac.tz
Monica Tegete — Nurse Officer, D.R Atman Memorial Hospital | P.O. Box 351, Sumbawanga | +255 754 503 015 | tegetemonica445@gmail.com

DECLARATION
I, Charles Frolence Tung’ombe, declare that the information provided is correct.`;

export default function Home() {
  const [profile, setProfile] = useState(defaultProfile);
  const [advert, setAdvert] = useState("");
  const [advertFileName, setAdvertFileName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [department, setDepartment] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [physicalAddress, setPhysicalAddress] = useState("");
  const [poBox, setPoBox] = useState("");
  const [townCountry, setTownCountry] = useState("");
  const [formatNotes, setFormatNotes] = useState("Preserve my existing CV and cover letter format: clean professional layout, clear headings, concise bullets. CV sections: Professional Summary, Key Technical Skills, Experience and Trainings, Academic Background, Languages, Personal Skills, Referees, Declaration. Cover letter: applicant details/date, recipient address, salutation, subject/reference, tailored body, closing and name.");
  const [cvResult, setCvResult] = useState<any>(null);
  const [letterResult, setLetterResult] = useState<any>(null);
  const [cvBusy, setCvBusy] = useState(false);
  const [letterBusy, setLetterBusy] = useState(false);
  const [cvError, setCvError] = useState("");
  const [letterError, setLetterError] = useState("");
  const [uploadError, setUploadError] = useState("");

  async function handleAdvertUpload(file?: File) {
    setUploadError("");
    if (!file) return;
    const supported = /\.(txt|md|html|htm)$/i.test(file.name) || ["text/plain", "text/markdown", "text/html"].includes(file.type);
    if (!supported) {
      setUploadError("Please upload a .txt, .md or .html advert file. You can also paste the advert into the box.");
      return;
    }
    try {
      const text = await file.text();
      if (!text.trim()) throw new Error("That file appears to be empty.");
      setAdvert(text);
      setAdvertFileName(file.name);
      setCvResult(null);
      setLetterResult(null);
    } catch (e: any) {
      setUploadError(e.message || "Could not read that file.");
    }
  }

  async function generate(which: "cv" | "coverLetter") {
    const setBusy = which === "cv" ? setCvBusy : setLetterBusy;
    const setError = which === "cv" ? setCvError : setLetterError;
    const setResult = which === "cv" ? setCvResult : setLetterResult;
    setError("");
    setResult(null);
    if (!advert.trim()) { setError("Please paste or upload the job advert first."); return; }
    if (!profile.trim()) { setError("Please add your master profile first."); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: which,
          profile,
          advert,
          formatNotes,
          recipient: { recipientName, department, organisation, physicalAddress, poBox, townCountry }
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Generation failed.");
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function downloadText(filename: string, text: string) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="shell">
      <header className="hero">
        <div className="eyebrow">PERSONAL JOB APPLICATION WORKSPACE</div>
        <h1>Charles Career Assistant</h1>
        <p>Your master profile. Every vacancy. Generate each document independently.</p>
      </header>

      <section className="panel">
        <h2>1. Master professional profile</h2>
        <p className="hint">Edit this profile whenever your experience, skills or contact details change. Each generator selects only experience relevant to the advert.</p>
        <textarea className="profile" value={profile} onChange={e => setProfile(e.target.value)} />
        <label>CV and cover letter format instructions</label>
        <textarea value={formatNotes} onChange={e => setFormatNotes(e.target.value)} rows={4} />
      </section>

      <section className="panel">
        <h2>2. Job advert</h2>
        <p className="hint">Paste the full job advert, or upload it as a text, Markdown or HTML file.</p>
        <label htmlFor="advert-upload">Upload job advert (.txt, .md, .html)</label>
        <input id="advert-upload" type="file" accept=".txt,.md,.html,.htm,text/plain,text/markdown,text/html" onChange={e => handleAdvertUpload(e.target.files?.[0])} />
        {advertFileName && <p className="hint">Loaded file: {advertFileName}</p>}
        {uploadError && <div className="error">{uploadError}</div>}
        <label htmlFor="advert-text">Job advert text</label>
        <textarea id="advert-text" className="advert" placeholder="Paste job title, responsibilities, requirements and application instructions..." value={advert} onChange={e => { setAdvert(e.target.value); setAdvertFileName(""); }} />
      </section>

      <section className="panel">
        <h2>3. Cover letter recipient address</h2>
        <p className="hint">These details are used only when you generate a cover letter. Fill in what you know; the system will not invent missing recipient details.</p>
        <div className="grid">
          <div><label>Recipient name / title</label><input value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="The Human Resource Manager" /></div>
          <div><label>Department / office</label><input value={department} onChange={e => setDepartment(e.target.value)} placeholder="Human Resources Office" /></div>
          <div><label>Organisation / company</label><input value={organisation} onChange={e => setOrganisation(e.target.value)} placeholder="Employer name" /></div>
          <div><label>Physical address</label><input value={physicalAddress} onChange={e => setPhysicalAddress(e.target.value)} placeholder="Street / area" /></div>
          <div><label>P.O. Box</label><input value={poBox} onChange={e => setPoBox(e.target.value)} placeholder="P.O. Box ..." /></div>
          <div><label>Town / region / country</label><input value={townCountry} onChange={e => setTownCountry(e.target.value)} placeholder="City, Region, Tanzania" /></div>
        </div>
      </section>

      <section className="panel generatorPanel">
        <h2>4. Generate your CV</h2>
        <p className="hint">This button generates only your tailored CV. It will not generate or overwrite your cover letter.</p>
        <button className="primary" onClick={() => generate("cv")} disabled={cvBusy || letterBusy}>{cvBusy ? "Generating CV…" : "Generate CV"}</button>
        {cvError && <div className="error">{cvError}</div>}
        {cvResult && <div className="results">
          <div className="resultHead"><h3>Tailored CV</h3><button onClick={() => downloadText("Tailored_CV.txt", cvResult.cv)}>Download CV (.txt)</button></div>
          <pre>{cvResult.cv}</pre>
          {cvResult.notes && <><h3>Review notes</h3><pre>{cvResult.notes}</pre></>}
        </div>}
      </section>

      <section className="panel generatorPanel">
        <h2>5. Generate your cover letter</h2>
        <p className="hint">This button generates only your cover letter, plus a short application email subject and body.</p>
        <button className="primary" onClick={() => generate("coverLetter")} disabled={cvBusy || letterBusy}>{letterBusy ? "Generating cover letter…" : "Generate cover letter"}</button>
        {letterError && <div className="error">{letterError}</div>}
        {letterResult && <div className="results">
          <div className="resultHead"><h3>Tailored cover letter</h3><button onClick={() => downloadText("Tailored_Cover_Letter.txt", letterResult.coverLetter)}>Download cover letter (.txt)</button></div>
          <pre>{letterResult.coverLetter}</pre>
          <article><h3>Email subject</h3><p>{letterResult.emailSubject}</p><button className="small" onClick={() => navigator.clipboard.writeText(letterResult.emailSubject)}>Copy subject</button></article>
          <article><h3>Email body</h3><pre>{letterResult.emailBody}</pre><button className="small" onClick={() => navigator.clipboard.writeText(letterResult.emailBody)}>Copy email body</button><button className="small" onClick={() => downloadText("Application_Email.txt", `Subject: ${letterResult.emailSubject}\n\n${letterResult.emailBody}`)}>Download email (.txt)</button></article>
          {letterResult.notes && <article><h3>Review notes</h3><pre>{letterResult.notes}</pre></article>}
        </div>}
      </section>
      <footer>Private workspace starter • Your API key stays on the server • Verify all details before applying</footer>
    </main>
  );
}
