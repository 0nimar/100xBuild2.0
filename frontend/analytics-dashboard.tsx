"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Counter } from "./components/Counter"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { addDays, subDays } from "date-fns"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Globe, Users, Eye, Clock, Smartphone, Monitor, Tablet, RefreshCw, TrendingUp, Activity } from "lucide-react"

interface DomainData {
  domain: string
  total_page_views: number
  unique_visitors: number
  unique_sessions: number
  devices: {
    mobile: number
    tablet: number
    desktop: number
  }
  browsers: Record<string, number>
  operating_systems: Record<string, number>
  screen_resolutions: Record<string, number>
  pages: Record<string, number>
  countries: Record<string, number>
  cities: Record<string, number>
  average_session_duration: number
  total_sessions: number
  latest_activity: string
  bounce_rate: number
  pages_per_session: number
  referrers: Record<string, number>
  entry_pages: Record<string, number>
  exit_pages: Record<string, number>
  date: string
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

type FilterType = 'device' | 'browser' | 'os' | 'page';

interface ActiveFilters {
  [key: string]: string | undefined;
  device?: string;
  browser?: string;
  os?: string;
  page?: string;
}

interface DateRange {
  from: Date;
  to: Date;
}

export default function AnalyticsDashboard() {
  const [domains, setDomains] = useState<string[]>([])
  const [selectedDomain, setSelectedDomain] = useState<string>("")
  const [analyticsData, setAnalyticsData] = useState<DomainData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({})

  // Real API calls
  const fetchDomains = async () => {
    try {
      setError(null)
      const response = await fetch('http://localhost:8000/api/v1/tracking/domains')
      if (!response.ok) {
        throw new Error('Failed to fetch domains')
      }
      const responseData = await response.json()
      if (responseData.data && Array.isArray(responseData.data.domains)) {
        setDomains(responseData.data.domains)
        if (responseData.data.domains.length > 0) {
          setSelectedDomain(responseData.data.domains[0])
        }
      } else {
        console.error("Invalid response format:", responseData)
        setError("Invalid response format from server")
      }
    } catch (error) {
      console.error("Failed to fetch domains:", error)
      setError("Failed to fetch domains. Please try again.")
    }
  }

  const fetchDomainAnalytics = async (domain: string) => {
    if (!domain) return

    setLoading(true)
    setError(null)
    try {
      const queryParams = new URLSearchParams({
        from: dateRange.from.toISOString(),
        to: dateRange.to.toISOString(),
        ...activeFilters
      })
      
      const response = await fetch(`http://localhost:8000/api/v1/tracking/domain/${domain}?${queryParams}`)
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      const responseData = await response.json()
      if (responseData.data) {
        setAnalyticsData(responseData.data)
        setLastUpdated(new Date())
      } else {
        console.error("Invalid response format:", responseData)
        setError("Invalid response format from server")
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
      setError("Failed to fetch analytics. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDomains()
  }, [])

  useEffect(() => {
    if (selectedDomain) {
      fetchDomainAnalytics(selectedDomain)
    }
  }, [selectedDomain])

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}m ${remainingSeconds}s`
  }

  const prepareChartData = (data: Record<string, number>) => {
    return Object.entries(data).map(([key, value]) => ({
      name: key,
      value,
      fill: COLORS[Object.keys(data).indexOf(key) % COLORS.length],
    }))
  }

  const deviceData = analyticsData?.devices
    ? (() => {
        const total = Object.values(analyticsData.devices).reduce((sum, count) => sum + count, 0);
        return [
          { 
            name: "Desktop", 
            value: Math.round((analyticsData.devices.desktop || 0) / total * 100), 
            fill: COLORS[0], 
            icon: Monitor 
          },
          { 
            name: "Mobile", 
            value: Math.round((analyticsData.devices.mobile || 0) / total * 100), 
            fill: COLORS[1], 
            icon: Smartphone 
          },
          { 
            name: "Tablet", 
            value: Math.round((analyticsData.devices.tablet || 0) / total * 100), 
            fill: COLORS[2], 
            icon: Tablet 
          },
        ];
      })()
    : []

  const handleFilterClick = (filterType: FilterType, value: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev }
      if (newFilters[filterType] === value) {
        delete newFilters[filterType]
      } else {
        newFilters[filterType] = value
      }
      return newFilters
    })
  }

  const clearFilters = () => {
    setActiveFilters({})
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Monitor your website performance and user engagement</p>
          </div>

          <div className="flex items-center gap-4">
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              className="bg-white dark:bg-slate-800"
            />
            
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger className="w-[200px] bg-white dark:bg-slate-800">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                {domains.map((domain) => (
                  <SelectItem key={domain} value={domain}>
                    {domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Counter />

            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchDomainAnalytics(selectedDomain)}
              disabled={loading}
              className="bg-white dark:bg-slate-800"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {analyticsData && (
          <>
            {/* Active Filters */}
            {Object.keys(activeFilters).length > 0 && (
              <div className="flex items-center gap-2 p-4 bg-white dark:bg-slate-800 rounded-lg border shadow-sm">
                <span className="text-sm font-medium">Active Filters:</span>
                {Object.entries(activeFilters).map(([type, value]) => (
                  <Badge
                    key={`${type}-${value}`}
                    variant="secondary"
                    className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
                    onClick={() => handleFilterClick(type as FilterType, value)}
                  >
                    {type}: {value} ×
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="ml-2"
                >
                  Clear All
                </Button>
              </div>
            )}

            {/* Status Bar */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Live Data</span>
                <Badge variant="secondary">{selectedDomain}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
                  <Eye className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {analyticsData.total_page_views.toLocaleString()}
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                  <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {analyticsData.unique_visitors.toLocaleString()}
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    +8% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                  <Activity className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {analyticsData.total_sessions.toLocaleString()}
                  </div>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    +15% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
                  <Clock className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    {formatDuration(analyticsData.average_session_duration)}
                  </div>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    +5% from last month
                  </p>
                </CardContent>
              </Card>

              {/* New Metrics */}
              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 border-pink-200 dark:border-pink-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                  <Activity className="h-4 w-4 text-pink-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-pink-700 dark:text-pink-300">
                    {analyticsData.bounce_rate?.toFixed(1)}%
                  </div>
                  <p className="text-xs text-pink-600 dark:text-pink-400 mt-1">
                    Single-page sessions
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pages/Session</CardTitle>
                  <Activity className="h-4 w-4 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                    {analyticsData.pages_per_session?.toFixed(1)}
                  </div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                    Average pages viewed
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Device Distribution */}
              <Card className="bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    Device Distribution
                  </CardTitle>
                  <CardDescription>Breakdown of visitors by device type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      desktop: { label: "Desktop", color: COLORS[0] },
                      mobile: { label: "Mobile", color: COLORS[1] },
                      tablet: { label: "Tablet", color: COLORS[2] },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                          onClick={(data) => handleFilterClick('device', data.name.toLowerCase())}
                          style={{ cursor: 'pointer' }}
                        >
                          {deviceData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.fill}
                              style={{ 
                                opacity: activeFilters.device ? 
                                  (activeFilters.device === entry.name.toLowerCase() ? 1 : 0.3) : 1 
                              }}
                            />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Browser Distribution */}
              <Card className="bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle>Browser Distribution</CardTitle>
                  <CardDescription>Most popular browsers among your visitors</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      browsers: { label: "Browsers", color: COLORS[0] },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={prepareChartData(analyticsData.browsers)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar 
                          dataKey="value" 
                          fill={COLORS[0]} 
                          radius={[4, 4, 0, 0]}
                          onClick={(data) => handleFilterClick('browser', data.name)}
                          style={{ cursor: 'pointer' }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Operating Systems & Screen Resolutions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle>Operating Systems</CardTitle>
                  <CardDescription>Distribution of operating systems</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analyticsData.operating_systems).map(([os, count], index) => {
                      const total = Object.values(analyticsData.operating_systems).reduce((sum, val) => sum + val, 0);
                      const percentage = Math.round((count / total) * 100);
                      return (
                        <div key={os} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-medium">{os}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: COLORS[index % COLORS.length],
                                }}
                              />
                            </div>
                            <span className="text-sm font-semibold w-8 text-right">{percentage}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle>Screen Resolutions</CardTitle>
                  <CardDescription>Most common screen resolutions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analyticsData.screen_resolutions).map(([resolution, count], index) => {
                      const total = Object.values(analyticsData.screen_resolutions).reduce((sum, val) => sum + val, 0);
                      const percentage = Math.round((count / total) * 100);
                      return (
                        <div key={resolution} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-medium">{resolution}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: COLORS[index % COLORS.length],
                                }}
                              />
                            </div>
                            <span className="text-sm font-semibold w-8 text-right">{percentage}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Page Analytics */}
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
                <CardDescription>Most visited pages on your website</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    pages: { label: "Page Views", color: COLORS[2] },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={prepareChartData(analyticsData.pages)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="value" stroke={COLORS[2]} fill={COLORS[2]} fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Traffic Sources */}
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your visitors are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analyticsData.referrers || {}).map(([source, count], index) => {
                    const total = Object.values(analyticsData.referrers || {}).reduce((sum, val) => sum + val, 0);
                    const percentage = Math.round((count / total) * 100);
                    return (
                      <div key={source} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium">{source || 'Direct'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />
                          </div>
                          <span className="text-sm font-semibold w-8 text-right">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Entry & Exit Pages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle>Top Entry Pages</CardTitle>
                  <CardDescription>Where visitors first land</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analyticsData.entry_pages || {})
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([page, count], index) => {
                        const total = Object.values(analyticsData.entry_pages || {}).reduce((sum, val) => sum + val, 0);
                        const percentage = Math.round((count / total) * 100);
                        return (
                          <div key={page} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <span className="font-medium truncate max-w-[200px]">{page}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${percentage}%`,
                                    backgroundColor: COLORS[index % COLORS.length],
                                  }}
                                />
                              </div>
                              <span className="text-sm font-semibold w-8 text-right">{percentage}%</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle>Top Exit Pages</CardTitle>
                  <CardDescription>Where visitors leave</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analyticsData.exit_pages || {})
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([page, count], index) => {
                        const total = Object.values(analyticsData.exit_pages || {}).reduce((sum, val) => sum + val, 0);
                        const percentage = Math.round((count / total) * 100);
                        return (
                          <div key={page} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <span className="font-medium truncate max-w-[200px]">{page}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${percentage}%`,
                                    backgroundColor: COLORS[index % COLORS.length],
                                  }}
                                />
                              </div>
                              <span className="text-sm font-semibold w-8 text-right">{percentage}%</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Location Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle>Top Countries</CardTitle>
                  <CardDescription>Visitor distribution by country</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analyticsData.countries || {})
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([country, count], index) => {
                        const total = Object.values(analyticsData.countries || {}).reduce((sum, val) => sum + val, 0);
                        const percentage = Math.round((count / total) * 100);
                        return (
                          <div key={country} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Globe className="w-4 h-4 text-gray-500" />
                              <span>{country}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">{count} visits</span>
                              <Badge variant="secondary">{percentage}%</Badge>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle>Top Cities</CardTitle>
                  <CardDescription>Visitor distribution by city</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analyticsData.cities || {})
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([city, count], index) => {
                        const total = Object.values(analyticsData.cities || {}).reduce((sum, val) => sum + val, 0);
                        const percentage = Math.round((count / total) * 100);
                        return (
                          <div key={city} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Globe className="w-4 h-4 text-gray-500" />
                              <span>{city}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">{count} visits</span>
                              <Badge variant="secondary">{percentage}%</Badge>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {error && (
          <Card className="bg-white dark:bg-slate-800 border-red-200 dark:border-red-800">
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-12 h-12 text-red-500 mx-auto mb-4">⚠️</div>
                <h3 className="text-lg font-semibold mb-2 text-red-600 dark:text-red-400">Error</h3>
                <p className="text-red-500 dark:text-red-400">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedDomain ? fetchDomainAnalytics(selectedDomain) : fetchDomains()}
                  className="mt-4"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!analyticsData && !loading && !error && (
          <Card className="bg-white dark:bg-slate-800">
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Domain</h3>
                <p className="text-muted-foreground">Choose a domain from the dropdown to view analytics</p>
              </div>
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card className="bg-white dark:bg-slate-800">
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <RefreshCw className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-semibold mb-2">Loading Analytics</h3>
                <p className="text-muted-foreground">Fetching data for {selectedDomain}...</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
