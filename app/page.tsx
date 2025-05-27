"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, History, Plus, Sparkles, Trash2 } from "lucide-react"

interface Message {
  id: string
  type: "bot" | "user"
  content: string
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  userProfile?: UserProfile
}

interface UserProfile {
  name: string
  country: string
  religion: string
  currentRole: string
  experienceLevel: string
  skills: string
  interests: string
  careerGoals: string
  workEnvironment: string
  industry: string
}

const questions = [
  {
    key: "currentRole",
    question: "What's your current role or position? (e.g., Student, Software Developer, Marketing Manager)",
  },
  {
    key: "experienceLevel",
    question: "What's your experience level?",
    options: [
      "Entry Level (0-2 years)",
      "Junior (2-4 years)",
      "Mid-Level (4-7 years)",
      "Senior (7-10 years)",
      "Lead/Principal (10+ years)",
      "Executive/C-Level",
    ],
  },
  {
    key: "skills",
    question:
      "What are your current skills and expertise? Please list your technical skills, soft skills, and any certifications.",
  },
  {
    key: "interests",
    question: "What are your interests and passions? What topics or activities genuinely interest you?",
  },
  {
    key: "workEnvironment",
    question: "What's your preferred work environment?",
    options: [
      "Large Corporation",
      "Startup",
      "Remote Work",
      "Hybrid",
      "Freelance/Consulting",
      "Non-Profit",
      "Government",
    ],
  },
  {
    key: "industry",
    question: "Which industry interests you the most? (e.g., Technology, Healthcare, Finance, Education)",
  },
  {
    key: "careerGoals",
    question: "What are your career goals and aspirations? Where do you see yourself in 3-5 years?",
  },
]

const greetings = {
  arabic: "السلام عليكم",
  hindi: "नमस्ते",
  urdu: "آداب",
  bengali: "নমস্কার",
  chinese: "你好",
  japanese: "こんにちは",
  korean: "안녕하세요",
  spanish: "Hola",
  french: "Bonjour",
  german: "Hallo",
  italian: "Ciao",
  portuguese: "Olá",
  russian: "Привет",
  default: "Hello",
}

export default function CareerChatApp() {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [currentStep, setCurrentStep] = useState(0)
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({})
  const [showHistory, setShowHistory] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedSessions = localStorage.getItem("careerChatSessions")
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions).map((session: any) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        messages: session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }))
      setSessions(parsed)
    }
    startNewChat()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentSession?.messages])

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("careerChatSessions", JSON.stringify(sessions))
    }
  }, [sessions])

  const getGreeting = (country: string, religion: string) => {
    const countryLower = country.toLowerCase()
    const religionLower = religion.toLowerCase()

    if (religionLower.includes("islam") || religionLower.includes("muslim")) return greetings.arabic
    if (religionLower.includes("hindu") || countryLower.includes("india")) return greetings.hindi
    if (countryLower.includes("pakistan") || countryLower.includes("bangladesh")) return greetings.urdu
    if (countryLower.includes("china")) return greetings.chinese
    if (countryLower.includes("japan")) return greetings.japanese
    if (countryLower.includes("korea")) return greetings.korean
    if (countryLower.includes("spain") || countryLower.includes("mexico")) return greetings.spanish
    if (countryLower.includes("france")) return greetings.french
    if (countryLower.includes("germany")) return greetings.german
    if (countryLower.includes("italy")) return greetings.italian
    if (countryLower.includes("brazil") || countryLower.includes("portugal")) return greetings.portuguese
    if (countryLower.includes("russia")) return greetings.russian

    return greetings.default
  }

  const addMessage = (content: string, type: "bot" | "user") => {
    const message: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    }

    setCurrentSession((prev) => {
      if (!prev) return null
      const updated = { ...prev, messages: [...prev.messages, message] }
      setSessions((sessions) => sessions.map((s) => (s.id === prev.id ? updated : s)))
      return updated
    })
  }

  const typeMessage = async (content: string) => {
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))
    setIsTyping(false)
    addMessage(content, "bot")
  }

  const startNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Career Path",
      messages: [],
      createdAt: new Date(),
    }

    setCurrentSession(newSession)
    setSessions((prev) => [newSession, ...prev])
    setCurrentStep(0)
    setUserProfile({})

    setTimeout(() => {
      typeMessage(
        "🌟 Welcome to your personal Career Path Assistant! I'm here to help you discover your perfect career journey.\n\nLet's start by getting to know you better. What's your name?",
      )
    }, 500)
  }

  const deleteSession = (sessionId: string, event: React.MouseEvent) => {
    // Prevent triggering the loadSession function
    event.stopPropagation()
    
    // Remove the session from the sessions array
    const updatedSessions = sessions.filter(session => session.id !== sessionId)
    setSessions(updatedSessions)
    
    // Update localStorage
    if (updatedSessions.length > 0) {
      localStorage.setItem("careerChatSessions", JSON.stringify(updatedSessions))
    } else {
      localStorage.removeItem("careerChatSessions")
    }
    
    // If the deleted session was the current session, start a new chat
    if (currentSession?.id === sessionId) {
      startNewChat()
    }
  }

  const handleSendMessage = async () => {
    if (!currentInput.trim() || !currentSession) return

    addMessage(currentInput, "user")
    const input = currentInput.trim()
    setCurrentInput("")

    if (currentStep === 0) {
      // Name
      setUserProfile((prev) => ({ ...prev, name: input }))
      await typeMessage(`Nice to meet you, ${input}! 🎉\n\nWhich country are you from?`)
      setCurrentStep(1)
    } else if (currentStep === 1) {
      // Country
      setUserProfile((prev) => ({ ...prev, country: input }))
      await typeMessage("What's your religion or cultural background? (This helps me greet you properly)")
      setCurrentStep(2)
    } else if (currentStep === 2) {
      // Religion
      setUserProfile((prev) => ({ ...prev, religion: input }))
      const greeting = getGreeting(input, input)
      await typeMessage(
        `${greeting} ${userProfile.name}! 🙏\n\nNow let's dive into your career journey. ${questions[0].question}`,
      )
      setCurrentStep(3)
    } else if (currentStep >= 3 && currentStep < 3 + questions.length) {
      // Career questions
      const questionIndex = currentStep - 3
      const questionKey = questions[questionIndex].key as keyof UserProfile
      setUserProfile((prev) => ({ ...prev, [questionKey]: input }))

      if (questionIndex < questions.length - 1) {
        const nextQuestion = questions[questionIndex + 1]
        let questionText = nextQuestion.question
        if (nextQuestion.options) {
          questionText += "\n\nOptions:\n" + nextQuestion.options.map((opt, i) => `${i + 1}. ${opt}`).join("\n")
        }
        await typeMessage(questionText)
        setCurrentStep(currentStep + 1)
      } else {
        // Generate career path
        await typeMessage(
          "Perfect! 🎯 I have all the information I need. Let me analyze your profile and create a personalized career path for you...",
        )
        await generateCareerPath()
      }
    }
  }

  const generateCareerPath = async () => {
    try {
      const prompt = `You are a professional career counselor. Based on this profile, provide a comprehensive career path analysis. Format your response using HTML tags for proper formatting.

Person's Profile:
- Name: ${userProfile.name}
- Country: ${userProfile.country}
- Religion/Culture: ${userProfile.religion}
- Current Role: ${userProfile.currentRole}
- Experience Level: ${userProfile.experienceLevel}
- Skills: ${userProfile.skills}
- Interests: ${userProfile.interests}
- Career Goals: ${userProfile.careerGoals}
- Work Environment: ${userProfile.workEnvironment}
- Industry: ${userProfile.industry}

Provide a detailed response with:
1. <strong>Career Path Analysis</strong>
2. <strong>Recommended Next Steps</strong>
3. <strong>Skill Development Plan</strong>
4. <strong>Industry Insights</strong>
5. <strong>Alternative Career Options</strong>
6. <strong>Timeline & Milestones</strong>

Use HTML formatting: <strong>, <ul>, <li>, <p>, <em>. No markdown.`

      const result = await fetch("/api/generate-career-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      const data = await result.json()

      // Update session title
      setCurrentSession((prev) => {
        if (!prev) return null
        const updated = {
          ...prev,
          title: `${userProfile.name}'s Career Path`,
          userProfile: userProfile as UserProfile,
        }
        setSessions((sessions) => sessions.map((s) => (s.id === prev.id ? updated : s)))
        return updated
      })

      await typeMessage(`🚀 Here's your personalized career path analysis:\n\n${data.response}`)
      await typeMessage(
        "That's your complete career roadmap! 🎉 You can start a new conversation anytime to explore different paths or ask specific questions. Good luck on your journey! 💪",
      )
    } catch (error) {
      await typeMessage(
        "I apologize, but I encountered an error while generating your career path. Please try starting a new conversation.",
      )
    }
  }

  const loadSession = (session: ChatSession) => {
    setCurrentSession(session)
    setShowHistory(false)
    setCurrentStep(999) // Completed session
    setUserProfile(session.userProfile || {})
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 p-4">
      <div className="max-w-6xl  mx-auto flex gap-6 h-[calc(100vh-2rem)] ">
        {/* Sidebar */}
        <div className={`${showHistory ? "w-80" : "w-16"} transition-all duration-300 flex flex-col gap-4`}>
          <Button
            onClick={() => setShowHistory(!showHistory)}
            className="h-16 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-300 text-purple-700 shadow-lg"
            variant="outline"
          >
            <History className="h-6 w-6" />
            {showHistory && <span className="ml-2">History</span>}
          </Button>

          <Button
            onClick={startNewChat}
            className="h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg"
          >
            <Plus className="h-6 w-6" />
            {showHistory && <span className="ml-2">New Chat</span>}
          </Button>



          {showHistory && (
            <div className="flex-1 overflow-y-auto space-y-3">
              <h3 className="text-lg font-semibold text-gray-700 px-2">Previous Conversations</h3>
              {sessions.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No conversation history</p>
                </div>
              ) : (
                sessions.map((session) => (
                  <Card
                    key={session.id}
                    className="p-4 rounded-2xl cursor-pointer hover:shadow-md transition-all bg-white/60 backdrop-blur-sm border-2 border-transparent hover:border-purple-200 relative group"
                    onClick={() => loadSession(session)}
                  >
                    <div className="font-medium text-gray-800 truncate pr-8">{session.title}</div>
                    <div className="text-sm text-gray-500 mt-1">{session.createdAt.toLocaleDateString()}</div>
                    <div className="text-xs text-gray-400 mt-1">{session.messages.length} messages</div>
                    
                    {/* Delete button */}
                    <Button
                      onClick={(e) => deleteSession(session.id, e)}
                      className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      variant="ghost"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 rounded-3xl bg-white/70 backdrop-blur-sm border-2 border-purple-200 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Career Path Assistant</h1>
                  <p className="text-purple-100">Your personal AI career counselor</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 h-[500px] max-h-[500px] overflow-auto border">
              {currentSession?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.type === "bot" && (
                    <Avatar className="w-10 h-10 border-2 border-purple-200">
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[70%] rounded-3xl px-6 py-4 ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                        : "bg-white border-2 border-purple-100 text-gray-800"
                    }`}
                  >
                    {message.type === "bot" ? (
                      <div dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, "<br>") }} />
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>

                  {message.type === "user" && (
                    <Avatar className="w-10 h-10 border-2 border-blue-200">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-4 justify-start">
                  <Avatar className="w-10 h-10 border-2 border-purple-200">
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white border-2 border-purple-100 rounded-3xl px-6 py-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white/50 border-t-2 border-purple-100">
              <div className="flex gap-4">
                <Input
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 rounded-2xl border-2 border-purple-200 focus:border-purple-400 h-12 px-4"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentInput.trim() || isTyping}
                  className="h-12 w-12 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}