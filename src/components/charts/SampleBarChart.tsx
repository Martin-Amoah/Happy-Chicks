
"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { ChartConfig } from "@/components/ui/chart"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const defaultChartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface SampleBarChartProps {
  title: string;
  description: string;
  data?: any[];
  config?: ChartConfig;
  dataKeys: { x: string; y1: string; y2?: string };
}

export function SampleBarChart({
  title,
  description,
  data = chartData,
  config = defaultChartConfig,
  dataKeys,
}: SampleBarChartProps) {

  // Dynamically get the first key from the provided config for the Bar's name
  const y1_config_key = Object.keys(config)[0];
  const y1_config = config[y1_config_key];

  // Dynamically get the second key if it exists
  const y2_config_key = dataKeys.y2 ? Object.keys(config)[1] : undefined;
  const y2_config = y2_config_key ? config[y2_config_key] : undefined;


  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey={dataKeys.x}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke="hsl(var(--foreground))"
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--foreground))"
              fontSize={12}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))" }}
              contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)"}}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend
              content={({ payload }) => (
                <ul className="flex justify-center gap-4 mt-4">
                  {payload?.map((entry: any, index: number) => (
                    <li key={`item-${index}`} className="flex items-center gap-1.5 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      {entry.value}
                    </li>
                  ))}
                </ul>
              )}
            />
            <Bar dataKey={dataKeys.y1} fill={y1_config.color} radius={[4, 4, 0, 0]} name={y1_config.label} />
            {dataKeys.y2 && y2_config && (
              <Bar dataKey={dataKeys.y2} fill={y2_config.color} radius={[4, 4, 0, 0]} name={y2_config.label} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
