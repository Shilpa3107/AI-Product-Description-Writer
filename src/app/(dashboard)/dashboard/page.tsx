'use client';

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid } from 'recharts';

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const lineChartData = [
  { date: '2024-01-01', conversions: 20 },
  { date: '2024-01-02', conversions: 25 },
  { date: '2024-01-03', conversions: 22 },
  { date: '2024-01-04', conversions: 30 },
  { date: '2024-01-05', conversions: 28 },
  { date: '2024-01-06', conversions: 35 },
  { date: '2024-01-07', conversions: 40 },
];


export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Here's an overview of your content performance."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Descriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.2%</div>
            <p className="text-xs text-muted-foreground">
              +1.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.8%</div>
            <p className="text-xs text-muted-foreground">
              +3.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New A/B Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">
              in the last 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
              mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
            }} className="h-[300px] w-full">
              <RechartsBarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conversions Over Time</CardTitle>
          </CardHeader>
          <CardContent>
             <ChartContainer config={{
              conversions: { label: "Conversions", color: "hsl(var(--chart-1))" },
            }} className="h-[300px] w-full">
              <RechartsLineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="conversions" stroke="var(--color-conversions)" strokeWidth={2} dot={false} />
              </RechartsLineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
