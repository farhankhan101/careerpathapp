import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return Response.json({ response: text })
  } catch (error) {
    console.error("Error generating career path:", error)
    return Response.json({ error: "Failed to generate career path" }, { status: 500 })
  }
}
