import Groq from "groq-sdk";
import puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import dotenv from "dotenv";
import { existsSync } from "fs";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const LOCAL_CHROME_CANDIDATES = [
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
];

function resolveLocalChromePath() {
  if (process.env.CHROME_PATH) {
    return process.env.CHROME_PATH;
  }

  return LOCAL_CHROME_CANDIDATES.find((candidate) => existsSync(candidate));
}

const INTERVIEW_REPORT_SCHEMA = {
  type: "object",
  properties: {
    matchScore: {
      type: "number",
      description:
        "A score between 0 and 100 indicating how well the candidate's profile matches the job description",
    },
    technicalQuestions: {
      type: "array",
      description: "Technical questions with intention and answers",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "The technical question asked in the interview",
          },
          intention: {
            type: "string",
            description: "Why the interviewer asks this question",
          },
          answer: {
            type: "string",
            description: "How to answer this question",
          },
        },
        required: ["question", "intention", "answer"],
        additionalProperties: false,
      },
    },
    behavioralQuestions: {
      type: "array",
      description: "Behavioral questions with intention and answers",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "The behavioral question asked in the interview",
          },
          intention: {
            type: "string",
            description: "Why the interviewer asks this question",
          },
          answer: {
            type: "string",
            description: "How to answer this question",
          },
        },
        required: ["question", "intention", "answer"],
        additionalProperties: false,
      },
    },
    skillGaps: {
      type: "array",
      description: "List of missing skills and their severity",
      items: {
        type: "object",
        properties: {
          skill: {
            type: "string",
            description: "Missing skill",
          },
          severity: {
            type: "string",
            enum: ["low", "medium", "high"],
            description: "Importance of the skill gap",
          },
        },
        required: ["skill", "severity"],
        additionalProperties: false,
      },
    },
    preparationPlan: {
      type: "array",
      description: "Day-wise preparation plan",
      items: {
        type: "object",
        properties: {
          day: {
            type: "number",
            description: "Day number starting from 1",
          },
          focus: {
            type: "string",
            description: "Main focus for the day",
          },
          tasks: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Tasks to complete",
          },
        },
        required: ["day", "focus", "tasks"],
        additionalProperties: false,
      },
    },
    title: {
      type: "string",
      description: "Job title for which the interview report is generated",
    },
  },
  required: [
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan",
    "title",
  ],
  additionalProperties: false,
};

function safeParseModelJSON(content) {
  if (!content) {
    return null;
  }

  if (typeof content === "object") {
    return content;
  }

  const cleaned = String(content).replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      return null;
    }
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

export async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `Generate an interview report for a candidate.

Candidate details:
- Resume: ${resume}
- Self Description: ${selfDescription}
- Job Description: ${jobDescription}

Return valid JSON only that follows this schema exactly:
${JSON.stringify(INTERVIEW_REPORT_SCHEMA)}`;

  const completion = await groq.chat.completions.create({
    model: process.env.GROQ_REPORT_MODEL || "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content:
          "You generate strict JSON interview reports. Do not include markdown or explanation.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const parsedContent = safeParseModelJSON(
    completion.choices?.[0]?.message?.content,
  );

  if (!parsedContent) {
    throw new Error("Invalid response format for interview report.");
  }

  // Map AI fields → schema fields
  const mapped = {
    matchScore: parsedContent.matchScore,
    techniQuestion: parsedContent.technicalQuestions,
    behavQuestion: parsedContent.behavioralQuestions,
    skillGaps: parsedContent.skillGaps,
    preparationPlan: parsedContent.preparationPlan,
    title: parsedContent.title,
  };

  console.log("AI mapped data:", mapped);
  return mapped;
}

async function launchBrowser() {
  const isRender = Boolean(process.env.RENDER);
  const commonArgs = [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
  ];

  if (isRender) {
    return await puppeteerCore.launch({
      executablePath: await chromium.executablePath(),
      args: [...chromium.args, ...commonArgs],
      headless: true,
    });
  }

  const localExecutablePath = resolveLocalChromePath();

  if (localExecutablePath) {
    return await puppeteerCore.launch({
      executablePath: localExecutablePath,
      args: commonArgs,
      headless: "new",
    });
  }

  try {
    return await puppeteer.launch({
      headless: "new",
      args: commonArgs,
    });
  } catch {
    throw new Error(
      "No local Chrome/Chromium found. Set CHROME_PATH in backend/.env or install chromium-browser/google-chrome-stable.",
    );
  }
}

async function generatePDFFromHTML(htmlContent) {
  let browser;

  try {
    browser = await launchBrowser();
    const page = await browser.newPage();

    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    await page.emulateMediaType("screen");

    return await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "15mm",
        right: "15mm",
      },
    });
  } finally {
    if (browser) await browser.close();
  }
}

async function generateHTMLFromAI(prompt) {
  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "user",
          content:
            prompt +
            "\n\nReturn ONLY clean HTML. No markdown. No explanation.",
        },
      ],
      temperature: 0.7,
    });

    let html = completion.choices?.[0]?.message?.content;

    if (!html) {
      throw new Error("No HTML returned");
    }

    // remove ```html ``` if model adds it
    html = html.replace(/```html|```/g, "").trim();

    return html;
  } catch (err) {
    console.error("GROQ ERROR:", err);
    throw new Error("AI failed");
  }
}

export async function generateInterviewReportPDF({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
Create a professional resume using:

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

- Clean layout
- Sections: Summary, Skills, Experience, Education
- Minimal styling
`;

  try {
    const html = await generateHTMLFromAI(prompt);
    return await generatePDFFromHTML(html);
  } catch (err) {
    console.error("FINAL ERROR:", err);
    throw err;
  }
}