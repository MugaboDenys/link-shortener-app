"use client"

import { useState, useEffect, JSX } from "react"
import { BarChart, LineChart, ArrowUpRight, ArrowDownRight, Users, Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DashboardStatsProps {
  totalClicks?: number;
  totalLinks?: number;
}

export default function DashboardStats({ totalClicks = 0, totalLinks = 0 }: DashboardStatsProps) {
  const [stats, setStats] = useState({
    clicks: { value: totalClicks||0, change: 12.5 },
    links: { value: totalLinks||0, change: 8.2 },
    visitors: { value: 0, change: -3.4 },
    countries: { value: 0, change: 5.7 },
  })

  useEffect(() => {
    // Update stats when props change
    setStats((prevStats) => ({
      ...prevStats,
      clicks: { ...prevStats.clicks, value: totalClicks || 0 },
      links: { ...prevStats.links, value: totalLinks || 0 },
    }))
  }, [totalClicks, totalLinks])

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setStats((prevStats) => ({
        ...prevStats,
        visitors: { value: 9254, change: -3.4 },
        countries: { value: 42, change: 5.7 },
      }))
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-4">
      <Tabs defaultValue="7days" className="w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Analytics Overview</h2>
          <TabsList>
            <TabsTrigger value="24hours">24 hours</TabsTrigger>
            <TabsTrigger value="7days">7 days</TabsTrigger>
            <TabsTrigger value="30days">30 days</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="7days" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Clicks"
              value={stats.clicks.value.toLocaleString()}
              change={stats.clicks.change}
              icon={<BarChart className="h-5 w-5" />}
              color="blue"
            />
            <StatsCard
              title="Active Links"
              value={stats.links.value.toLocaleString()}
              change={stats.links.change}
              icon={<LineChart className="h-5 w-5" />}
              color="purple"
            />
            <StatsCard
              title="Unique Visitors"
              value={stats.visitors.value.toLocaleString()}
              change={stats.visitors.change}
              icon={<Users className="h-5 w-5" />}
              color="orange"
            />
            <StatsCard
              title="Countries"
              value={stats.countries.value.toLocaleString()}
              change={stats.countries.change}
              icon={<Globe className="h-5 w-5" />}
              color="green"
            />
          </div>
        </TabsContent>

        {/* Other tab contents would be similar */}
        <TabsContent value="24hours" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{/* Same cards but with different data */}</div>
        </TabsContent>
        <TabsContent value="30days" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{/* Same cards but with different data */}</div>
        </TabsContent>
        <TabsContent value="custom" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{/* Same cards but with different data */}</div>
        </TabsContent>
      </Tabs>

      {/* Chart placeholder */}
      {/* <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle>Click Performance</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] w-full bg-gray-100 rounded-md flex items-center justify-center">
            <div className="text-center">
              <BarChart className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">Click performance chart would appear here</p>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}

function StatsCard({ title, value, change, icon, color }: { title: string; value: string; change: number; icon: JSX.Element; color: 'blue' | 'purple' | 'orange' | 'green' }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-md ${colorClasses[color]}`}>{icon}</div>
          <div className={`flex items-center text-sm ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
            {change >= 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
            <span>{Math.abs(change)}%</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

