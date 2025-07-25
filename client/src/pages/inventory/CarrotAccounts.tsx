import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Filter, Package, TrendingUp, TrendingDown, AlertTriangle, Eye } from "lucide-react";

interface CarrotAccount {
  id: string;
  customerName: string;
  totalReceived: number;
  totalShipped: number;
  currentBalance: number;
  unit: string;
  lastActivity: Date;
  status: "active" | "inactive" | "pending";
  notes?: string;
}

// Mock data for carrot accounts
const mockCarrotAccounts: CarrotAccount[] = [
  {
    id: "1",
    customerName: "Green Market Co.",
    totalReceived: 2500,
    totalShipped: 2100,
    currentBalance: 400,
    unit: "kg",
    lastActivity: new Date("2024-03-25"),
    status: "active",
    notes: "Regular customer with weekly deliveries"
  },
  {
    id: "2", 
    customerName: "Fresh Foods Ltd.",
    totalReceived: 1800,
    totalShipped: 1800,
    currentBalance: 0,
    unit: "kg",
    lastActivity: new Date("2024-03-20"),
    status: "active",
    notes: "Account balanced"
  },
  {
    id: "3",
    customerName: "City Grocers",
    totalReceived: 3200,
    totalShipped: 3500,
    currentBalance: -300,
    unit: "kg",
    lastActivity: new Date("2024-03-28"),
    status: "pending",
    notes: "Shortage needs to be addressed"
  },
  {
    id: "4",
    customerName: "Farm Direct",
    totalReceived: 1500,
    totalShipped: 1200,
    currentBalance: 300,
    unit: "kg",
    lastActivity: new Date("2024-03-22"),
    status: "active"
  }
];

export default function CarrotAccounts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAccount, setSelectedAccount] = useState<CarrotAccount | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: customers } = useQuery({
    queryKey: ["/api/customers"],
  });

  const { data: stockTransactions } = useQuery({
    queryKey: ["/api/stock-transactions"],
  });

  const { data: inventoryItems } = useQuery({
    queryKey: ["/api/inventory-masters"],
  });

  const carrotAccounts = mockCarrotAccounts;

  const filteredAccounts = carrotAccounts.filter((account) => {
    const matchesSearch = account.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || account.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (account: CarrotAccount) => {
    setSelectedAccount(account);
    setIsDialogOpen(true);
  };

  const totalReceived = carrotAccounts.reduce((sum, account) => sum + account.totalReceived, 0);
  const totalShipped = carrotAccounts.reduce((sum, account) => sum + account.totalShipped, 0);
  const totalBalance = carrotAccounts.reduce((sum, account) => sum + account.currentBalance, 0);
  const activeAccounts = carrotAccounts.filter(account => account.status === "active").length;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "pending":
        return "secondary";
      case "inactive":
        return "outline";
      default:
        return "outline";
    }
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return "text-green-600";
    if (balance < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Carrot Accounts</h1>
          <p className="text-gray-600">Monitor carrot inventory accounts and customer balances</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Account Entry
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="text-blue-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Accounts</p>
                <p className="text-2xl font-bold text-gray-900">{activeAccounts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-green-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Received</p>
                <p className="text-2xl font-bold text-gray-900">{totalReceived.toLocaleString()} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="text-orange-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Shipped</p>
                <p className="text-2xl font-bold text-gray-900">{totalShipped.toLocaleString()} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="text-purple-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Net Balance</p>
                <p className={`text-2xl font-bold ${getBalanceColor(totalBalance)}`}>
                  {totalBalance > 0 ? "+" : ""}{totalBalance.toLocaleString()} kg
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-green-800">Positive Balances</span>
                <span className="text-green-700 font-bold">
                  {carrotAccounts.filter(acc => acc.currentBalance > 0).length} accounts
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="font-medium text-red-800">Negative Balances</span>
                <span className="text-red-700 font-bold">
                  {carrotAccounts.filter(acc => acc.currentBalance < 0).length} accounts
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-800">Balanced Accounts</span>
                <span className="text-gray-700 font-bold">
                  {carrotAccounts.filter(acc => acc.currentBalance === 0).length} accounts
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {carrotAccounts
                .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
                .slice(0, 4)
                .map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{account.customerName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(account.lastActivity).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${getBalanceColor(account.currentBalance)}`}>
                        {account.currentBalance > 0 ? "+" : ""}{account.currentBalance} kg
                      </p>
                      <Badge variant={getStatusBadgeVariant(account.status)} className="text-xs">
                        {account.status}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Carrot Accounts ({filteredAccounts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAccounts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No accounts found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {carrotAccounts.length === 0 
                  ? "No carrot accounts have been set up yet."
                  : "Try adjusting your search criteria."
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 table-hover">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Received
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shipped
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAccounts.map((account) => (
                    <tr key={account.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Package className="text-orange-600 h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{account.customerName}</div>
                            {account.notes && (
                              <div className="text-sm text-gray-500">{account.notes}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account.totalReceived.toLocaleString()} {account.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account.totalShipped.toLocaleString()} {account.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${getBalanceColor(account.currentBalance)}`}>
                            {account.currentBalance > 0 ? "+" : ""}{account.currentBalance.toLocaleString()} {account.unit}
                          </span>
                          {account.currentBalance < 0 && (
                            <AlertTriangle className="h-4 w-4 text-red-500 ml-2" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusBadgeVariant(account.status)}>
                          {account.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(account.lastActivity).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(account)}
                          className="text-primary hover:text-primary/80"
                        >
                          <Eye className="h-4 w-4" />
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

      {/* Account Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Account Details - {selectedAccount?.customerName}</DialogTitle>
          </DialogHeader>
          {selectedAccount && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">Total Received</p>
                  <p className="text-2xl font-bold text-green-700">
                    {selectedAccount.totalReceived.toLocaleString()} {selectedAccount.unit}
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm font-medium text-orange-800">Total Shipped</p>
                  <p className="text-2xl font-bold text-orange-700">
                    {selectedAccount.totalShipped.toLocaleString()} {selectedAccount.unit}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Current Balance</p>
                  <p className={`text-2xl font-bold ${
                    selectedAccount.currentBalance > 0 ? 'text-green-700' :
                    selectedAccount.currentBalance < 0 ? 'text-red-700' : 'text-gray-700'
                  }`}>
                    {selectedAccount.currentBalance > 0 ? "+" : ""}{selectedAccount.currentBalance.toLocaleString()} {selectedAccount.unit}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Status:</span>
                  <Badge variant={getStatusBadgeVariant(selectedAccount.status)}>
                    {selectedAccount.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Last Activity:</span>
                  <span>{new Date(selectedAccount.lastActivity).toLocaleDateString()}</span>
                </div>
                {selectedAccount.notes && (
                  <div>
                    <span className="font-medium">Notes:</span>
                    <p className="mt-1 text-sm text-gray-600">{selectedAccount.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                <Button>
                  Update Account
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
