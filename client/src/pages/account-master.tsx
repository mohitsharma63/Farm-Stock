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
import { Plus, Edit, Trash2, Database } from "lucide-react";
import type { AccountMaster, InsertAccountMaster } from "@shared/schema";

const accountTypes = ["Asset", "Liability", "Income", "Expense"];

export default function AccountMasterPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountMaster | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");
  const { toast } = useToast();

  const { data: accounts, isLoading } = useQuery<AccountMaster[]>({
    queryKey: ["/api/account-master"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertAccountMaster) => {
      const response = await apiRequest("POST", "/api/account-master", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/account-master"] });
      setDialogOpen(false);
      setSelectedType("");
      toast({ title: "Account created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create account", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertAccountMaster> }) => {
      const response = await apiRequest("PUT", `/api/account-master/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/account-master"] });
      setDialogOpen(false);
      setEditingAccount(null);
      setSelectedType("");
      toast({ title: "Account updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update account", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/account-master/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/account-master"] });
      toast({ title: "Account deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete account", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: InsertAccountMaster = {
      accountCode: formData.get("accountCode") as string,
      accountName: formData.get("accountName") as string,
      accountType: selectedType,
      parentAccountId: formData.get("parentAccountId") ? parseInt(formData.get("parentAccountId") as string) : null,
      description: formData.get("description") as string || null,
      isActive: true,
    };

    if (editingAccount) {
      updateMutation.mutate({ id: editingAccount.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (account: AccountMaster) => {
    setEditingAccount(account);
    setSelectedType(account.accountType);
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this account?")) {
      deleteMutation.mutate(id);
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "Asset": return "bg-green-100 text-green-800";
      case "Liability": return "bg-red-100 text-red-800";
      case "Income": return "bg-blue-100 text-blue-800";
      case "Expense": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Master</h1>
          <p className="text-gray-500">Manage your chart of accounts</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingAccount(null); setSelectedType(""); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAccount ? "Edit Account" : "Add New Account"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="accountCode">Account Code</Label>
                <Input
                  id="accountCode"
                  name="accountCode"
                  defaultValue={editingAccount?.accountCode || ""}
                  placeholder="e.g., 1000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  name="accountName"
                  defaultValue={editingAccount?.accountName || ""}
                  placeholder="e.g., Cash"
                  required
                />
              </div>
              <div>
                <Label htmlFor="accountType">Account Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="parentAccountId">Parent Account ID (Optional)</Label>
                <Input
                  id="parentAccountId"
                  name="parentAccountId"
                  type="number"
                  defaultValue={editingAccount?.parentAccountId || ""}
                  placeholder="Leave empty for top-level account"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingAccount?.description || ""}
                  placeholder="Account description"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1"
                >
                  {editingAccount ? "Update" : "Create"} Account
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
            <Database className="w-5 h-5 mr-2" />
            Chart of Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading accounts...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Parent ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts?.length ? (
                  accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.accountCode}</TableCell>
                      <TableCell>{account.accountName}</TableCell>
                      <TableCell>
                        <Badge className={getAccountTypeColor(account.accountType)}>
                          {account.accountType}
                        </Badge>
                      </TableCell>
                      <TableCell>{account.parentAccountId || "-"}</TableCell>
                      <TableCell>{account.description || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={account.isActive ? "default" : "secondary"}>
                          {account.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(account)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(account.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No accounts found. Add your first account to get started.
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
