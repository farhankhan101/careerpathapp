"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, History, Plus, Sparkles, Trash2, X, Menu } from "lucide-react"

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
  const [isMobile, setIsMobile] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const savedSessions = JSON.parse(localStorage.getItem("careerChatSessions") || "[]")
    const parsed = savedSessions.map((session: any) => ({
      ...session,
      createdAt: new Date(session.createdAt),
      messages: session.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }))
    setSessions(parsed)
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
    setShowHistory(false)

    setTimeout(() => {
      typeMessage(
        "🌟 Welcome to your personal Career Path Assistant! I'm here to help you discover your perfect career journey.\n\nLet's start by getting to know you better. What's your name?",
      )
    }, 500)
  }

  const deleteSession = (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    
    const updatedSessions = sessions.filter(session => session.id !== sessionId)
    setSessions(updatedSessions)
    
    if (updatedSessions.length > 0) {
      localStorage.setItem("careerChatSessions", JSON.stringify(updatedSessions))
    } else {
      localStorage.removeItem("careerChatSessions")
    }
    
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
      setUserProfile((prev) => ({ ...prev, name: input }))
      await typeMessage(`Nice to meet you, ${input}! 🎉\n\nWhich country are you from?`)
      setCurrentStep(1)
    } else if (currentStep === 1) {
      setUserProfile((prev) => ({ ...prev, country: input }))
      await typeMessage("What's your religion or cultural background? (This helps me greet you properly)")
      setCurrentStep(2)
    } else if (currentStep === 2) {
      setUserProfile((prev) => ({ ...prev, religion: input }))
      const greeting = getGreeting(input, input)
      await typeMessage(
        `${greeting} ${userProfile.name}! 🙏\n\nNow let's dive into your career journey. ${questions[0].question}`,
      )
      setCurrentStep(3)
    } else if (currentStep >= 3 && currentStep < 3 + questions.length) {
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
        await typeMessage(
          "Perfect! 🎯 I have all the information I need. Let me analyze your profile and create a personalized career path for you...",
        )
        await generateCareerPath()
      }
    }
  }

  const generateCareerPath = async () => {
    try {
      const mockResponse = `🚀 <strong>Career Path Analysis for ${userProfile.name}</strong>

<p>Based on your profile, here's your personalized career roadmap:</p>

<strong>🎯 Career Path Analysis</strong>
<p>Your combination of ${userProfile.skills} skills and interest in ${userProfile.industry} positions you well for growth in your field. With your ${userProfile.experienceLevel} experience level, you're at an excellent stage to expand your expertise.</p>

<strong>📈 Recommended Next Steps</strong>
<ul>
<li>Focus on developing leadership skills in your current ${userProfile.currentRole} role</li>
<li>Consider pursuing advanced certifications in ${userProfile.industry}</li>
<li>Build a strong professional network in your preferred ${userProfile.workEnvironment} environment</li>
<li>Start mentoring junior colleagues to develop your coaching abilities</li>
</ul>

<strong>🛠️ Skill Development Plan</strong>
<ul>
<li>Technical Skills: Advance your current ${userProfile.skills} expertise</li>
<li>Soft Skills: Focus on communication, leadership, and strategic thinking</li>
<li>Industry Knowledge: Stay updated with ${userProfile.industry} trends and innovations</li>
<li>Digital Literacy: Enhance your digital transformation knowledge</li>
</ul>

<strong>🌍 Industry Insights</strong>
<p>The ${userProfile.industry} sector is experiencing rapid growth, especially in areas that align with your interests in ${userProfile.interests}. Your preferred ${userProfile.workEnvironment} work style is increasingly in demand.</p>

<strong>🔄 Alternative Career Options</strong>
<ul>
<li>Consulting in your area of expertise</li>
<li>Teaching or training roles in ${userProfile.industry}</li>
<li>Product management positions</li>
<li>Entrepreneurial opportunities in your field</li>
</ul>

<strong>📅 Timeline & Milestones</strong>
<ul>
<li><em>Next 6 months:</em> Complete one major certification or course</li>
<li><em>6-12 months:</em> Take on a leadership project or role</li>
<li><em>1-2 years:</em> Transition to your target ${userProfile.careerGoals}</li>
<li><em>3-5 years:</em> Achieve your career goals and mentor others</li>
</ul>`

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

      await typeMessage(mockResponse)
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
    setCurrentStep(999)
    setUserProfile(session.userProfile || {})
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
        {/* Mobile Header */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Career Assistant</h1>
                <p className="text-xs text-purple-100">AI Career Counselor</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowHistory(!showHistory)}
                className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 p-0"
                variant="ghost"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Button
                onClick={startNewChat}
                className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 p-0"
                variant="ghost"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {showHistory && (
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setShowHistory(false)}>
            <div 
              className="absolute left-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-between">
                <h2 className="text-lg font-semibold">Chat History</h2>
                <Button
                  onClick={() => setShowHistory(false)}
                  className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 p-0"
                  variant="ghost"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-4 space-y-3">
                {sessions.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Bot className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No conversations yet</p>
                    <p className="text-sm">Start your first chat!</p>
                  </div>
                ) : (
                  sessions.map((session) => (
                    <Card
                      key={session.id}
                      className="p-4 rounded-xl cursor-pointer hover:shadow-lg transition-all bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 relative group"
                      onClick={() => loadSession(session)}
                    >
                      <div className="font-medium text-gray-800 truncate pr-8">{session.title}</div>
                      <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <span>{session.createdAt.toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{session.messages.length} messages</span>
                      </div>
                      
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
            </div>
          </div>
        )}

        {/* Mobile Chat Area */}
        <div className="flex flex-col h-[calc(100vh-80px)]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentSession?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <Avatar className="w-8 h-8 border-2 border-purple-200 flex-shrink-0">
                  <AvatarFallback className={`${
                    message.type === "bot" 
                      ? "bg-gradient-to-r from-purple-500 to-blue-500" 
                      : "bg-gradient-to-r from-blue-500 to-purple-500"
                  } text-white`}>
                    {message.type === "bot" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-tr-md"
                      : "bg-white border border-purple-100 text-gray-800 rounded-tl-md shadow-sm"
                  }`}
                >
                  {message.type === "bot" ? (
                    <div 
                      className="text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, "<br>") }} 
                    />
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 border-2 border-purple-200">
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white border border-purple-100 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Mobile Input */}
          <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-purple-100">
            <div className="flex gap-3">
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 rounded-full border-2 border-purple-200 focus:border-purple-400 h-12 px-4 text-sm"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!currentInput.trim() || isTyping}
                className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 p-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Desktop Layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto flex gap-6 h-[calc(100vh-3rem)]">
        {/* Desktop Sidebar */}
        <div className={`${showHistory ? "w-80" : "w-16"} transition-all duration-300 flex flex-col gap-4`}>
          <Button
            onClick={() => setShowHistory(!showHistory)}
            className="h-16 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-300 text-purple-700 shadow-lg hover:shadow-xl transition-all"
            variant="outline"
          >
            <History className="h-6 w-6" />
            {showHistory && <span className="ml-2 font-medium">History</span>}
          </Button>

          <Button
            onClick={startNewChat}
            className="h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="h-6 w-6" />
            {showHistory && <span className="ml-2 font-medium">New Chat</span>}
          </Button>

          {showHistory && (
            <div className="flex-1 overflow-y-auto space-y-3">
              <h3 className="text-lg font-semibold text-gray-700 px-2">Previous Conversations</h3>
              {sessions.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Bot className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium">No conversation history</p>
                  <p className="text-sm mt-1">Start your first chat to see it here</p>
                </div>
              ) : (
                sessions.map((session) => (
                  <Card
                    key={session.id}
                    className="p-4 rounded-2xl cursor-pointer hover:shadow-lg transition-all bg-white/60 backdrop-blur-sm border-2 border-transparent hover:border-purple-200 relative group"
                    onClick={() => loadSession(session)}
                  >
                    <div className="font-medium text-gray-800 truncate pr-8">{session.title}</div>
                    <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                      <span>{session.createdAt.toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{session.messages.length} messages</span>
                    </div>
                    
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

        {/* Desktop Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 rounded-3xl bg-white/70 backdrop-blur-sm border-2 border-purple-200 shadow-2xl overflow-hidden">
            {/* Desktop Header */}
            <div className="p-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Career Path Assistant</h1>
                  <p className="text-purple-100">Your personal AI career counselor</p>
                </div>
              </div>
            </div>

            {/* Desktop Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
                        : "bg-white border-2 border-purple-100 text-gray-800 shadow-sm"
                    }`}
                  >
                    {message.type === "bot" ? (
                      <div 
                        className="leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, "<br>") }} 
                      />
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
                  <div className="bg-white border-2 border-purple-100 rounded-3xl px-6 py-4 shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Desktop Input Area */}
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
                  className="h-12 w-12 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all"
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