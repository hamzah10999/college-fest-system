import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, QrCode, Shield, BarChart3, ArrowRight, Zap, Globe, Lock } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Register",
    description: "Students sign up with their details and receive a unique fest token instantly.",
    href: "/register",
    cta: "Register Now",
    color: "bg-indigo-100 text-indigo-700",
    primary: true,
  },
  {
    icon: QrCode,
    title: "QR Codes",
    description: "Each registrant gets a unique QR code for fast, contactless entry validation.",
    href: "/students",
    cta: "View Students",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: Shield,
    title: "Validate",
    description: "Scan QR codes at the entrance or validate manually by student ID.",
    href: "/validate",
    cta: "Validate Entry",
    color: "bg-violet-100 text-violet-700",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Real-time dashboard with role breakdowns, validation rates, and college stats.",
    href: "/analytics",
    cta: "View Analytics",
    color: "bg-amber-100 text-amber-700",
  },
]

const steps = [
  {
    step: "01",
    title: "Register",
    description: "Fill out a short form with your name, college, and role in the fest.",
    color: "border-indigo-200 bg-indigo-50/50",
    accent: "text-indigo-600",
  },
  {
    step: "02",
    title: "Get your QR Code",
    description: "Receive a unique fest ID and downloadable QR code tied to your registration.",
    color: "border-emerald-200 bg-emerald-50/50",
    accent: "text-emerald-600",
  },
  {
    step: "03",
    title: "Walk in",
    description: "Show your QR code at the gate — one scan and you're validated.",
    color: "border-violet-200 bg-violet-50/50",
    accent: "text-violet-600",
  },
]

const highlights = [
  { icon: Zap, label: "Instant registration with unique ID generation" },
  { icon: Globe, label: "RESTful API with full CRUD operations" },
  { icon: Lock, label: "Server-side validation and duplicate detection" },
]

export default function HomePage() {
  return (
    <div className="page-bg">
      {/* Hero */}
      <section className="hero-gradient">
        <div className="container mx-auto px-4 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 mb-6">
            <QrCode className="h-3.5 w-3.5" />
            Automated Token System
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-5 text-balance max-w-3xl mx-auto">
            Seamless entry management for your college fest
          </h1>

          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Register students, generate QR tokens, and validate entries in real time — all from one dashboard built with the MERN stack.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 px-6 shadow-md shadow-indigo-200">
                Register for the Fest
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/analytics">
              <Button size="lg" variant="outline" className="gap-2 px-6">
                <BarChart3 className="h-4 w-4" />
                View Dashboard
              </Button>
            </Link>
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-12 text-sm text-gray-500">
            {highlights.map((h) => (
              <span key={h.label} className="inline-flex items-center gap-1.5">
                <h.icon className="h-4 w-4 text-indigo-500" />
                {h.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature) => (
            <Card key={feature.title} className="group relative overflow-hidden border hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
              <CardHeader className="pb-3">
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${feature.color} mb-3`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={feature.href}>
                  <Button
                    variant={feature.primary ? "default" : "outline"}
                    className={`w-full ${feature.primary ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-transparent"}`}
                    size="sm"
                  >
                    {feature.cta}
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-3">
            How It Works
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Three steps from registration to validated entry at the fest gate.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {steps.map((step) => (
            <div
              key={step.step}
              className={`rounded-2xl border p-6 ${step.color} transition-shadow hover:shadow-md`}
            >
              <span className={`text-xs font-bold uppercase tracking-widest ${step.accent}`}>
                Step {step.step}
              </span>
              <h3 className="text-lg font-semibold text-gray-900 mt-3 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack banner */}
      <section className="container mx-auto px-4 pb-20">
        <div className="rounded-2xl border bg-gradient-to-br from-gray-900 to-gray-800 p-8 sm:p-12 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Built with Modern Tech</h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
            Full-stack TypeScript application with server-side validation, RESTful APIs, and real-time analytics.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Next.js 14", "React 18", "TypeScript", "MongoDB", "Tailwind CSS", "shadcn/ui", "REST API"].map(
              (tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-gray-700 bg-gray-800 px-4 py-1.5 text-xs font-medium text-gray-300"
                >
                  {tech}
                </span>
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
