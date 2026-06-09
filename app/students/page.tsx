"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, QrCode, CheckCircle, XCircle, Users } from "lucide-react"
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

const roleBadge: Record<string, string> = {
  participant: "bg-indigo-50 text-indigo-700 border-indigo-200",
  volunteer: "bg-emerald-50 text-emerald-700 border-emerald-200",
  organizer: "bg-violet-50 text-violet-700 border-violet-200",
  judge: "bg-amber-50 text-amber-700 border-amber-200",
  sponsor: "bg-rose-50 text-rose-700 border-rose-200",
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    fetchStudents()
  }, [searchTerm, roleFilter])

  const fetchStudents = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (roleFilter !== "all") params.append("role", roleFilter)

      const response = await fetch(`/api/students?${params}`)
      const data = await response.json()

      if (response.ok) {
        setStudents(data.students)
        setFilteredStudents(data.students)
      }
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  return (
    <div className="page-bg">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Registered Students</h1>
          <p className="text-gray-500">View all registered students and their QR codes</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name, ID, or college..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="participant">Participant</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
                <SelectItem value="organizer">Organizer</SelectItem>
                <SelectItem value="judge">Judge</SelectItem>
                <SelectItem value="sponsor">Sponsor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total", value: students.length, color: "text-indigo-600" },
            { label: "Validated", value: students.filter((s) => s.validated).length, color: "text-emerald-600" },
            { label: "Pending", value: students.filter((s) => !s.validated).length, color: "text-amber-600" },
            { label: "Roles", value: new Set(students.map((s) => s.role)).size, color: "text-violet-600" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-5 pb-4">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Students Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <CardTitle className="text-base truncate">{student.name}</CardTitle>
                    <CardDescription className="font-mono text-xs mt-0.5">{student.id}</CardDescription>
                  </div>
                  {student.validated ? (
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-300 shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge variant="outline" className={roleBadge[student.role] || "bg-gray-50 text-gray-700"}>
                  {student.role.charAt(0).toUpperCase() + student.role.slice(1)}
                </Badge>

                <div className="space-y-1 text-sm text-gray-600">
                  <p className="truncate">{student.college}</p>
                  <p className="truncate">{student.email}</p>
                  <p>{new Date(student.registeredAt).toLocaleDateString()}</p>
                </div>

                <Link href={`/students/${student.id}`}>
                  <Button
                    size="sm"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-1"
                  >
                    <QrCode className="h-3.5 w-3.5 mr-1.5" />
                    View QR Code
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <Card className="text-center py-16">
            <CardContent>
              <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No students found matching your criteria</p>
              <Link href="/register">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Register New Student
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
