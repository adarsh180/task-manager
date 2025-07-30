'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { 
  CheckCircle, 
  Brain, 
  Timer, 
  BookOpen, 
  Target, 
  TrendingUp,
  Users,
  Star,
  ArrowRight,
  Play,
  User
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { AnimatedLogo } from '@/components/animated-logo'

export function LandingPage() {
  const router = useRouter()

  const features = [
    {
      icon: Brain,
      title: 'AI Study Assistant',
      description: 'Get personalized help for UPSC, NEET, JEE, and more with our intelligent chatbot'
    },
    {
      icon: Timer,
      title: 'Pomodoro Timer',
      description: 'Boost productivity with customizable focus sessions and break reminders'
    },
    {
      icon: CheckCircle,
      title: 'Task Management',
      description: 'Organize your study schedule with priority-based task tracking'
    },
    {
      icon: BookOpen,
      title: 'Smart Notes',
      description: 'Create and organize study notes with real-time synchronization'
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description: 'Track your study progress with detailed charts and insights'
    },
    {
      icon: Target,
      title: 'Goal Setting',
      description: 'Set and achieve your study goals with milestone tracking'
    }
  ]

  const exams = [
    'UPSC', 'NEET UG', 'IIT JEE', 'CSIR UGC-NET', 'NEET PG', 'Coding', 'DSA', 'AI/ML'
  ]

  const testimonials = [
    {
      name: 'Priya Sharma',
      exam: 'UPSC Aspirant',
      text: 'TaskTracker helped me organize my UPSC preparation efficiently. The AI assistant is incredibly helpful!',
      rating: 5
    },
    {
      name: 'Rahul Kumar',
      exam: 'JEE Student',
      text: 'The Pomodoro timer and task management features boosted my productivity significantly.',
      rating: 5
    },
    {
      name: 'Anita Patel',
      exam: 'NEET Candidate',
      text: 'Perfect tool for medical entrance preparation. Love the progress tracking feature!',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <AnimatedLogo size="md" showText={true} />
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="ghost" onClick={() => router.push('/auth/login')}>
                Sign In
              </Button>
              <Button onClick={() => router.push('/auth/register')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="flex justify-center mb-8">
              <AnimatedLogo size="xl" showText={false} />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-slide-up">
              Master Your Studies with
              <span className="text-gradient block animate-bounce-in">AI-Powered Assistance</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed animate-slide-up">
              The ultimate study companion for competitive exam preparation. Organize tasks, track progress, 
              and get personalized AI help for UPSC, NEET, JEE, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
              <Button size="lg" className="text-lg px-8 py-6 hover:scale-105 transition-transform" onClick={() => router.push('/auth/register')}>
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 hover:scale-105 transition-transform">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Exams */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 animate-fade-in">Designed for Every Competitive Exam</h2>
          <p className="text-muted-foreground mb-8 animate-slide-up">Specialized AI assistance for all major competitive examinations</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {exams.map((exam, index) => (
              <div 
                key={index} 
                className="bg-background rounded-lg p-4 shadow-sm border card-hover animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="font-semibold text-primary">{exam}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">How TaskTracker Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up">
              Simple steps to transform your study routine and achieve your goals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Sign Up & Choose Your Exam',
                description: 'Create your account and select your target examination. Our AI will customize the experience for your specific needs.',
                icon: Target
              },
              {
                step: '02', 
                title: 'Plan & Organize',
                description: 'Create study tasks, set goals, and organize your notes. Use our Pomodoro timer to maintain focus and productivity.',
                icon: CheckCircle
              },
              {
                step: '03',
                title: 'Learn & Improve',
                description: 'Get personalized AI assistance, track your progress, and continuously improve your study strategy.',
                icon: TrendingUp
              }
            ].map((item, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to enhance your study experience and boost your exam performance.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-colors hover:bg-primary/20">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-90"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 animate-fade-in">Trusted by Thousands</h2>
            <p className="text-primary-foreground/80 animate-slide-up">Join our growing community of successful students</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10,000+', label: 'Active Students', icon: Users },
              { number: '95%', label: 'Success Rate', icon: Target },
              { number: '50+', label: 'Exam Categories', icon: BookOpen },
              { number: '24/7', label: 'AI Support', icon: Brain }
            ].map((stat, index) => (
              <div key={index} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">AI-Powered Study Assistant</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Get instant, personalized help tailored to your specific exam requirements. Our AI understands the nuances of different competitive exams.
              </p>
              <div className="space-y-4">
                {[
                  'Exam-specific question answering',
                  'Concept explanations with examples', 
                  'Practice problem generation',
                  'Study strategy recommendations'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="animate-scale-in">
              <div className="bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-2xl p-8 border">
                <div className="bg-background rounded-lg p-6 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <Brain className="h-6 w-6 text-primary" />
                    <span className="font-semibold">AI Assistant</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="bg-muted p-3 rounded">
                      <strong>You:</strong> Explain photosynthesis for NEET
                    </div>
                    <div className="bg-primary/10 p-3 rounded">
                      <strong>AI:</strong> Photosynthesis is the process by which plants convert light energy into chemical energy...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">What Students Say</h2>
            <p className="text-xl text-muted-foreground animate-slide-up">Join thousands of successful students</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-hover animate-scale-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.exam}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground animate-slide-up">Everything you need to know about TaskTracker</p>
          </div>
          <div className="space-y-6">
            {[
              {
                question: 'Is TaskTracker really free to use?',
                answer: 'Yes! TaskTracker offers a comprehensive free plan with all core features including AI assistance, task management, and progress tracking.'
              },
              {
                question: 'Which exams does the AI support?',
                answer: 'Our AI is trained for UPSC, NEET UG/PG, IIT JEE, CSIR UGC-NET, coding interviews, DSA, and AI/ML topics with specialized knowledge for each domain.'
              },
              {
                question: 'Can I use TaskTracker offline?',
                answer: 'While core features work offline, AI assistance and real-time sync require an internet connection for the best experience.'
              },
              {
                question: 'How accurate is the AI assistance?',
                answer: 'Our AI is continuously updated with the latest exam patterns and syllabus changes, providing highly accurate and relevant assistance.'
              }
            ].map((faq, index) => (
              <Card key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Studies?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of students who are already achieving their goals with TaskTracker.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6" onClick={() => router.push('/auth/register')}>
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={() => router.push('/auth/login')}>
              Already have an account?
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <AnimatedLogo size="lg" showText={true} />
          </div>
          <p className="text-muted-foreground">
            © 2024 TaskTracker. All rights reserved. Empowering students to achieve their dreams.
          </p>
        </div>
      </footer>
    </div>
  )
}