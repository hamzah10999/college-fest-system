"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Share2, CheckCircle, XCircle, Users } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Student {
  id: string
  name: string
  email: string
  phone: string
  college: string
  role: string
  registeredAt: string
  validated: boolean
}

const roleBadge: Record<string, string> = {
  participant: "bg-indigo-50 text-indigo-700 border-indigo-200",
  volunteer: "bg-emerald-50 text-emerald-700 border-emerald-200",
  organizer: "bg-violet-50 text-violet-700 border-violet-200",
  judge: "bg-amber-50 text-amber-700 border-amber-200",
  sponsor: "bg-rose-50 text-rose-700 border-rose-200",
}

export default function StudentDetailPage({ params }: { params: { id: string } }) {
  const [student, setStudent] = useState<Student | null>(null)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchStudent()
  }, [params.id])

  const fetchStudent = async () => {
    try {
      const response = await fetch(`/api/students/${params.id}`)
      const data = await response.json()
      if (response.ok) setStudent(data.student)
      else setStudent(null)
    } catch (error) {
      console.error("Error fetching student:", error)
      setStudent(null)
    }
  }

  useEffect(() => {
    if (student && canvasRef.current) generateQRCode()
  }, [student])

  const generateQRCode = () => {
    if (!student || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 300
    canvas.height = 300
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, 300, 300)

    const qrData = JSON.stringify({ id: student.id, name: student.name, role: student.role, college: student.college })
    const hash = qrData.split("").reduce((a, b) => { a = (a << 5) - a + b.charCodeAt(0); return a & a }, 0)

    ctx.fillStyle = "#312e81" // indigo-900
    const cellSize = 10
    const gridSize = 25

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const cellHash = (hash + i * gridSize + j) % 100
        if (cellHash > 50) {
          ctx.fillRect(25 + i * cellSize, 25 + j * cellSize, cellSize - 1, cellSize - 1)
        }
      }
    }

    const drawCornerMarker = (x: number, y: number) => {
      ctx.fillStyle = "#312e81"
      ctx.fillRect(x, y, 70, 70)
      ctx.fillStyle = "white"
      ctx.fillRect(x + 10, y + 10, 50, 50)
      ctx.fillStyle = "#312e81"
      ctx.fillRect(x + 20, y + 20, 30, 30)
    }

    drawCornerMarker(25, 25)
    drawCornerMarker(205, 25)
    drawCornerMarker(25, 205)

    const dataUrl = canvas.toDataURL("image/png")
    setQrCodeDataUrl(dataUrl)
  }

  const downloadQRCode = () => {
    if (!qrCodeDataUrl || !student) return
    const link = document.createElement("a")
    link.download = `${student.name}-QRCode.png`
    link.href = qrCodeDataUrl
    link.click()
    toast({ title: "QR Code Downloaded", description: "Saved to your device" })
  }

  const shareQRCode = async () => {
    if (!qrCodeDataUrl || !student) return
    try {
      const response = await fetch(qrCodeDataUrl)
      const blob = await response.blob()
      const file = new File([blob], `${student.name}-QRCode.png`, { type: "image/png" })
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${student.name} — FestPass QR Code`,
          text: `QR Code for ${student.name} (${student.id})`,
          files: [file],
        })
      } else {
        await navigator.clipboard.writeText(`Student ID: ${student.id}\nName: ${student.name}\nRole: ${student.role}`)
        toast({ title: "Copied to clipboard", description: "Student details copied" })
      }
    } catch {
      toast({ title: "Share failed", description: "Unable to share QR code", variant: "destructive" })
    }
  }

  if (!student) {
    return (
      <div className="page-bg">
        <div className="container mx-auto max-w-lg px-4 py-16">
          <Card className="text-center py-16">
            <CardContent>
              <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">Student not found</p>
              <Link href="/students">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Back to Students</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="page-bg">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Student Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="text-xl">{student.name}</CardTitle>
                  <CardDescription className="font-mono text-sm mt-1">{student.id}</CardDescription>
                </div>
                {student.validated ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1 shrink-0">
                    <CheckCircle className="h-3.5 w-3.5" /> Validated
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-2.5 py-1 shrink-0">
                    <XCircle className="h-3.5 w-3.5" /> Pending
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <Badge variant="outline" className={roleBadge[student.role] || ""}>
                {student.role.charAt(0).toUpperCase() + student.role.slice(1)}
              </Badge>

              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                {[
                  { label: "College", value: student.college },
                  { label: "Email", value: student.email },
                  { label: "Phone", value: student.phone },
                  { label: "Registered", value: new Date(student.registeredAt).toLocaleDateString() },
                ].map((field) => (
                  <div key={field.label}>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">{field.label}</p>
                    <p className="text-gray-900 break-all">{field.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">QR Code</CardTitle>
              <CardDescription>Show this at the fest gate for validation</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-5">
              <div className="inline-block rounded-xl border bg-white p-4 shadow-sm">
                <canvas ref={canvasRef} className="rounded" style={{ maxWidth: "100%", height: "auto" }} />
              </div>

              <div className="flex gap-2.5 justify-center">
                <Button variant="outline" onClick={downloadQRCode} size="sm">
                  <Download className="h-4 w-4 mr-1.5" /> Download
                </Button>
                <Button variant="outline" onClick={shareQRCode} size="sm">
                  <Share2 className="h-4 w-4 mr-1.5" /> Share
                </Button>
              </div>

              <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 text-left space-y-0.5">
                <p className="font-medium text-gray-600 mb-1">QR Code contains:</p>
                <p>Student ID: {student.id}</p>
                <p>Name: {student.name}</p>
                <p>Role: {student.role}</p>
                <p>College: {student.college}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
