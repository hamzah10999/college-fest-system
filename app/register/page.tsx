"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Users } from "lucide-react"
import Link from "next/link"

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

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    role: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registeredStudent, setRegisteredStudent] = useState<Student | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.name || !formData.email || !formData.phone || !formData.college || !formData.role) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      setRegisteredStudent(data.student)

      toast({
        title: "Registration Successful!",
        description: `Your unique ID is: ${data.student.id}`,
      })

      setFormData({ name: "", email: "", phone: "", college: "", role: "" })
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (registeredStudent) {
    return (
      <div className="page-bg">
        <div className="container mx-auto max-w-lg px-4 py-16">
          <Card className="text-center border-emerald-200 bg-emerald-50/30">
            <CardHeader className="pb-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl text-emerald-700">You&apos;re registered!</CardTitle>
              <CardDescription>Save your unique token — you&apos;ll need it at the gate.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-xl bg-white border border-emerald-200 p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Your Fest ID</p>
                <p className="text-2xl font-mono font-bold text-gray-900">{registeredStudent.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left text-sm">
                <div>
                  <p className="text-gray-400 mb-0.5">Name</p>
                  <p className="font-medium text-gray-900">{registeredStudent.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-0.5">Role</p>
                  <p className="font-medium text-gray-900 capitalize">{registeredStudent.role}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-0.5">College</p>
                  <p className="font-medium text-gray-900">{registeredStudent.college}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-0.5">Email</p>
                  <p className="font-medium text-gray-900 break-all">{registeredStudent.email}</p>
                </div>
              </div>

              <div className="flex gap-3 justify-center pt-2">
                <Link href={`/students/${registeredStudent.id}`}>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">View QR Code</Button>
                </Link>
                <Button variant="outline" onClick={() => setRegisteredStudent(null)}>
                  Register Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="page-bg">
      <div className="container mx-auto max-w-lg px-4 py-16">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 mb-4">
            <Users className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Student Registration</h1>
          <p className="text-gray-500">Fill in your details to get your unique fest token and QR code.</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@college.edu"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="college">College Name</Label>
                  <Input
                    id="college"
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    placeholder="Your college"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="role">Role in Fest</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="participant">Participant</SelectItem>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                    <SelectItem value="organizer">Organizer</SelectItem>
                    <SelectItem value="judge">Judge</SelectItem>
                    <SelectItem value="sponsor">Sponsor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
