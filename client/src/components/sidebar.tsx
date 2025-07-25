import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Building,
  Database,
  Boxes,
  Calculator,
  ChartLine,
  Users,
  Truck,
  Group,
  Snowflake,
  Settings,
  Shield,
  ChartColumn,
  Warehouse
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: ChartColumn,
  },
  {
    category: "Company",
    items: [
      {
        name: "Company Management",
        href: "/company",
        icon: Building,
      },
    ],
  },
  {
    category: "Master Data",
    items: [
      {
        name: "Account Master",
        href: "/account-master",
        icon: Database,
      },
      {
        name: "Inventory Master",
        href: "/inventory-master",
        icon: Boxes,
      },
    ],
  },
  {
    category: "Accounting",
    items: [
      {
        name: "Transactions",
        href: "/accounting",
        icon: Calculator,
      },
      {
        name: "Reports",
        href: "/accounting/reports",
        icon: ChartLine,
      },
    ],
  },
  {
    category: "Crates",
    items: [
      {
        name: "Customers",
        href: "/customers",
        icon: Users,
      },
      {
        name: "Suppliers",
        href: "/suppliers",
        icon: Truck,
      },
    ],
  },
  {
    category: "Inventory",
    items: [
      {
        name: "Stock Management",
        href: "/inventory",
        icon: Group,
      },
      {
        name: "Cold Storage",
        href: "/cold-storage",
        icon: Snowflake,
      },
    ],
  },
  {
    category: "System",
    items: [
      {
        name: "Settings",
        href: "/settings",
        icon: Settings,
      },
      {
        name: "User Management",
        href: "/user-management",
        icon: Shield,
      },
    ],
  },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Warehouse className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">BizManager</h1>
            <p className="text-sm text-gray-500">Enterprise System</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-4 space-y-2">
          {navigation.map((item, index) => {
            if ("href" in item) {
              // Single navigation item (Dashboard)
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <div key={index} className="mb-6">
                  <Link href={item.href || "/"} className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium",
                    isActive 
                      ? "text-primary bg-primary/10" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}>
                    {Icon && <Icon className="w-5 h-5" />}
                    <span>{item.name}</span>
                  </Link>
                </div>
              );
            } else {
              // Category with items
              return (
                <div key={index} className="mb-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">
                    {item.category}
                  </h3>
                  {item.items.map((subItem) => {
                    const Icon = subItem.icon;
                    const isActive = location === subItem.href;
                    
                    return (
                      <Link key={subItem.href} href={subItem.href} className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                        isActive 
                          ? "text-primary bg-primary/10" 
                          : "text-gray-700 hover:bg-gray-100"
                      )}>
                        {Icon && <Icon className="w-5 h-5" />}
                        <span>{subItem.name}</span>
                      </Link>
                    );
                  })}
                </div>
              );
            }
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <Users className="text-gray-600 w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Administrator</p>
            <p className="text-xs text-gray-500">System Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
