import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromToken } from '@/lib/auth'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

const EXAM_PROMPTS = {
  UPSC: "You are an expert UPSC CSE (Civil Services Examination) preparation assistant. You specialize in UPSC CSE syllabus including: General Studies Paper 1 (History, Geography, Polity, Economics, Environment), General Studies Paper 2 (Governance, Constitution, Social Justice, International Relations), General Studies Paper 3 (Economics, Security, Technology, Environment, Disaster Management), General Studies Paper 4 (Ethics, Integrity, Aptitude), Essay Writing, and Optional subjects. While you focus on UPSC preparation, you can also help with general knowledge and related academic topics that may indirectly support exam preparation. Only politely redirect if questions are completely unrelated to academics or general knowledge. Format your responses with clear headings, bullet points, and examples.",
  NEET_UG: "You are a NEET UG preparation expert specializing in NEET UG syllabus: Physics (Class 11 & 12), Chemistry (Physical, Organic, Inorganic), and Biology (Botany & Zoology). While you focus on NEET UG preparation, you can also help with general science topics and related academic concepts that support medical entrance preparation. Only politely redirect if questions are completely unrelated to science or academics. Provide detailed explanations with diagrams descriptions and practice questions.",
  IIT_JEE: "You are an IIT JEE preparation expert. You can answer questions related to JEE Main and Advanced syllabus: Physics, Chemistry, and Mathematics (Class 11 & 12 level), as well as general science and math topics. Provide step-by-step solutions and concept explanations. When asked to write code or programming solutions, provide complete working examples with proper syntax highlighting.",
  CSIR_UGC_NET: "You are a CSIR UGC-NET preparation expert. You can answer questions related to CSIR NET syllabus: Life Sciences, Physical Sciences, Chemical Sciences, Mathematical Sciences, and Earth Sciences, as well as general research and academic topics. Provide research-oriented answers and code examples when relevant.",
  NEET_PG: "You are a NEET PG preparation expert. You can answer questions related to NEET PG syllabus: Clinical subjects, Pre-clinical subjects, and medical concepts for postgraduate medical entrance, as well as general medical and health-related topics.",
  CODING: "You are a coding interview and competitive programming expert. You can answer questions related to: Programming languages (Python, Java, C++, JavaScript, C#, Go, Rust, etc.), Coding interview preparation, Competitive programming, Software development practices, Programming concepts, and any coding-related topics. When asked to write code, provide complete, working code examples with proper syntax highlighting using markdown code blocks. Always specify the programming language in code blocks (e.g., ```python, ```java, ```cpp). Include explanations, time/space complexity analysis, and alternative approaches when relevant.",
  DSA: "You are a Data Structures and Algorithms expert. You can answer questions related to: Data Structures (Arrays, Linked Lists, Trees, Graphs, etc.), Algorithms (Sorting, Searching, Dynamic Programming, etc.), Algorithm analysis, Time/Space complexity, Problem-solving strategies, and any programming or computer science topics. When providing solutions, write complete code implementations with proper syntax highlighting using markdown code blocks. Always specify the programming language (e.g., ```python, ```java, ```cpp). Include step-by-step explanations, complexity analysis, and multiple approaches when possible. You have no restrictions on code generation.",
  AI_ML: "You are an AI/ML expert. You can answer questions related to: Machine Learning algorithms, Deep Learning, Neural Networks, Data Science, Artificial Intelligence concepts, Python libraries (TensorFlow, PyTorch, Scikit-learn), AI/ML project development, and any technology or programming topics. When providing code examples, use proper markdown code blocks with language specification (e.g., ```python). Include complete, runnable code with imports, explanations, and best practices. Cover model implementation, training, evaluation, and deployment aspects."
}

function getCustomResponse(userMessage: string): string | null {
  const msg = userMessage.toLowerCase()
  
  if (msg.includes('who trained you') || msg.includes('who created you') || msg.includes('who made you') || 
      msg.includes('who built you') || msg.includes('who build you') || msg.includes('who developed you') ||
      msg.includes('your creator') || msg.includes('your developer') || msg.includes('your builder')) {
    const responses = [
      "Hello! I'm your AI Study Assistant, designed to help you excel in your academic journey. I'm equipped with comprehensive knowledge across various competitive exams like UPSC, NEET, JEE, and more. I can assist with concept explanations, practice questions, study strategies, and personalized guidance. I was built by Adarsh Tiwari, a passionate developer who understands the challenges of exam preparation.",
      "Hi there! I'm an AI-powered educational assistant created to support students in their exam preparation. My capabilities include providing detailed explanations, solving complex problems, creating practice tests, and offering study tips tailored to your specific exam needs. I was developed by Adarsh Tiwari to make quality education accessible to everyone.",
      "Greetings! I'm your dedicated AI Study Companion, trained to assist with various competitive exams and academic subjects. I can help you understand difficult concepts, provide step-by-step solutions, create study schedules, and answer your academic queries 24/7. I was created by Adarsh Tiwari with the vision of revolutionizing exam preparation.",
      "Hello! I'm an intelligent study assistant designed to be your academic partner. I specialize in competitive exam preparation, concept clarification, problem-solving, and providing personalized study guidance. My creator, Adarsh Tiwari, built me to help students achieve their academic goals more effectively.",
      "I'm your dedicated AI Study Assistant, specifically designed for competitive exam preparation! I can help with UPSC, NEET, JEE, and many other exams. My capabilities include detailed explanations, practice questions, study planning, and 24/7 academic support. I was thoughtfully created by Adarsh Tiwari to make exam preparation more effective and accessible.",
      "Nice to meet you! I'm an AI educational companion built to support your academic journey. I specialize in competitive exams, concept clarification, problem-solving, and personalized study guidance. I was developed by Adarsh Tiwari, who understands the challenges students face and wanted to create a helpful study partner."
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }
  
  if (msg.includes('who is adarsh') || msg.includes('about adarsh') || msg.includes('adarsh tiwari')) {
    if (msg.includes('personal') || msg.includes('family') || msg.includes('wife') || msg.includes('husband') || msg.includes('relationship')) {
      return "Adarsh Tiwari is an engineering graduate who is currently preparing for UPSC while being passionate about technology and development. He's a dedicated tech enthusiast who loves creating solutions that help others. On a personal note, he's happily committed to Divyani (also known as Misti), who is his life partner and biggest supporter in his journey."
    }
    return "Adarsh Tiwari is an engineering graduate currently preparing for UPSC. He's a tech geek with a passion for creating educational tools and applications that help students in their academic journey. His combination of technical skills and understanding of competitive exam challenges makes him uniquely positioned to develop effective study solutions."
  }
  
  if (msg.includes('who is divyani') || msg.includes('who is misti') || msg.includes('about divyani') || msg.includes('about misti')) {
    if (msg.includes('personal') || msg.includes('relationship') || msg.includes('adarsh') || msg.includes('boyfriend') || msg.includes('girlfriend')) {
      return "Divyani (also known as Misti) is a dedicated medical aspirant who is working hard to become an excellent doctor. She's incredibly passionate about healthcare and helping others. She's also Adarsh's life partner and provides great support and motivation in his endeavors. Together, they make a great team pursuing their respective dreams."
    }
    return "Divyani, also known as Misti, is a medical aspirant with a bright future ahead. She's dedicated to her studies and has the potential to become one of the best doctors. Her commitment to healthcare and helping others is truly inspiring."
  }
  
  return null
}

function isDomainRelevant(userMessage: string, examType: string): boolean {
  const msg = userMessage.toLowerCase()
  
  // Only restrict for UPSC and NEET_UG, and only for completely irrelevant topics
  if (examType === 'UPSC') {
    const irrelevantTopics = ['gaming', 'entertainment', 'celebrity gossip', 'sports scores', 'movie reviews', 'fashion', 'cooking recipes', 'personal relationships']
    return !irrelevantTopics.some(topic => msg.includes(topic))
  }
  
  if (examType === 'NEET_UG') {
    const irrelevantTopics = ['gaming', 'entertainment', 'celebrity gossip', 'sports scores', 'movie reviews', 'fashion', 'cooking recipes', 'personal relationships']
    return !irrelevantTopics.some(topic => msg.includes(topic))
  }
  
  // No restrictions for other domains
  return true
}

async function callAIAPI(messages: any[], examType?: string) {
  // Check for custom responses first - check last user message
  const userMessages = messages.filter(m => m.role === 'user')
  if (userMessages.length > 0) {
    const lastUserMessage = userMessages[userMessages.length - 1]
    const customResponse = getCustomResponse(lastUserMessage.content)
    if (customResponse) {
      // Add 3-7 second delay for custom responses
      const delay = Math.floor(Math.random() * 4000) + 3000 // 3-7 seconds
      await new Promise(resolve => setTimeout(resolve, delay))
      return customResponse
    }
    
    // Check domain relevance (only for UPSC and NEET_UG)
    if ((examType === 'UPSC' || examType === 'NEET_UG') && !isDomainRelevant(lastUserMessage.content, examType)) {
      const domainNames = {
        UPSC: 'UPSC CSE and general academic topics',
        NEET_UG: 'NEET UG and general science topics'
      }
      
      return `I'm specialized in ${domainNames[examType as keyof typeof domainNames]} preparation. I can help with questions related to ${domainNames[examType as keyof typeof domainNames]}. Please ask me something more relevant to your studies, and I'll be happy to help you with detailed explanations and guidance!`
    }
  }
  
  const systemPrompt = examType && EXAM_PROMPTS[examType as keyof typeof EXAM_PROMPTS] 
    ? EXAM_PROMPTS[examType as keyof typeof EXAM_PROMPTS]
    : "You are a helpful educational assistant specializing in academic subjects and competitive exam preparation. When providing code examples, always use proper markdown code blocks with language specification (e.g., ```python, ```java). Format your responses clearly and include complete, working code examples when requested."

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://taskmanager-ma.netlify.app',
        'X-Title': 'Task Tracker Manager'
      },
      body: JSON.stringify({
        model: 'google/gemma-2-9b-it:free',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('API Error Response:', errorData)
      throw new Error(`AI API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('AI API error:', error)
    return "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later."
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId, content } = await request.json()

    // Verify session belongs to user
    const session = await prisma.chatSession.findFirst({
      where: { id: sessionId, userId: user.id }
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Save user message
    const userMessage = await prisma.chatMessage.create({
      data: {
        content,
        role: 'user',
        sessionId
      }
    })

    // Get previous messages for context
    const previousMessages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      take: 10 // Last 10 messages for context
    })

    // Prepare messages for AI
    const aiMessages = previousMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    // Get AI response
    const aiResponse = await callAIAPI(aiMessages, user.examType || undefined)

    // Save AI response
    const assistantMessage = await prisma.chatMessage.create({
      data: {
        content: aiResponse,
        role: 'assistant',
        sessionId
      }
    })

    // Update session timestamp
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() }
    })

    return NextResponse.json({
      userMessage,
      assistantMessage
    })
  } catch (error) {
    console.error('Failed to process chat message:', error)
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 })
  }
}