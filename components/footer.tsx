import { QrCode } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50/50">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <QrCode className="h-4 w-4" />
              </div>
              <span className="text-base font-semibold tracking-tight text-gray-900">
                FestPass
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Automated token generation and QR-based entry validation for college fests. Built with Next.js, MongoDB, and TypeScript.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                System
              </h4>
              <nav className="flex flex-col gap-2">
                <Link href="/register" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                  Registration
                </Link>
                <Link href="/students" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                  Students
                </Link>
                <Link href="/validate" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                  Validation
                </Link>
                <Link href="/analytics" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                  Analytics
                </Link>
              </nav>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                Stack
              </h4>
              <nav className="flex flex-col gap-2 text-sm text-gray-500">
                <span>Next.js 14</span>
                <span>MongoDB</span>
                <span>TypeScript</span>
                <span>Tailwind CSS</span>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} FestPass &middot; College Fest Token System
          </p>
          <p className="text-xs text-gray-400">
            Built with Next.js, shadcn/ui &amp; MongoDB
          </p>
        </div>
      </div>
    </footer>
  )
}
