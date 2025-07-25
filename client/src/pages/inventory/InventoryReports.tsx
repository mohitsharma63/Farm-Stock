import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Calendar, Package, BarChart3, TrendingUp, AlertTriangle, Filter } from "lucide-react";

interface InventoryReport {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  frequency: string;
  lastGenerated?: Date;
}

const inventoryReports: InventoryReport[] = [
  {
    id: "stock-levels",
    name: "Current Stock Levels",
    description: "Current inventory levels for all items with stock status",
    category: "Stock",
    icon: Package,
    frequency: "Real-time"
  },
  {
    id: "stock-movement",
    name: "Stock Movement Report",
    description: "Detailed report of all stock movements within date range",
    category: "Movement",
    icon: TrendingUp,
    frequency: "Daily"
  },
  {
    id: "low-stock-alert",
    name: "Low Stock Alert",
    description: "Items that are below minimum stock levels",
    category: "Alert",
    icon: AlertTriangle,
    frequency: "Real-time",
    lastGenerated: new Date("2024-03-30")
  },
  {
    id: "carrot-summary",
    name: "Carrot Account Summary",
    description: "Summary of all carrot account balances and transactions",
    category: "Specialty",
    icon: Package,
    frequency: "Weekly"
  },
  {
    id: "inventory-valuation",
    name: "Inventory Valuation",
    description: "Current value of inventory based on unit prices",
    category: "Financial",
    icon: BarChart3,
    frequency: "Monthly",
    lastGenerated: new Date("2024-03-25")
  },
  {
    id: "turnover-analysis",
    name: "Inventory Turnover",
    description: "Analysis of inventory turnover rates by category",
    category: "Analysis",
    icon: TrendingUp,
    frequency: "Monthly"
  },
  {
    id: "aging-report",
    name: "Inventory Aging Report",
    description: "Age analysis of inventory items and slow-moving stock",
    category: "Analysis",
    icon: Calendar,
    frequency: "Monthly"
  },
  {
    id: "supplier-performance",
    name: "Supplier Performance",
    description: "Analysis of supplier delivery and quality performance",
    category: "Supplier",
    icon: FileText,
    frequency: "Monthly"
  }
];

export default function InventoryReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("current-month");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data: inventoryItems } = useQuery({
    queryKey: ["/api/inventory-masters"],
  });

  const { data: stockTransactions } = useQuery({
    queryKey: ["/api/stock-transactions"],
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
    ? inventoryReports 
    : inventoryReports.filter(report => report.category === selectedCategory);

  const categories = [...new Set(inventoryReports.map(report => report.category))];

  // Calculate some basic stats
  const totalItems = inventoryItems?.length || 0;
  const activeItems = inventoryItems?.filter((item: any) => item.isActive).length || 0;
  const totalTransactions = stockTransactions?.length || 0;
  const thisMonthTransactions = stockTransactions?.filter((t: any) => {
    const transactionDate = new Date(t.transactionDate);
    const now = new Date();
    return transactionDate.getMonth() === now.getMonth() && 
           transactionDate.getFullYear() === now.getFullYear();
  }).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Reports</h1>
          <p className="text-gray-600">Generate and manage inventory and stock reports</p>
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
                <Package className="text-blue-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="text-green-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Items</p>
                <p className="text-2xl font-bold text-gray-900">{activeItems}</p>
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
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-orange-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{thisMonthTransactions}</p>
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
              <AlertTriangle className="h-6 w-6 mb-2" />
              <span className="text-sm">Stock Alerts</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Package className="h-6 w-6 mb-2" />
              <span className="text-sm">Current Stock</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span className="text-sm">Movement Summary</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              <span className="text-sm">Valuation Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="text-orange-600 h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Low Stock Alert Report</p>
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
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="text-blue-600 h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Current Stock Levels</p>
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
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-green-600 h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Stock Movement Report</p>
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

      {/* Inventory Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Stock Status Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-green-800">Adequate Stock</span>
                <span className="text-green-700 font-bold">
                  {Math.floor(Math.random() * 20) + 10} items
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium text-yellow-800">Low Stock</span>
                <span className="text-yellow-700 font-bold">
                  {Math.floor(Math.random() * 5) + 2} items
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="font-medium text-red-800">Out of Stock</span>
                <span className="text-red-700 font-bold">
                  {Math.floor(Math.random() * 3)} items
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Vegetables", "Fruits", "Grains", "Dairy"].map((category, index) => (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{category}</span>
                  <div className="text-right">
                    <span className="text-gray-700 font-bold">
                      {Math.floor(Math.random() * 10) + 5} items
                    </span>
                    <div className="text-sm text-gray-500">
                      ${(Math.random() * 10000 + 5000).toFixed(0)} value
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
