"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, CheckCircle, XCircle, TrendingUp, BarChart3 } from "lucide-react"

interface RoleStats {
  role: string
  total: number
  validated: number
  percentage: number
}

const roleBadge: Record<string, string> = {
  participant: "bg-indigo-50 text-indigo-700 border-indigo-200",
  volunteer: "bg-emerald-50 text-emerald-700 border-emerald-200",
  organizer: "bg-violet-50 text-violet-700 border-violet-200",
  judge: "bg-amber-50 text-amber-700 border-amber-200",
  sponsor: "bg-rose-50 text-rose-700 border-rose-200",
}

const roleBarColor: Record<string, string> = {
  participant: "bg-indigo-500",
  volunteer: "bg-emerald-500",
  organizer: "bg-violet-500",
  judge: "bg-amber-500",
  sponsor: "bg-rose-500",
}

export default function AnalyticsPage() {
  const [roleStats, setRoleStats] = useState<RoleStats[]>([])
  const [totalStudents, setTotalStudents] = useState(0)
  const [validatedStudents, setValidatedStudents] = useState(0)
  const [pendingStudents, setPendingStudents] = useState(0)
  const [validationRate, setValidationRate] = useState(0)
  const [topColleges, setTopColleges] = useState<{ college: string; count: number }[]>([])
  const [recentRegistrations, setRecentRegistrations] = useState(0)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics")
      const data = await response.json()

      if (response.ok) {
        const { analytics } = data
        setRoleStats(
          analytics.roleStats.map((stat: any) => ({
            role: stat.role,
            total: stat.total,
            validated: stat.validated,
            percentage: Math.round(stat.percentage),
          }))
        )
        setTotalStudents(analytics.totalStudents)
        setValidatedStudents(analytics.validatedStudents)
        setPendingStudents(analytics.pendingStudents)
        setValidationRate(analytics.validationRate)
        setTopColleges(analytics.topColleges)
        setRecentRegistrations(analytics.recentRegistrations)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    }
  }

  const statCards = [
    { icon: Users, label: "Total Registrations", value: totalStudents, color: "text-indigo-600", bg: "bg-indigo-100" },
    { icon: CheckCircle, label: "Validated Entries", value: validatedStudents, color: "text-emerald-600", bg: "bg-emerald-100" },
    { icon: XCircle, label: "Pending Validation", value: pendingStudents, color: "text-amber-600", bg: "bg-amber-100" },
    { icon: TrendingUp, label: "Validation Rate", value: `${validationRate}%`, color: "text-violet-600", bg: "bg-violet-100" },
  ]

  return (
    <div className="page-bg">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 mb-4">
            <BarChart3 className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Analytics Dashboard</h1>
          <p className="text-gray-500">Registration and validation statistics for the fest</p>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Role breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Registration by Role</CardTitle>
              <CardDescription>Breakdown of roles and their validation status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roleStats.map((stat) => (
                  <div key={stat.role} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={roleBadge[stat.role] || ""}>
                          {stat.role.charAt(0).toUpperCase() + stat.role.slice(1)}
                        </Badge>
                        <span className="text-gray-400">
                          {stat.validated}/{stat.total} validated
                        </span>
                      </div>
                      <span className="font-medium text-gray-700">{stat.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${roleBarColor[stat.role] || "bg-gray-400"}`}
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
                {roleStats.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-6">No data yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Colleges */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Top Colleges</CardTitle>
              <CardDescription>Colleges with the most registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topColleges.map((college, index) => (
                  <div key={college.college} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium truncate">{college.college}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-700 shrink-0 ml-2">{college.count}</span>
                  </div>
                ))}
                {topColleges.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-6">No data yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <CardDescription>Registrations in the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-4xl font-bold text-indigo-600 mb-1">{recentRegistrations}</div>
                <p className="text-sm text-gray-500">new registrations</p>
              </div>
            </CardContent>
          </Card>

          {/* Validation Progress */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Validation Progress</CardTitle>
              <CardDescription>Overall check-in status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium text-gray-700">
                    {validatedStudents} of {totalStudents}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${validationRate}%` }}
                  />
                </div>
                <div className="text-center pt-2">
                  <p className="text-2xl font-bold text-emerald-600">{validationRate}%</p>
                  <p className="text-xs text-gray-500">complete</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
