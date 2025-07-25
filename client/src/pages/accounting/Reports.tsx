import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Calendar, TrendingUp, DollarSign, PieChart, BarChart3, Filter } from "lucide-react";

interface ReportType {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  frequency: string;
}

const reportTypes: ReportType[] = [
  {
    id: "balance-sheet",
    name: "Balance Sheet",
    description: "Statement of financial position showing assets, liabilities, and equity",
    category: "Financial",
    icon: BarChart3,
    frequency: "Monthly"
  },
  {
    id: "income-statement",
    name: "Income Statement",
    description: "Profit and loss statement showing revenues and expenses",
    category: "Financial", 
    icon: TrendingUp,
    frequency: "Monthly"
  },
  {
    id: "cash-flow",
    name: "Cash Flow Statement",
    description: "Statement of cash receipts and payments",
    category: "Financial",
    icon: DollarSign,
    frequency: "Monthly"
  },
  {
    id: "trial-balance",
    name: "Trial Balance",
    description: "List of all accounts with debit and credit balances",
    category: "Financial",
    icon: PieChart,
    frequency: "Monthly"
  },
  {
    id: "accounts-receivable",
    name: "Accounts Receivable",
    description: "Outstanding customer balances and aging report",
    category: "Operational",
    icon: FileText,
    frequency: "Weekly"
  },
  {
    id: "accounts-payable",
    name: "Accounts Payable",
    description: "Outstanding vendor balances and payment schedules",
    category: "Operational",
    icon: FileText,
    frequency: "Weekly"
  },
  {
    id: "general-ledger",
    name: "General Ledger",
    description: "Detailed account transactions and balances",
    category: "Detailed",
    icon: FileText,
    frequency: "Daily"
  },
  {
    id: "transaction-detail",
    name: "Transaction Detail",
    description: "Detailed list of all transactions within date range",
    category: "Detailed",
    icon: FileText,
    frequency: "Daily"
  }
];

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("current-month");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data: transactions } = useQuery({
    queryKey: ["/api/transactions"],
  });

  const { data: accounts } = useQuery({
    queryKey: ["/api/account-masters"],
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
    ? reportTypes 
    : reportTypes.filter(report => report.category === selectedCategory);

  const categories = [...new Set(reportTypes.map(report => report.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and manage financial and operational reports</p>
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
                <FileText className="text-blue-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Reports</p>
                <p className="text-2xl font-bold text-gray-900">{reportTypes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-green-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{transactions?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-purple-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Accounts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {accounts?.filter((acc: any) => acc.isActive).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-orange-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {transactions?.filter((t: any) => {
                    const transactionDate = new Date(t.transactionDate);
                    const now = new Date();
                    return transactionDate.getMonth() === now.getMonth() && 
                           transactionDate.getFullYear() === now.getFullYear();
                  }).length || 0}
                </p>
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
              <TrendingUp className="h-6 w-6 mb-2" />
              <span className="text-sm">Monthly Summary</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <DollarSign className="h-6 w-6 mb-2" />
              <span className="text-sm">Cash Position</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <PieChart className="h-6 w-6 mb-2" />
              <span className="text-sm">Account Balances</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              <span className="text-sm">Transaction Volume</span>
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
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="text-blue-600 h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Balance Sheet - March 2024</p>
                  <p className="text-sm text-gray-500">Generated on March 31, 2024</p>
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
                  <p className="font-medium text-gray-900">Income Statement - March 2024</p>
                  <p className="text-sm text-gray-500">Generated on March 31, 2024</p>
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
                  <PieChart className="text-purple-600 h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Trial Balance - March 2024</p>
                  <p className="text-sm text-gray-500">Generated on March 31, 2024</p>
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
  );
}
