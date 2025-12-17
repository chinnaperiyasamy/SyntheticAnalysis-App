import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MetricSummary, AIAnalysisResult } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeMetrics = async (summaries: MetricSummary[]): Promise<AIAnalysisResult> => {
  const ai = getClient();
  
  // Construct a prompt context
  const summaryText = summaries.map(s => 
    `Metric: ${s.metric}, Avg: ${s.avg}, Max: ${s.max}, P95: ${s.p95}, P99: ${s.p99}`
  ).join('\n');

  const prompt = `
    Analyze the following system resource utilization metrics summaries.
    Identify potential bottlenecks, resource saturation, or underutilization.
    Provide a professional summary, a list of actionable recommendations, and an overall severity rating.
    
    Metrics Data:
    ${summaryText}
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      summary: {
        type: Type.STRING,
        description: "A concise executive summary of the system health based on metrics."
      },
      recommendations: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of actionable recommendations to improve system stability or efficiency."
      },
      severity: {
        type: Type.STRING,
        enum: ["low", "medium", "high", "critical"],
        description: "Overall severity assessment of the system state."
      }
    },
    required: ["summary", "recommendations", "severity"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.3, 
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze metrics with Gemini.");
  }
};
