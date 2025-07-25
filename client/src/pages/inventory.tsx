import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Group, TrendingUp, TrendingDown, RotateCcw, Package } from "lucide-react";
import type { InventoryTransaction, InsertInventoryTransaction, InventoryMaster } from "@shared/schema";

const transactionTypes = ["IN", "OUT", "ADJUSTMENT"];

export default function InventoryPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const { toast } = useToast();

  const { data: transactions, isLoading: transactionsLoading } = useQuery<InventoryTransaction[]>({
    queryKey: ["/api/inventory-transactions"],
  });

  const { data: inventoryItems } = useQuery<InventoryMaster[]>({
    queryKey: ["/api/inventory-master"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertInventoryTransaction) => {
      const response = await apiRequest("POST", "/api/inventory-transactions", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory-master"] });
      setDialogOpen(false);
      setSelectedItem("");
      setSelectedType("");
      toast({ title: "Inventory transaction recorded successfully" });
    },
    onError: () => {
      toast({ title: "Failed to record inventory transaction", variant: "destructive" });
    },
  });

  const generateTransactionId = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}${day}-${random}`;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const quantity = parseInt(formData.get("quantity") as string);
    const unitPrice = parseFloat(formData.get("unitPrice") as string);
    
    const data: InsertInventoryTransaction = {
      transactionId: generateTransactionId(),
      date: new Date(),
      itemId: parseInt(selectedItem),
      transactionType: selectedType,
      quantity,
      unitPrice: unitPrice.toString(),
      totalAmount: (quantity * unitPrice).toString(),
      referenceType: formData.get("referenceType") as string || null,
      referenceId: formData.get("referenceId") as string || null,
      description: formData.get("description") as string || null,
    };

    createMutation.mutate(data);
  };

  const getItemName = (itemId: number) => {
    const item = inventoryItems?.find(i => i.id === itemId);
    return item ? `${item.sku} - ${item.itemName}` : `Item ID: ${itemId}`;
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString();
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "IN": return TrendingUp;
      case "OUT": return TrendingDown;
      case "ADJUSTMENT": return RotateCcw;
      default: return Package;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "IN": return "text-green-600";
      case "OUT": return "text-red-600";
      case "ADJUSTMENT": return "text-blue-600";
      default: return "text-gray-600";
    }
  };

  const totalInbound = transactions?.filter(t => t.transactionType === "IN").reduce((sum, t) => sum + t.quantity, 0) || 0;
  const totalOutbound = transactions?.filter(t => t.transactionType === "OUT").reduce((sum, t) => sum + t.quantity, 0) || 0;
  const totalAdjustments = transactions?.filter(t => t.transactionType === "ADJUSTMENT").length || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500">Track stock movements and inventory transactions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setSelectedItem(""); setSelectedType(""); }}>
              <Plus className="w-4 h-4 mr-2" />
              New Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Record Inventory Transaction</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="item">Item</Label>
                <Select value={selectedItem} onValueChange={setSelectedItem} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventoryItems?.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.sku} - {item.itemName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Transaction Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {transactionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type} - {type === "IN" ? "Stock In" : type === "OUT" ? "Stock Out" : "Adjustment"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unitPrice">Unit Price</Label>
                  <Input
                    id="unitPrice"
                    name="unitPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Transaction description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="referenceType">Reference Type</Label>
                  <Input
                    id="referenceType"
                    name="referenceType"
                    placeholder="e.g., Purchase Order"
                  />
                </div>
                <div>
                  <Label htmlFor="referenceId">Reference ID</Label>
                  <Input
                    id="referenceId"
                    name="referenceId"
                    placeholder="Reference number"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1"
                >
                  Record Transaction
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Inbound</p>
                <p className="text-2xl font-bold text-green-600">{totalInbound}</p>
                <p className="text-sm text-gray-500">Items received</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Outbound</p>
                <p className="text-2xl font-bold text-red-600">{totalOutbound}</p>
                <p className="text-sm text-gray-500">Items dispatched</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Adjustments</p>
                <p className="text-2xl font-bold text-blue-600">{totalAdjustments}</p>
                <p className="text-sm text-gray-500">Stock adjustments</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <RotateCcw className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Group className="w-5 h-5 mr-2" />
            Inventory Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="text-center py-8">Loading transactions...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.length ? (
                  transactions.map((transaction) => {
                    const TransactionIcon = getTransactionIcon(transaction.transactionType);
                    const colorClass = getTransactionColor(transaction.transactionType);
                    
                    return (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.transactionId}</TableCell>
                        <TableCell>{formatDate(transaction.date)}</TableCell>
                        <TableCell>{getItemName(transaction.itemId)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`flex items-center w-fit ${colorClass}`}>
                            <TransactionIcon className="w-3 h-3 mr-1" />
                            {transaction.transactionType}
                          </Badge>
                        </TableCell>
                        <TableCell className={transaction.transactionType === "OUT" ? "text-red-600" : "text-green-600"}>
                          {transaction.transactionType === "OUT" ? "-" : "+"}{transaction.quantity}
                        </TableCell>
                        <TableCell>${transaction.unitPrice}</TableCell>
                        <TableCell>${transaction.totalAmount}</TableCell>
                        <TableCell>
                          {transaction.referenceType && transaction.referenceId
                            ? `${transaction.referenceType}: ${transaction.referenceId}`
                            : "-"
                          }
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No inventory transactions found. Record your first transaction to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
