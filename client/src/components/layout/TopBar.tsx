import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, Search, Bell, Home } from "lucide-react";
import { useLocation } from "wouter";

interface TopBarProps {
  onMenuClick: () => void;
}

const getBreadcrumbFromPath = (path: string) => {
  const pathSegments = path.split('/').filter(Boolean);
  
  if (path === '/' || path === '/dashboard') {
    return [{ label: 'Dashboard', icon: Home }];
  }
  
  const breadcrumbMap: Record<string, string> = {
    'company': 'Company Management',
    'master': 'Master Data',
    'accounting': 'Accounting',
    'crates': 'Crates Management',
    'inventory': 'Inventory',
    'coldstorage': 'Cold Storage',
    'housekeeping': 'House Keeping',
    'accounts': 'Account Master',
    'descriptions': 'Descriptions',
    'transactions': 'Transactions',
    'reports': 'Reports',
    'system': 'System Tools',
    'customers': 'Customers',
    'suppliers': 'Suppliers',
    'stock': 'Stock Management',
    'carrots': 'Carrot Accounts',
    'backup': 'Backup',
    'parameters': 'Parameters',
    'upgrade': 'Upgrade'
  };
  
  return pathSegments.map(segment => ({
    label: breadcrumbMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
    icon: Home
  }));
};

export default function TopBar({ onMenuClick }: TopBarProps) {
  const [location] = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const breadcrumbs = getBreadcrumbFromPath(location);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Home className="h-4 w-4" />
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center space-x-2">
              {index > 0 && <span>/</span>}
              <span className={index === breadcrumbs.length - 1 ? "text-gray-900 font-medium" : ""}>
                {crumb.label}
              </span>
            </div>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="bg-gray-100 border-0 pl-10 pr-4 py-2 text-sm focus:bg-white w-64"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-2 w-2 p-0 bg-red-500" />
          </Button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">JD</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
