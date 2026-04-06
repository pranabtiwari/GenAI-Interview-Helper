import { OpenRouter } from "@openrouter/sdk";
import puppeteer from "puppeteer-core";

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTE_API_KEY,
});

export async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`;

  const response = await openrouter.chat.send({
    chatGenerationParams: {
      model: "nvidia/nemotron-3-super-120b-a12b:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      responseFormat: {
        type: "json_schema",
        jsonSchema: {
          name: "interview_report",
          strict: true,
          schema: {
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
                      description:
                        "The technical question asked in the interview",
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
                      description:
                        "The behavioral question asked in the interview",
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
                description:
                  "Job title for which the interview report is generated",
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
          },
        },
      },
    },
  });

  const content = response.choices[0].message.content;

  // Handle both "array of parts" and "string" cases
  const jsonText = Array.isArray(content) ? content[0].text : content;
  const aiData = JSON.parse(jsonText);

  // Map AI fields → schema fields
  const mapped = {
    matchScore: aiData.matchScore,
    techniQuestion: aiData.technicalQuestions,
    behavQuestion: aiData.behavioralQuestions,
    skillGaps: aiData.skillGaps,
    preparationPlan: aiData.preparationPlan,
    title: aiData.title,
  };

  console.log("AI mapped data:", mapped);
  return mapped;
}

async function generatePDFFromHTML(htmlContent) {
    let browser;

    try {
      browser = await puppeteer.launch({
        executablePath: "/usr/bin/chromium-browser", // Adjust this path if necessary
      });
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
          top: "20mm",
          bottom: "20mm",
          left: "15mm",
          right: "15mm",
        },
      });

      return pdfBuffer;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
}

export async function generateInterviewReportPDF({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `Generate a resume for a candidate with the following details:
                          Resume: ${resume}
                          Self Description: ${selfDescription}
                          Job Description: ${jobDescription}

                          The response must be a JSON object with a single field "html" which contains the full HTML content of the resume. The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                          The content of the resume should not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                          You can highlight the content using some colors or different font styles but the overall design should be simple and professional.`;

  const response = await openrouter.chat.send({
    chatGenerationParams: {
      model: "nvidia/nemotron-3-super-120b-a12b:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      responseFormat: {
        type: "json_schema",
        jsonSchema: {
          name: "resume_html",
          strict: true,
          schema: {
            type: "object",
            properties: {
              html: {
                type: "string",
                description: "The HTML content of the generated resume",
              },
            },
            required: ["html"],
            additionalProperties: false,
          },
        },
      },
    },
  });

  const content = response.choices[0].message.content;

  // Handle both "array of parts" and "string/object" cases
  let parsedContent;
  if (Array.isArray(content)) {
    const jsonText = content[0]?.text ?? "";
    parsedContent = jsonText ? JSON.parse(jsonText) : null;
  } else if (typeof content === "string") {
    parsedContent = JSON.parse(content);
  } else {
    parsedContent = content;
  }

  if (!parsedContent || typeof parsedContent.html !== "string") {
    throw new Error(
      "Invalid response format: expected a JSON object with a string 'html' field.",
    );
  }

  // Convert HTML to PDF buffer
  const pdfBuffer = await generatePDFFromHTML(parsedContent.html);
  return pdfBuffer;
}
