import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  Package,
  Users,
  Snowflake,
  TrendingUp,
  Plus,
  UserPlus,
  Box,
  FileText,
  AlertTriangle
} from "lucide-react";
import type { InventoryMaster, AccountingTransaction } from "@shared/schema";

interface DashboardMetrics {
  totalRevenue: number;
  totalItems: number;
  activeCustomers: number;
  coldStorageCapacity: number;
}

export default function Dashboard() {
  const { data: metrics, isLoading: metricsLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
  });

  const { data: lowStockItems, isLoading: lowStockLoading } = useQuery<InventoryMaster[]>({
    queryKey: ["/api/inventory-master/low-stock"],
  });

  const { data: recentTransactions, isLoading: transactionsLoading } = useQuery<AccountingTransaction[]>({
    queryKey: ["/api/accounting-transactions"],
  });

  if (metricsLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${metrics?.totalRevenue?.toFixed(2) || "0.00"}
                </p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  12.5% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-green-600 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inventory Items</p>
                <p className="text-3xl font-bold text-gray-900">
                  {metrics?.totalItems || 0}
                </p>
                <p className="text-sm text-blue-600 mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  8.2% increase
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="text-blue-600 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-3xl font-bold text-gray-900">
                  {metrics?.activeCustomers || 0}
                </p>
                <p className="text-sm text-purple-600 mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  5.7% growth
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="text-purple-600 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cold Storage</p>
                <p className="text-3xl font-bold text-gray-900">
                  {metrics?.coldStorageCapacity || 0}%
                </p>
                <p className="text-sm text-orange-600 mt-1">
                  Capacity utilized
                </p>
              </div>
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <Snowflake className="text-cyan-600 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions?.length ? (
                  recentTransactions.slice(0, 5).map((transaction: any) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{transaction.transactionId}</p>
                        <p className="text-sm text-gray-500">{transaction.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${transaction.creditAmount}</p>
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No transactions found</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-3" />
              New Transaction
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <UserPlus className="w-4 h-4 mr-3" />
              Add Customer
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Box className="w-4 h-4 mr-3" />
              Stock Update
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-3" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert & Cold Storage Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Low Stock Alerts</CardTitle>
              <Badge variant="destructive">
                {lowStockItems?.length || 0} Items
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {lowStockLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockItems?.length ? (
                  lowStockItems.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="text-red-600 w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.itemName}</p>
                          <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600">{item.currentStock}</p>
                        <p className="text-xs text-gray-500">units left</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">All items are well stocked</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cold Storage Status */}
        <Card>
          <CardHeader>
            <CardTitle>Cold Storage Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Temperature</span>
                <span className="text-sm text-gray-500">-18°C</span>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Optimal range: -20°C to -15°C</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Humidity</span>
                <span className="text-sm text-gray-500">85%</span>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Optimal range: 80% - 90%</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Storage Capacity</span>
                <span className="text-sm text-gray-500">89%</span>
              </div>
              <Progress value={89} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">2,847 / 3,200 cubic meters</p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h4>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-gray-600">
                  <Plus className="text-green-500 mr-2 w-3 h-3" />
                  500kg Frozen Vegetables added
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <AlertTriangle className="text-red-500 mr-2 w-3 h-3" />
                  200kg Frozen Meat removed
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
