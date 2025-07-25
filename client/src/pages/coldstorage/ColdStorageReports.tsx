import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Calendar, Snowflake, BarChart3, TrendingUp, Thermometer, Filter } from "lucide-react";

interface ColdStorageReport {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  frequency: string;
  lastGenerated?: Date;
}

const coldStorageReports: ColdStorageReport[] = [
  {
    id: "occupancy-report",
    name: "Storage Occupancy Report",
    description: "Current occupancy levels and capacity utilization across all cold storage units",
    category: "Occupancy",
    icon: BarChart3,
    frequency: "Real-time"
  },
  {
    id: "temperature-monitoring",
    name: "Temperature Monitoring",
    description: "Temperature logs and alerts for all cold storage units",
    category: "Monitoring",
    icon: Thermometer,
    frequency: "Continuous"
  },
  {
    id: "storage-transactions",
    name: "Storage Transaction Log",
    description: "Complete log of all storage in/out transactions",
    category: "Transactions",
    icon: FileText,
    frequency: "Daily"
  },
  {
    id: "item-tracking",
    name: "Item Tracking Report",
    description: "Track specific items through cold storage lifecycle",
    category: "Tracking",
    icon: TrendingUp,
    frequency: "Real-time"
  },
  {
    id: "efficiency-analysis",
    name: "Storage Efficiency Analysis",
    description: "Analysis of storage turnover rates and efficiency metrics",
    category: "Analysis",
    icon: BarChart3,
    frequency: "Weekly"
  },
  {
    id: "maintenance-schedule",
    name: "Maintenance Schedule",
    description: "Scheduled maintenance activities and equipment status",
    category: "Maintenance",
    icon: Calendar,
    frequency: "Monthly"
  },
  {
    id: "energy-consumption",
    name: "Energy Consumption Report",
    description: "Energy usage patterns and cost analysis for cold storage operations",
    category: "Energy",
    icon: TrendingUp,
    frequency: "Monthly"
  },
  {
    id: "quality-compliance",
    name: "Quality Compliance Report",
    description: "Temperature compliance and quality control metrics",
    category: "Compliance",
    icon: FileText,
    frequency: "Weekly"
  }
];

export default function ColdStorageReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("current-month");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data: coldStorageUnits } = useQuery({
    queryKey: ["/api/cold-storage-units"],
  });

  const { data: coldStorageTransactions } = useQuery({
    queryKey: ["/api/cold-storage-transactions"],
  });

  const handleGenerateReport = (reportId: string) => {
    console.log(`Generating report: ${reportId}`);
    // Implement report generation logic
  };

  const handleExportReport = (reportId: string, format: string) => {
    console.log(`Exporting report: ${reportId} as ${format}`);
    // Implement export logic
  };

  const filteredReports = selectedCategory === "all" 
    ? coldStorageReports 
    : coldStorageReports.filter(report => report.category === selectedCategory);

  const categories = [...new Set(coldStorageReports.map(report => report.category))];

  // Calculate stats
  const totalUnits = coldStorageUnits?.length || 0;
  const totalCapacity = coldStorageUnits?.reduce((sum: number, unit: any) => sum + unit.capacity, 0) || 0;
  const totalOccupancy = coldStorageUnits?.reduce((sum: number, unit: any) => sum + unit.currentOccupancy, 0) || 0;
  const occupancyRate = totalCapacity > 0 ? ((totalOccupancy / totalCapacity) * 100).toFixed(1) : "0";
  const totalTransactions = coldStorageTransactions?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cold Storage Reports</h1>
          <p className="text-gray-600">Generate and manage cold storage operational reports</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Report Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Snowflake className="text-blue-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Storage Units</p>
                <p className="text-2xl font-bold text-gray-900">{totalUnits}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-green-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                <p className="text-2xl font-bold text-gray-900">{occupancyRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-purple-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                <p className="text-2xl font-bold text-gray-900">{totalCapacity.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="text-orange-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">Current Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="current-quarter">Current Quarter</SelectItem>
                  <SelectItem value="last-quarter">Last Quarter</SelectItem>
                  <SelectItem value="current-year">Current Year</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                disabled={selectedPeriod !== "custom"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                disabled={selectedPeriod !== "custom"}
              />
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => {
          const IconComponent = report.icon;
          return (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <IconComponent className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{report.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {report.category}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant="secondary">{report.frequency}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                {report.lastGenerated && (
                  <p className="text-xs text-gray-500 mb-4">
                    Last generated: {report.lastGenerated.toLocaleDateString()}
                  </p>
                )}
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleGenerateReport(report.id)}
                  >
                    Generate
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleExportReport(report.id, "pdf")}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col">
              <Thermometer className="h-6 w-6 mb-2" />
              <span className="text-sm">Temperature Status</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              <span className="text-sm">Occupancy Overview</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span className="text-sm">Usage Trends</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <FileText className="h-6 w-6 mb-2" />
              <span className="text-sm">Daily Summary</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Storage Unit Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Storage Unit Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {coldStorageUnits?.slice(0, 5).map((unit: any) => (
                <div key={unit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Snowflake className="text-blue-600 h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{unit.unitName}</p>
                      <p className="text-sm text-gray-500">{unit.unitCode}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {unit.currentOccupancy}/{unit.capacity}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Thermometer className="h-3 w-3 mr-1" />
                      {parseFloat(unit.temperature || "0").toFixed(1)}°C
                    </div>
                  </div>
                </div>
              )) || (
                <p className="text-center text-gray-500 py-4">No storage units found</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Thermometer className="text-blue-600 h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Temperature Monitoring Report</p>
                    <p className="text-sm text-gray-500">Generated on March 30, 2024</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">View</Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="text-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Storage Occupancy Report</p>
                    <p className="text-sm text-gray-500">Generated on March 28, 2024</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">View</Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="text-purple-600 h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Transaction Log Report</p>
                    <p className="text-sm text-gray-500">Generated on March 25, 2024</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">View</Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
