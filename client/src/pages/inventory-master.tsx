import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Package, AlertTriangle } from "lucide-react";
import type { InventoryMaster, InsertInventoryMaster } from "@shared/schema";

export default function InventoryMasterPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryMaster | null>(null);
  const { toast } = useToast();

  const { data: items, isLoading } = useQuery<InventoryMaster[]>({
    queryKey: ["/api/inventory-master"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertInventoryMaster) => {
      const response = await apiRequest("POST", "/api/inventory-master", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory-master"] });
      setDialogOpen(false);
      toast({ title: "Inventory item created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create inventory item", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertInventoryMaster> }) => {
      const response = await apiRequest("PUT", `/api/inventory-master/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory-master"] });
      setDialogOpen(false);
      setEditingItem(null);
      toast({ title: "Inventory item updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update inventory item", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/inventory-master/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory-master"] });
      toast({ title: "Inventory item deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete inventory item", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: InsertInventoryMaster = {
      sku: formData.get("sku") as string,
      itemName: formData.get("itemName") as string,
      description: formData.get("description") as string || null,
      category: formData.get("category") as string,
      unit: formData.get("unit") as string,
      minimumStock: parseInt(formData.get("minimumStock") as string),
      maximumStock: parseInt(formData.get("maximumStock") as string),
      currentStock: parseInt(formData.get("currentStock") as string),
      unitPrice: formData.get("unitPrice") as string,
      isActive: true,
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (item: InventoryMaster) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this inventory item?")) {
      deleteMutation.mutate(id);
    }
  };

  const getStockStatus = (item: InventoryMaster) => {
    if (item.currentStock <= item.minimumStock) {
      return { status: "Low Stock", variant: "destructive" as const, icon: AlertTriangle };
    }
    if (item.currentStock >= item.maximumStock) {
      return { status: "Overstock", variant: "secondary" as const, icon: AlertTriangle };
    }
    return { status: "Normal", variant: "default" as const, icon: Package };
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Master</h1>
          <p className="text-gray-500">Manage your inventory items and stock levels</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Inventory Item" : "Add New Inventory Item"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    name="sku"
                    defaultValue={editingItem?.sku || ""}
                    placeholder="e.g., APL-001"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input
                    id="itemName"
                    name="itemName"
                    defaultValue={editingItem?.itemName || ""}
                    placeholder="e.g., Organic Apples"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingItem?.description || ""}
                  placeholder="Item description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    defaultValue={editingItem?.category || ""}
                    placeholder="e.g., Fruits"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    name="unit"
                    defaultValue={editingItem?.unit || ""}
                    placeholder="e.g., kg"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="minimumStock">Min Stock</Label>
                  <Input
                    id="minimumStock"
                    name="minimumStock"
                    type="number"
                    defaultValue={editingItem?.minimumStock || 0}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="maximumStock">Max Stock</Label>
                  <Input
                    id="maximumStock"
                    name="maximumStock"
                    type="number"
                    defaultValue={editingItem?.maximumStock || 1000}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="currentStock">Current Stock</Label>
                  <Input
                    id="currentStock"
                    name="currentStock"
                    type="number"
                    defaultValue={editingItem?.currentStock || 0}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="unitPrice">Unit Price</Label>
                <Input
                  id="unitPrice"
                  name="unitPrice"
                  type="number"
                  step="0.01"
                  defaultValue={editingItem?.unitPrice || ""}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1"
                >
                  {editingItem ? "Update" : "Create"} Item
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Inventory Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading inventory items...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.length ? (
                  items.map((item) => {
                    const stockStatus = getStockStatus(item);
                    const StockIcon = stockStatus.icon;
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.sku}</TableCell>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{item.currentStock}</span>
                            <span className="text-sm text-gray-500">
                              ({item.minimumStock}-{item.maximumStock})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>${item.unitPrice}</TableCell>
                        <TableCell>
                          <Badge variant={stockStatus.variant} className="flex items-center w-fit">
                            <StockIcon className="w-3 h-3 mr-1" />
                            {stockStatus.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No inventory items found. Add your first item to get started.
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
