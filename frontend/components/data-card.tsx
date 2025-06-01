import {  LucideIcon, TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"

interface DataCardProps{
  title:string;
  themeColor:string;
  content:string;
  trendingEnabled:boolean;
  trending?:boolean;
  icon:LucideIcon;
  contentDetails?:string;
  trendingCent?:string;
}

const colorMap = {
  blue: {
    gradient: "from-blue-500/20 to-blue-600/20",
    darkGradient: "from-blue-900/30 to-blue-800/30",
    text: "text-blue-700 dark:text-blue-300",
    icon: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800"
  },
  green: {
    gradient: "from-green-500/20 to-green-600/20",
    darkGradient: "from-green-900/30 to-green-800/30",
    text: "text-green-700 dark:text-green-300",
    icon: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800"
  },
  purple: {
    gradient: "from-purple-500/20 to-purple-600/20",
    darkGradient: "from-purple-900/30 to-purple-800/30",
    text: "text-purple-700 dark:text-purple-300",
    icon: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800"
  },
  orange: {
    gradient: "from-orange-500/20 to-orange-600/20",
    darkGradient: "from-orange-900/30 to-orange-800/30",
    text: "text-orange-700 dark:text-orange-300",
    icon: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800"
  },
  pink: {
    gradient: "from-pink-500/20 to-pink-600/20",
    darkGradient: "from-pink-900/30 to-pink-800/30",
    text: "text-pink-700 dark:text-pink-300",
    icon: "text-pink-600 dark:text-pink-400",
    border: "border-pink-200 dark:border-pink-800"
  },
  indigo: {
    gradient: "from-indigo-500/20 to-indigo-600/20",
    darkGradient: "from-indigo-900/30 to-indigo-800/30",
    text: "text-indigo-700 dark:text-indigo-300",
    icon: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-800"
  }
}

function DataCard({data}:{data:DataCardProps}) {
  const colors = colorMap[data.themeColor as keyof typeof colorMap] || colorMap.blue;

  return (
    <Card className={`bg-gradient-to-br ${colors.gradient} dark:${colors.darkGradient} ${colors.border} backdrop-blur-sm hover:shadow-lg transition-all duration-300`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{data.title}</CardTitle>
        <data.icon className={`h-4 w-4 ${colors.icon}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${colors.text}`}>
          {data.content}
        </div>
        {data.trendingEnabled ? (
          <p className={`text-xs ${colors.text} mt-1`}>
            {data.trending ? <TrendingUp className="w-3 h-3 inline mr-1" /> : <TrendingDown className="w-3 h-3 inline mr-1" />}
            {data.trending ? "+" : "-"}{data.trendingCent}% from last month
          </p>
        ) : (
          <p className={`text-xs ${colors.text} mt-1`}>
            {data.contentDetails}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default DataCard