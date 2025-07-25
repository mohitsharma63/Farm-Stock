import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Calculator, DollarSign } from "lucide-react";
import type { AccountingTransaction, InsertAccountingTransaction, AccountMaster } from "@shared/schema";

export default function AccountingPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [transactionType, setTransactionType] = useState<"debit" | "credit">("debit");
  const { toast } = useToast();

  const { data: transactions, isLoading: transactionsLoading } = useQuery<AccountingTransaction[]>({
    queryKey: ["/api/accounting-transactions"],
  });

  const { data: accounts } = useQuery<AccountMaster[]>({
    queryKey: ["/api/account-master"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertAccountingTransaction) => {
      const response = await apiRequest("POST", "/api/accounting-transactions", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounting-transactions"] });
      setDialogOpen(false);
      setSelectedAccount("");
      setTransactionType("debit");
      toast({ title: "Transaction created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create transaction", variant: "destructive" });
    },
  });

  const generateTransactionId = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TXN-${year}${month}${day}-${random}`;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const amount = parseFloat(formData.get("amount") as string);
    
    const data: InsertAccountingTransaction = {
      transactionId: generateTransactionId(),
      date: new Date(),
      accountId: parseInt(selectedAccount),
      description: formData.get("description") as string,
      debitAmount: transactionType === "debit" ? amount.toString() : "0",
      creditAmount: transactionType === "credit" ? amount.toString() : "0",
      referenceType: formData.get("referenceType") as string || null,
      referenceId: formData.get("referenceId") as string || null,
    };

    createMutation.mutate(data);
  };

  const getAccountName = (accountId: number) => {
    const account = accounts?.find(acc => acc.id === accountId);
    return account ? `${account.accountCode} - ${account.accountName}` : `Account ID: ${accountId}`;
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString();
  };

  const totalDebits = transactions?.reduce((sum, t) => sum + parseFloat(t.debitAmount), 0) || 0;
  const totalCredits = transactions?.reduce((sum, t) => sum + parseFloat(t.creditAmount), 0) || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounting Transactions</h1>
          <p className="text-gray-500">Manage your financial transactions and journal entries</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setSelectedAccount(""); setTransactionType("debit"); }}>
              <Plus className="w-4 h-4 mr-2" />
              New Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Transaction</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="account">Account</Label>
                <Select value={selectedAccount} onValueChange={setSelectedAccount} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts?.map((account) => (
                      <SelectItem key={account.id} value={account.id.toString()}>
                        {account.accountCode} - {account.accountName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Transaction Type</Label>
                <Select value={transactionType} onValueChange={(value: "debit" | "credit") => setTransactionType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debit">Debit</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Transaction description"
                  required
                />
              </div>
              <div>
                <Label htmlFor="referenceType">Reference Type (Optional)</Label>
                <Input
                  id="referenceType"
                  name="referenceType"
                  placeholder="e.g., Sale, Purchase, Journal"
                />
              </div>
              <div>
                <Label htmlFor="referenceId">Reference ID (Optional)</Label>
                <Input
                  id="referenceId"
                  name="referenceId"
                  placeholder="Reference document ID"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1"
                >
                  Create Transaction
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
                <p className="text-sm font-medium text-gray-600">Total Debits</p>
                <p className="text-2xl font-bold text-gray-900">${totalDebits.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Credits</p>
                <p className="text-2xl font-bold text-gray-900">${totalCredits.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Balance</p>
                <p className={`text-2xl font-bold ${totalCredits - totalDebits >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(totalCredits - totalDebits).toFixed(2)}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calculator className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Transaction Journal
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
                  <TableHead>Account</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Debit</TableHead>
                  <TableHead>Credit</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.length ? (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.transactionId}</TableCell>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>{getAccountName(transaction.accountId)}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className="text-red-600">
                        {parseFloat(transaction.debitAmount) > 0 ? `$${transaction.debitAmount}` : "-"}
                      </TableCell>
                      <TableCell className="text-green-600">
                        {parseFloat(transaction.creditAmount) > 0 ? `$${transaction.creditAmount}` : "-"}
                      </TableCell>
                      <TableCell>
                        {transaction.referenceType && transaction.referenceId
                          ? `${transaction.referenceType}: ${transaction.referenceId}`
                          : "-"
                        }
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No transactions found. Create your first transaction to get started.
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
