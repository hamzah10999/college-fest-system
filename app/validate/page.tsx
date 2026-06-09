"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Camera, CameraOff, CheckCircle, XCircle, Search, Shield } from "lucide-react"
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

interface ValidationResult {
  success: boolean
  student?: Student
  message: string
}

const roleBadge: Record<string, string> = {
  participant: "bg-indigo-50 text-indigo-700 border-indigo-200",
  volunteer: "bg-emerald-50 text-emerald-700 border-emerald-200",
  organizer: "bg-violet-50 text-violet-700 border-violet-200",
  judge: "bg-amber-50 text-amber-700 border-amber-200",
  sponsor: "bg-rose-50 text-rose-700 border-rose-200",
}

export default function ValidatePage() {
  const [students, setStudents] = useState<Student[]>([])
  const [manualId, setManualId] = useState("")
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [recentScans, setRecentScans] = useState<Student[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchStudents()
    fetchRecentScans()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students")
      const data = await response.json()
      if (response.ok) setStudents(data.students)
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  const fetchRecentScans = async () => {
    try {
      const response = await fetch("/api/validate/recent")
      const data = await response.json()
      if (response.ok) setRecentScans(data.recentScans.map((scan: any) => scan.student))
    } catch (error) {
      console.error("Error fetching recent scans:", error)
    }
  }

  const validateStudent = async (studentId: string) => {
    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, method: "manual" }),
      })
      const data = await response.json()
      if (response.ok) {
        fetchStudents()
        fetchRecentScans()
      }
      return data
    } catch {
      return { success: false, message: "Network error occurred" }
    }
  }

  const handleManualValidation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualId.trim()) {
      toast({ title: "Error", description: "Please enter a student ID", variant: "destructive" })
      return
    }
    validateStudent(manualId.trim()).then((result: any) => {
      setValidationResult(result)
      if (result?.success) {
        toast({ title: "Validated", description: `${result.student?.name} is checked in` })
        setManualId("")
      } else {
        toast({ title: "Failed", description: result.message, variant: "destructive" })
      }
    })
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsScanning(true)
      }
    } catch {
      toast({ title: "Camera Error", description: "Unable to access camera. Use manual entry.", variant: "destructive" })
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
  }

  const simulateQRScan = () => {
    const unvalidated = students.filter((s) => !s.validated)
    if (unvalidated.length === 0) {
      toast({ title: "All done", description: "Every student is already validated", variant: "destructive" })
      return
    }
    const random = unvalidated[Math.floor(Math.random() * unvalidated.length)]
    validateStudent(random.id).then((result: any) => {
      setValidationResult(result)
      toast({ title: "QR Scanned", description: `Validated ${result.student?.name}` })
    })
  }

  return (
    <div className="page-bg">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700 mb-4">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Entry Validation</h1>
          <p className="text-gray-500">Scan QR codes or enter student IDs to validate entries at the gate.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Methods */}
          <div className="space-y-5">
            {/* QR Scanner */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">QR Code Scanner</CardTitle>
                <CardDescription>Point your camera at a student QR code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isScanning ? (
                  <div className="text-center">
                    <div className="rounded-xl bg-gray-100 p-10 mb-4">
                      <Camera className="h-12 w-12 text-gray-300 mx-auto" />
                      <p className="text-sm text-gray-400 mt-2">Camera off</p>
                    </div>
                    <Button onClick={startCamera} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                      <Camera className="h-4 w-4 mr-1.5" /> Start Camera
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="rounded-xl bg-black p-3 mb-4">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-48 object-cover rounded-lg" />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={simulateQRScan} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
                        Simulate Scan
                      </Button>
                      <Button onClick={stopCamera} variant="outline">
                        <CameraOff className="h-4 w-4 mr-1.5" /> Stop
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manual */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Manual Entry</CardTitle>
                <CardDescription>Enter a student ID to validate</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleManualValidation} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      type="text"
                      value={manualId}
                      onChange={(e) => setManualId(e.target.value)}
                      placeholder="e.g. FEST-1234567890-123"
                      className="font-mono"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Search className="h-4 w-4 mr-1.5" /> Validate
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right: Result & Recent */}
          <div className="space-y-5">
            {validationResult && (
              <Card className={validationResult.success ? "border-emerald-200 bg-emerald-50/40" : "border-red-200 bg-red-50/40"}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    {validationResult.success ? (
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <CardTitle className={`text-base ${validationResult.success ? "text-emerald-800" : "text-red-800"}`}>
                      {validationResult.success ? "Validated" : "Failed"}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm mb-3 ${validationResult.success ? "text-emerald-700" : "text-red-700"}`}>
                    {validationResult.message}
                  </p>
                  {validationResult.student && (
                    <div className="rounded-lg bg-white border p-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{validationResult.student.name}</span>
                        <Badge variant="outline" className={roleBadge[validationResult.student.role] || ""}>
                          {validationResult.student.role.charAt(0).toUpperCase() + validationResult.student.role.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 font-mono">{validationResult.student.id}</p>
                      <p className="text-xs text-gray-500">{validationResult.student.college}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Recent Validations</CardTitle>
                <CardDescription>Last 10 check-ins</CardDescription>
              </CardHeader>
              <CardContent>
                {recentScans.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">No validations yet</p>
                ) : (
                  <div className="space-y-2">
                    {recentScans.map((student, index) => (
                      <div key={`${student.id}-${index}`} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{student.name}</p>
                          <p className="text-xs text-gray-400 font-mono">{student.id}</p>
                        </div>
                        <Badge variant="outline" className={`shrink-0 ml-2 ${roleBadge[student.role] || ""}`}>
                          {student.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
