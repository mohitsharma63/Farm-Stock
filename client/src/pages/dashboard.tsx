import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Box, 
  Users, 
  Snowflake, 
  ArrowDown, 
  ArrowUp, 
  Plus,
  Filter,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  CheckCircle
} from "lucide-react";
import { Link } from "wouter";
import { DashboardStats, RecentTransaction, SystemAlert } from "@/types";

// Mock data for demonstration
const mockStats: DashboardStats = {
  companies: 24,
  inventory: 1547,
  customers: 896,
  coldStorage: 12
};

const mockTransactions: RecentTransaction[] = [
  {
    id: "1",
    description: "Incoming Stock - Carrots",
    type: "IN",
    amount: "+500 kg",
    value: "$2,500",
    date: "Today, 2:30 PM"
  },
  {
    id: "2",
    description: "Outgoing Stock - Potatoes",
    type: "OUT",
    amount: "-200 kg",
    value: "$800",
    date: "Today, 11:15 AM"
  },
  {
    id: "3",
    description: "Cold Storage Transfer",
    type: "TRANSFER",
    amount: "300 kg",
    value: "Cold Unit #3",
    date: "Yesterday, 4:45 PM"
  }
];

const mockAlerts: SystemAlert[] = [
  {
    id: "1",
    type: "warning",
    title: "Low Stock Alert",
    message: "Carrot inventory below threshold",
    timestamp: "2 minutes ago"
  },
  {
    id: "2",
    type: "info",
    title: "Backup Reminder",
    message: "Scheduled backup in 2 hours",
    timestamp: "1 hour ago"
  },
  {
    id: "3",
    type: "success",
    title: "System Updated",
    message: "All modules synchronized",
    timestamp: "3 hours ago"
  }
];

export default function Dashboard() {
  const { data: companies, isLoading: companiesLoading } = useQuery({
    queryKey: ["/api/companies"],
  });

  const { data: inventory, isLoading: inventoryLoading } = useQuery({
    queryKey: ["/api/inventory-masters"],
  });

  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ["/api/customers"],
  });

  const { data: coldUnits, isLoading: coldUnitsLoading } = useQuery({
    queryKey: ["/api/cold-storage-units"],
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "IN":
        return <ArrowDown className="h-4 w-4 text-green-600" />;
      case "OUT":
        return <ArrowUp className="h-4 w-4 text-red-600" />;
      default:
        return <Snowflake className="h-4 w-4 text-blue-600" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getAlertBgColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "success":
        return "bg-green-50 border-green-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Monitor your inventory and business operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="text-blue-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Companies</p>
                <p className="text-2xl font-bold text-gray-900">
                  {companiesLoading ? "..." : companies?.length || mockStats.companies}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Box className="text-green-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Inventory</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inventoryLoading ? "..." : inventory?.length || mockStats.inventory}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="text-purple-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customersLoading ? "..." : customers?.length || mockStats.customers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Snowflake className="text-orange-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cold Storage Units</p>
                <p className="text-2xl font-bold text-gray-900">
                  {coldUnitsLoading ? "..." : coldUnits?.length || mockStats.coldStorage}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/accounting/transactions">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'IN' ? 'text-green-600' : 
                        transaction.type === 'OUT' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {transaction.amount}
                      </p>
                      <p className="text-sm text-gray-500">{transaction.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/company">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Company
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/inventory/stock">
                  <Box className="h-4 w-4 mr-2" />
                  Record Stock Entry
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/accounting/reports">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Generate Report
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/housekeeping/backup">
                  <Filter className="h-4 w-4 mr-2" />
                  System Backup
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockAlerts.map((alert) => (
                <div key={alert.id} className={`flex items-start space-x-3 p-3 rounded-lg border ${getAlertBgColor(alert.type)}`}>
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    <p className="text-xs text-gray-700">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Company Management Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Company Management</CardTitle>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" asChild>
                <Link to="/company">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Company
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {companiesLoading ? (
            <p className="text-center py-8 text-gray-500">Loading companies...</p>
          ) : !companies || companies.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No companies found. Create your first company to get started.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 table-hover">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {companies.map((company: any) => (
                    <tr key={company.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <span className="text-primary font-medium text-sm">
                              {company.name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{company.name}</div>
                            <div className="text-sm text-gray-500">{company.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={company.isActive ? "default" : "secondary"}>
                          {company.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {company.city && company.state ? `${company.city}, ${company.state}` : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(company.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800 ml-2">
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
