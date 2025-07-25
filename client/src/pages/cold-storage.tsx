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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Snowflake, Thermometer, Droplets, MapPin, Calendar, AlertTriangle } from "lucide-react";
import type { ColdStorage, InsertColdStorage, InventoryMaster } from "@shared/schema";

const storageStatuses = ["stored", "removed", "expired"];

export default function ColdStoragePage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("stored");
  const { toast } = useToast();

  const { data: coldStorageItems, isLoading } = useQuery<ColdStorage[]>({
    queryKey: ["/api/cold-storage"],
  });

  const { data: inventoryItems } = useQuery<InventoryMaster[]>({
    queryKey: ["/api/inventory-master"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertColdStorage) => {
      const response = await apiRequest("POST", "/api/cold-storage", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cold-storage"] });
      setDialogOpen(false);
      setSelectedItem("");
      setSelectedStatus("stored");
      toast({ title: "Cold storage entry created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create cold storage entry", variant: "destructive" });
    },
  });

  const generateStorageId = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `CS${timestamp}`;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: InsertColdStorage = {
      storageId: generateStorageId(),
      itemId: parseInt(selectedItem),
      quantity: parseInt(formData.get("quantity") as string),
      temperature: formData.get("temperature") as string,
      humidity: formData.get("humidity") as string || null,
      entryDate: new Date(formData.get("entryDate") as string),
      expiryDate: formData.get("expiryDate") ? new Date(formData.get("expiryDate") as string) : null,
      location: formData.get("location") as string,
      status: selectedStatus,
    };

    createMutation.mutate(data);
  };

  const getItemName = (itemId: number) => {
    const item = inventoryItems?.find(i => i.id === itemId);
    return item ? `${item.sku} - ${item.itemName}` : `Item ID: ${itemId}`;
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "stored": return "default";
      case "removed": return "secondary";
      case "expired": return "destructive";
      default: return "secondary";
    }
  };

  const getDaysUntilExpiry = (expiryDate: string | Date | null) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const storedItems = coldStorageItems?.filter(item => item.status === "stored") || [];
  const totalCapacity = 3200; // cubic meters
  const usedCapacity = storedItems.reduce((sum, item) => sum + item.quantity, 0);
  const capacityPercentage = Math.round((usedCapacity / totalCapacity) * 100);

  const averageTemperature = storedItems.length > 0 
    ? storedItems.reduce((sum, item) => sum + parseFloat(item.temperature), 0) / storedItems.length 
    : -18;

  const averageHumidity = storedItems.length > 0 
    ? storedItems.filter(item => item.humidity).reduce((sum, item) => sum + parseFloat(item.humidity!), 0) / storedItems.filter(item => item.humidity).length
    : 85;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cold Storage Management</h1>
          <p className="text-gray-500">Monitor temperature-controlled storage and inventory</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setSelectedItem(""); setSelectedStatus("stored"); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Storage Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Cold Storage Entry</DialogTitle>
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
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    name="temperature"
                    type="number"
                    step="0.1"
                    placeholder="-18.0"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="humidity">Humidity (%)</Label>
                  <Input
                    id="humidity"
                    name="humidity"
                    type="number"
                    step="0.1"
                    placeholder="85.0"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g., Zone A-1"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="entryDate">Entry Date</Label>
                  <Input
                    id="entryDate"
                    name="entryDate"
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    type="date"
                  />
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {storageStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1"
                >
                  Add Entry
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

      {/* Monitoring Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Temperature</p>
                <p className="text-2xl font-bold text-cyan-600">{averageTemperature.toFixed(1)}°C</p>
                <p className="text-sm text-gray-500">Optimal: -20°C to -15°C</p>
              </div>
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                <Thermometer className="text-cyan-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Humidity</p>
                <p className="text-2xl font-bold text-blue-600">{averageHumidity.toFixed(1)}%</p>
                <p className="text-sm text-gray-500">Optimal: 80% - 90%</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Droplets className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Storage Capacity</p>
                <p className="text-2xl font-bold text-orange-600">{capacityPercentage}%</p>
                <div className="mt-2">
                  <Progress value={capacityPercentage} className="h-2" />
                </div>
                <p className="text-xs text-gray-500 mt-1">{usedCapacity} / {totalCapacity} units</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Items</p>
                <p className="text-2xl font-bold text-green-600">{storedItems.length}</p>
                <p className="text-sm text-gray-500">Currently stored</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Snowflake className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Snowflake className="w-5 h-5 mr-2" />
            Cold Storage Inventory
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading cold storage data...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Storage ID</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Temperature</TableHead>
                  <TableHead>Humidity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Entry Date</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coldStorageItems?.length ? (
                  coldStorageItems.map((item) => {
                    const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
                    const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry > 0;
                    const isExpired = daysUntilExpiry !== null && daysUntilExpiry <= 0;

                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.storageId}</TableCell>
                        <TableCell>{getItemName(item.itemId)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Thermometer className="w-4 h-4 mr-1 text-cyan-600" />
                            {item.temperature}°C
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.humidity ? (
                            <div className="flex items-center">
                              <Droplets className="w-4 h-4 mr-1 text-blue-600" />
                              {item.humidity}%
                            </div>
                          ) : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-gray-600" />
                            {item.location}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(item.entryDate)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{formatDate(item.expiryDate)}</span>
                            {isExpiringSoon && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                {daysUntilExpiry}d left
                              </Badge>
                            )}
                            {isExpired && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Expired
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(item.status) as any}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      No cold storage entries found. Add your first entry to get started.
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
