import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Search, Filter, Edit, Trash2, Snowflake, ArrowDown, ArrowUp, Thermometer } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertColdStorageTransactionSchema, type InsertColdStorageTransaction, type ColdStorageTransaction } from "@shared/schema";

const TRANSACTION_TYPES = ["IN", "OUT"];

export default function ColdStorageTransactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<ColdStorageTransaction | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const { data: coldStorageTransactions, isLoading } = useQuery({
    queryKey: ["/api/cold-storage-transactions"],
  });

  const { data: coldStorageUnits } = useQuery({
    queryKey: ["/api/cold-storage-units"],
  });

  const { data: inventoryItems } = useQuery({
    queryKey: ["/api/inventory-masters"],
  });

  const form = useForm<InsertColdStorageTransaction>({
    resolver: zodResolver(insertColdStorageTransactionSchema),
    defaultValues: {
      transactionNumber: "",
      unitId: "",
      itemId: "",
      transactionType: "",
      quantity: 0,
      temperature: "0.0",
      entryDate: "",
      exitDate: "",
      description: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertColdStorageTransaction) => apiRequest("POST", "/api/cold-storage-transactions", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cold-storage-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cold-storage-units"] });
      toast({
        title: "Success",
        description: "Cold storage transaction created successfully",
      });
      setIsFormOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create cold storage transaction",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertColdStorageTransaction) => 
      apiRequest("PUT", `/api/cold-storage-transactions/${selectedTransaction!.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cold-storage-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cold-storage-units"] });
      toast({
        title: "Success",
        description: "Cold storage transaction updated successfully",
      });
      setIsFormOpen(false);
      setSelectedTransaction(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update cold storage transaction",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/cold-storage-transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cold-storage-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cold-storage-units"] });
      toast({
        title: "Success",
        description: "Cold storage transaction deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete cold storage transaction",
        variant: "destructive",
      });
    },
  });

  const filteredTransactions = coldStorageTransactions?.filter((transaction: ColdStorageTransaction) =>
    transaction.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEdit = (transaction: ColdStorageTransaction) => {
    setSelectedTransaction(transaction);
    form.reset({
      transactionNumber: transaction.transactionNumber,
      unitId: transaction.unitId,
      itemId: transaction.itemId,
      transactionType: transaction.transactionType,
      quantity: transaction.quantity,
      temperature: transaction.temperature || "0.0",
      entryDate: transaction.entryDate || "",
      exitDate: transaction.exitDate || "",
      description: transaction.description || "",
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this cold storage transaction?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCreateNew = () => {
    setSelectedTransaction(null);
    form.reset();
    setIsFormOpen(true);
  };

  const onSubmit = (data: InsertColdStorageTransaction) => {
    if (selectedTransaction) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "IN":
        return <ArrowDown className="h-4 w-4 text-blue-600" />;
      case "OUT":
        return <ArrowUp className="h-4 w-4 text-orange-600" />;
      default:
        return <Snowflake className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionBadgeVariant = (type: string) => {
    switch (type) {
      case "IN":
        return "default";
      case "OUT":
        return "secondary";
      default:
        return "outline";
    }
  };

  const totalInQuantity = coldStorageTransactions?.filter((t: ColdStorageTransaction) => t.transactionType === "IN")
    .reduce((sum: number, t: ColdStorageTransaction) => sum + t.quantity, 0) || 0;

  const totalOutQuantity = coldStorageTransactions?.filter((t: ColdStorageTransaction) => t.transactionType === "OUT")
    .reduce((sum: number, t: ColdStorageTransaction) => sum + t.quantity, 0) || 0;

  const activeTransactions = coldStorageTransactions?.filter((t: ColdStorageTransaction) => 
    t.transactionType === "IN" && !t.exitDate).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cold Storage Transactions</h1>
          <p className="text-gray-600">Manage cold storage entries, exits, and temperature monitoring</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedTransaction ? "Edit Cold Storage Transaction" : "Add New Cold Storage Transaction"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="transactionNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transaction Number *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter transaction number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="transactionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transaction Type *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select transaction type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TRANSACTION_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type === "IN" ? "Storage In" : "Storage Out"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="unitId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cold Storage Unit *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select storage unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {coldStorageUnits?.map((unit: any) => (
                              <SelectItem key={unit.id} value={unit.id}>
                                {unit.unitName} ({unit.unitCode})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="itemId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {inventoryItems?.map((item: any) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.itemName} ({item.itemCode})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity *</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="0" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temperature (°C)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.1" placeholder="0.0" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="entryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entry Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="exitDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exit Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Enter transaction description" rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : selectedTransaction ? "Update Transaction" : "Save Transaction"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Snowflake className="text-blue-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{coldStorageTransactions?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ArrowDown className="text-blue-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Items Stored</p>
                <p className="text-2xl font-bold text-gray-900">{totalInQuantity}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <ArrowUp className="text-orange-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Items Retrieved</p>
                <p className="text-2xl font-bold text-gray-900">{totalOutQuantity}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Thermometer className="text-green-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Storage</p>
                <p className="text-2xl font-bold text-gray-900">{activeTransactions}</p>
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
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cold Storage Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cold Storage Transactions ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading transactions...</div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <Snowflake className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {coldStorageTransactions?.length === 0 
                  ? "Get started by creating your first cold storage transaction."
                  : "Try adjusting your search criteria."
                }
              </p>
              {coldStorageTransactions?.length === 0 && (
                <div className="mt-6">
                  <Button onClick={handleCreateNew}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Transaction
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 table-hover">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Storage Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Temperature
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction: ColdStorageTransaction) => {
                    const unit = coldStorageUnits?.find((unit: any) => unit.id === transaction.unitId);
                    const item = inventoryItems?.find((item: any) => item.id === transaction.itemId);
                    const isActive = transaction.transactionType === "IN" && !transaction.exitDate;
                    
                    return (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{transaction.transactionNumber}</div>
                            <div className="text-sm text-gray-500">{transaction.description || "No description"}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getTransactionIcon(transaction.transactionType)}
                            <Badge variant={getTransactionBadgeVariant(transaction.transactionType)}>
                              {transaction.transactionType === "IN" ? "Storage In" : "Storage Out"}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{unit?.unitName || "Unknown Unit"}</div>
                          <div className="text-sm text-gray-500">{unit?.unitCode || transaction.unitId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item?.itemName || "Unknown Item"}</div>
                          <div className="text-sm text-gray-500">{item?.itemCode || transaction.itemId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.quantity} {item?.unit || "units"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Thermometer className="h-4 w-4 text-blue-500 mr-1" />
                            <span className="text-sm text-gray-900">
                              {parseFloat(transaction.temperature || "0").toFixed(1)}°C
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={isActive ? "default" : "secondary"}>
                            {isActive ? "In Storage" : "Completed"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(transaction)}
                            className="text-primary hover:text-primary/80"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(transaction.id)}
                            className="text-red-600 hover:text-red-800 ml-2"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
