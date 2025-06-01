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
function DataCard({data}:{data:DataCardProps}) {
  return (
    <Card className={`bg-gradient-to-br from-${data.themeColor}-50 to-${data.themeColor}-100 dark:from-${data.themeColor}-950 dark:to-${data.themeColor}-900 border-${data.themeColor}-200 dark:border-${data.themeColor}-800`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{data.title}</CardTitle>
                  <data.icon className={`h-4 w-4 text-${data.themeColor}-600`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold text-${data.themeColor}-700 dark:text-${data.themeColor}-300`}>
                    {data.content}
                  </div>
                  {data.trendingEnabled?<p className={`text-xs text-${data.themeColor}-600 dark:text-${data.themeColor}-400 mt-1"`}>
                    {data.trending?<TrendingUp className="w-3 h-3 inline mr-1" />:<TrendingDown className="w-3 h-3 inline mr-1" />}
                    {data.trending?"+":"-"}{data.trendingCent}% from last month
                  </p>:<p className={`text-xs text-${data.themeColor}-600 dark:text-${data.themeColor}-400 mt-1`}>
                    {data.contentDetails}
                  </p>}
                </CardContent>
              </Card>
  )
}

export default DataCard