// Add HF_TOKEN to .env.local and to Vercel Environment Variables
import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are Manish's portfolio assistant. You must provide crisp, neat, and highly straightforward answers. DO NOT output any cryptic fluff or long-winded paragraphs. Convey that Manish is an incredibly hardworking developer, eager to earn, learn, and deliver results. 
IMPORTANT: You MUST ONLY answer questions strictly related to Manish's portfolio, skills, experience, and professional background. If the user asks about ANYTHING else (general knowledge, coding help, recipes, etc.), you must politely refuse and redirect the conversation back to hiring or working with Manish.

Manish. Full Stack Developer. Bengaluru, India. Email: manish64raja@gmail.com. GitHub: github.com/imanishraj. LinkedIn: linkedin.com/in/manishrajakumar.
Education: B.Tech CSE, GITAM University, 2022-2025, 7.2 CGPA.
Current: Full Stack Developer at Alstonair Technologies since April 2026. Stack: React, Django, FastAPI, MySQL, PostgreSQL.
Experience: GITAM Field Assistant Sep 2025-Present (DST IoT silk cocoon farming project). Himalaya Wellness Intern Jan-Feb 2025 (geolocation QR system, .NET, SQL Server).
Projects: Personal Data Collection App (Next.js, Supabase, JWT), Smart Irrigation System (ESP32, Prophet ML), Smart Street Light (ESP8266), Financial Portfolio Tracker (Flask, SmartAPI), Music Player (React, Vite), Cocoon Shed IoT (ESP8266, DHT22, Blynk), GitPilot (GitHub tool).
Skills: Java, Python, JavaScript, React, Next.js, Django, FastAPI, Spring Boot, Flask, MySQL, PostgreSQL, Supabase, ESP32, ESP8266, Raspberry Pi, Blynk IoT.
Achievements: 2nd Runner-up SAE India REEV 2026 (Infotainment Lead), Runner-up SIH Hackathon 2023, Campus Branding Lead, Rotaract Club GITAM.`

export async function POST(req: NextRequest) {
  const { messages, pageContext } = await req.json()
  const lastMessage = messages[messages.length - 1].content

  const contextInsert = pageContext ? `\n\nCURRENT CONTEXT: The user is currently viewing the ${pageContext} path on the site. You may acknowledge this context subtly.` : ''

  try {
    // Calling Groq's OpenAI-compatible API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Fast and reliable groq model
        messages: [
          { role: "system", content: SYSTEM_PROMPT + contextInsert },
          { role: "user", content: lastMessage }
        ],
        max_tokens: 300,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API Error:", errorText);
      return NextResponse.json({ reply: 'The eye sees a glitch in the matrix right now. Try again.' })
    }

    const data = await response.json()
    const reply = data.choices && data.choices[0]?.message?.content
      ? data.choices[0].message.content.trim()
      : 'The eye sees nothing right now. Try again.'
      
    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error("Connection Error:", error.message || error);
    return NextResponse.json({ reply: 'The eye sees a glitch in the matrix right now. Try again later.' })
  }
}
