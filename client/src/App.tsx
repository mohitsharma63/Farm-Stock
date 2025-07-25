import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import Company from "@/pages/company";
import AccountMaster from "@/pages/account-master";
import InventoryMaster from "@/pages/inventory-master";
import Accounting from "@/pages/accounting";
import Customers from "@/pages/customers";
import Suppliers from "@/pages/suppliers";
import Inventory from "@/pages/inventory";
import ColdStorage from "@/pages/cold-storage";
import UserManagement from "@/pages/user-management";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/company" component={Company} />
        <Route path="/account-master" component={AccountMaster} />
        <Route path="/inventory-master" component={InventoryMaster} />
        <Route path="/accounting" component={Accounting} />
        <Route path="/customers" component={Customers} />
        <Route path="/suppliers" component={Suppliers} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/cold-storage" component={ColdStorage} />
        <Route path="/user-management" component={UserManagement} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
