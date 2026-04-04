import { GoogleGenAI } from "@google/genai";
import { OpenRouter } from "@openrouter/sdk";
import puppeteer from "puppeteer"



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

async function generatePDFtoHTML(htmlContent){
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
}