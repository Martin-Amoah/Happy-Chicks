
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReportDataRow {
  [key: string]: string | number;
}

const sampleReportData: { [key: string]: ReportDataRow[] } = {
  eggProduction: [
    { date: '2024-07-20', shed: 'Shed A', totalEggs: 380, brokenEggs: 5, layRate: '85%' },
    { date: '2024-07-20', shed: 'Shed B', totalEggs: 410, brokenEggs: 3, layRate: '88%' },
    { date: '2024-07-19', shed: 'Shed A', totalEggs: 375, brokenEggs: 6, layRate: '84%' },
  ],
  feedUsage: [
    { date: '2024-07-20', shed: 'Shed A', feedType: 'Layers Mash', quantity: '5 bags', cost: '$250' },
    { date: '2024-07-20', shed: 'Shed B', feedType: 'Layers Mash', quantity: '6 bags', cost: '$300' },
  ],
  brokenEggs: [
    { date: '2024-07-20', shed: 'Shed A', broken: 5, percentage: '1.3%' },
    { date: '2024-07-20', shed: 'Shed B', broken: 3, percentage: '0.7%' },
  ],
  mortality: [
    { date: '2024-07-20', shed: 'Shed C', count: 2, cause: 'Unknown' },
    { date: '2024-07-18', shed: 'Shed A', count: 1, cause: 'Natural' },
  ]
};

const reportHeaders: { [key: string]: string[] } = {
    eggProduction: ["Date", "Shed", "Total Eggs", "Broken Eggs", "Lay Rate (%)"],
    feedUsage: ["Date", "Shed", "Feed Type", "Quantity Used", "Estimated Cost"],
    brokenEggs: ["Date", "Shed", "Broken Eggs", "Percentage of Total"],
    mortality: ["Date", "Shed", "Mortality Count", "Suspected Cause"]
};


export default function ReportsPage() {
  const { toast } = useToast();
  const [reportType, setReportType] = useState<string>('');
  const [reportPeriod, setReportPeriod] = useState<string>('');
  const [generatedReportData, setGeneratedReportData] = useState<ReportDataRow[]>([]);
  const [currentReportHeaders, setCurrentReportHeaders] = useState<string[]>([]);

  const handleGenerateReport = () => {
    if (!reportType || !reportPeriod) {
      toast({
        title: "Selection Missing",
        description: "Please select both a report type and a period.",
        variant: "destructive",
      });
      return;
    }
    // Simulate API call or data fetching
    const data = sampleReportData[reportType] || [];
    const headers = reportHeaders[reportType] || [];
    setGeneratedReportData(data);
    setCurrentReportHeaders(headers);

    if(data.length > 0) {
      toast({
        title: "Report Generated",
        description: `${reportType.replace(/([A-Z])/g, ' $1').trim()} report for ${reportPeriod} period is ready.`,
      });
    } else {
       toast({
        title: "No Data",
        description: `No data found for ${reportType.replace(/([A-Z])/g, ' $1').trim()} report for ${reportPeriod} period.`,
        variant: "default"
      });
    }
  };

  const handleDownloadReport = () => {
    if (generatedReportData.length === 0) {
       toast({
        title: "No Report to Download",
        description: "Please generate a report first.",
        variant: "destructive",
      });
      return;
    }
    // Simulate CSV download
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += currentReportHeaders.join(",") + "\r\n";
    generatedReportData.forEach(row => {
        const values = currentReportHeaders.map(header => row[header.toLowerCase().replace(/\s+/g, '')] || row[header.toLowerCase().replace(/\s+/g, '').replace('(%)', '')] || '');
        csvContent += values.join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${reportType}_${reportPeriod}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Report Downloaded", description: "The report has been downloaded as a CSV file." });
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><FileText className="h-6 w-6 text-primary" /> Generate Farm Reports</CardTitle>
          <CardDescription>Select report parameters to view and download farm performance data.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-1.5">
            <Label htmlFor="reportType">Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger id="reportType">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Production</SelectLabel>
                  <SelectItem value="eggProduction">Egg Production</SelectItem>
                  <SelectItem value="brokenEggs">Broken Eggs</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Resources</SelectLabel>
                  <SelectItem value="feedUsage">Feed Usage</SelectItem>
                </SelectGroup>
                 <SelectGroup>
                  <SelectLabel>Health</SelectLabel>
                  <SelectItem value="mortality">Mortality</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reportPeriod">Report Period</Label>
            <Select value={reportPeriod} onValueChange={setReportPeriod}>
              <SelectTrigger id="reportPeriod">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem> 
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleGenerateReport} className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
           <Filter className="mr-2 h-4 w-4" /> Generate Report
          </Button>
        </CardContent>
      </Card>

      {generatedReportData.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline">{reportType.replace(/([A-Z])/g, ' $1').trim()} Report ({reportPeriod})</CardTitle>
              <CardDescription>Generated report data below.</CardDescription>
            </div>
            <Button variant="outline" onClick={handleDownloadReport}>
              <Download className="mr-2 h-4 w-4" /> Download CSV
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {currentReportHeaders.map((header) => (
                    <TableHead key={header}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {generatedReportData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {currentReportHeaders.map((header, cellIndex) => (
                      <TableCell key={cellIndex}>
                        {row[header.toLowerCase().replace(/\s+/g, '')] ?? row[header.toLowerCase().replace(/\s+/g, '').replace('(%)', '')] ?? 'N/A'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
       {generatedReportData.length === 0 && reportType && reportPeriod && (
         <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No data available for the selected criteria. Try different options.</p>
            </CardContent>
         </Card>
       )}
    </div>
  );
}

