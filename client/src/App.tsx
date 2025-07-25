import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import CompanyManagement from "@/pages/company/CompanyManagement";
import AccountMaster from "@/pages/master/AccountMaster";
import InventoryMaster from "@/pages/master/InventoryMaster";
import Descriptions from "@/pages/master/Descriptions";
import Transactions from "@/pages/accounting/Transactions";
import Reports from "@/pages/accounting/Reports";
import SystemTools from "@/pages/accounting/SystemTools";
import Customers from "@/pages/crates/Customers";
import Suppliers from "@/pages/crates/Suppliers";
import StockManagement from "@/pages/inventory/StockManagement";
import CarrotAccounts from "@/pages/inventory/CarrotAccounts";
import InventoryReports from "@/pages/inventory/InventoryReports";
import ColdStorageTransactions from "@/pages/coldstorage/ColdStorageTransactions";
import ColdStorageReports from "@/pages/coldstorage/ColdStorageReports";
import Backup from "@/pages/housekeeping/Backup";
import Parameters from "@/pages/housekeeping/Parameters";
import Upgrade from "@/pages/housekeeping/Upgrade";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        
        {/* Company Management */}
        <Route path="/company" component={CompanyManagement} />
        
        {/* Master Data */}
        <Route path="/master/accounts" component={AccountMaster} />
        <Route path="/master/inventory" component={InventoryMaster} />
        <Route path="/master/descriptions" component={Descriptions} />
        
        {/* Accounting */}
        <Route path="/accounting/transactions" component={Transactions} />
        <Route path="/accounting/reports" component={Reports} />
        <Route path="/accounting/system" component={SystemTools} />
        
        {/* Crates */}
        <Route path="/crates/customers" component={Customers} />
        <Route path="/crates/suppliers" component={Suppliers} />
        
        {/* Inventory */}
        <Route path="/inventory/stock" component={StockManagement} />
        <Route path="/inventory/carrots" component={CarrotAccounts} />
        <Route path="/inventory/reports" component={InventoryReports} />
        
        {/* Cold Storage */}
        <Route path="/coldstorage/transactions" component={ColdStorageTransactions} />
        <Route path="/coldstorage/reports" component={ColdStorageReports} />
        
        {/* House Keeping */}
        <Route path="/housekeeping/backup" component={Backup} />
        <Route path="/housekeeping/parameters" component={Parameters} />
        <Route path="/housekeeping/upgrade" component={Upgrade} />
        
        {/* Fallback to 404 */}
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
