import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Building, 
  Database, 
  Calculator, 
  Package, 
  ClipboardList, 
  Snowflake, 
  Settings,
  Home,
  ChevronRight,
  Warehouse
} from "lucide-react";
import { NavigationItem } from "@/types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "Home",
    path: "/dashboard"
  },
  {
    id: "company",
    label: "Company Management",
    icon: "Building",
    children: [
      { id: "company-create", label: "Create Company", icon: "", path: "/company" },
      { id: "company-manage", label: "Manage Companies", icon: "", path: "/company" }
    ]
  },
  {
    id: "master",
    label: "Master Data",
    icon: "Database",
    children: [
      { id: "master-accounts", label: "Account Master", icon: "", path: "/master/accounts" },
      { id: "master-inventory", label: "Inventory Master", icon: "", path: "/master/inventory" },
      { id: "master-descriptions", label: "Descriptions", icon: "", path: "/master/descriptions" }
    ]
  },
  {
    id: "accounting",
    label: "Accounting",
    icon: "Calculator",
    children: [
      { id: "accounting-transactions", label: "Transactions", icon: "", path: "/accounting/transactions" },
      { id: "accounting-reports", label: "Reports", icon: "", path: "/accounting/reports" },
      { id: "accounting-system", label: "System Tools", icon: "", path: "/accounting/system" }
    ]
  },
  {
    id: "crates",
    label: "Crates Management",
    icon: "Package",
    children: [
      { id: "crates-customers", label: "Customers", icon: "", path: "/crates/customers" },
      { id: "crates-suppliers", label: "Suppliers", icon: "", path: "/crates/suppliers" }
    ]
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: "ClipboardList",
    children: [
      { id: "inventory-stock", label: "Stock Management", icon: "", path: "/inventory/stock" },
      { id: "inventory-carrots", label: "Carrot Accounts", icon: "", path: "/inventory/carrots" },
      { id: "inventory-reports", label: "Reports", icon: "", path: "/inventory/reports" }
    ]
  },
  {
    id: "coldstorage",
    label: "Cold Storage",
    icon: "Snowflake",
    children: [
      { id: "coldstorage-transactions", label: "Transactions", icon: "", path: "/coldstorage/transactions" },
      { id: "coldstorage-reports", label: "Reports", icon: "", path: "/coldstorage/reports" }
    ]
  },
  {
    id: "housekeeping",
    label: "House Keeping",
    icon: "Settings",
    children: [
      { id: "housekeeping-backup", label: "Backup", icon: "", path: "/housekeeping/backup" },
      { id: "housekeeping-parameters", label: "Parameters", icon: "", path: "/housekeeping/parameters" },
      { id: "housekeeping-upgrade", label: "Upgrade", icon: "", path: "/housekeeping/upgrade" }
    ]
  }
];

const getIcon = (iconName: string) => {
  const icons = {
    Home,
    Building,
    Database,
    Calculator,
    Package,
    ClipboardList,
    Snowflake,
    Settings,
    Warehouse
  };
  const IconComponent = icons[iconName as keyof typeof icons];
  return IconComponent || Home;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const isMobile = useIsMobile();

  const isActiveLink = (path?: string) => {
    if (!path) return false;
    if (path === "/dashboard" && location === "/") return true;
    return location === path;
  };

  const hasActiveChild = (item: NavigationItem) => {
    if (!item.children) return false;
    return item.children.some(child => isActiveLink(child.path));
  };

  return (
    <>
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:transform-none",
        isOpen || !isMobile ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0 px-6 py-5 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Warehouse className="text-primary-foreground text-lg" />
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-semibold text-gray-900">InvenTrack</h2>
                <p className="text-xs text-gray-500">Enterprise Suite</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
            {navigationItems.map((item) => (
              <div key={item.id} className="space-y-1">
                {item.path ? (
                  <Link
                    to={item.path}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActiveLink(item.path)
                        ? "bg-primary/10 border-r-2 border-primary text-primary"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    onClick={isMobile ? onClose : undefined}
                  >
                    {(() => {
                      const IconComponent = getIcon(item.icon);
                      return <IconComponent className="mr-3 h-5 w-5" />;
                    })()}
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <div className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-default",
                      hasActiveChild(item)
                        ? "bg-primary/5 text-primary"
                        : "text-gray-700"
                    )}>
                      {(() => {
                        const IconComponent = getIcon(item.icon);
                        return <IconComponent className="mr-3 h-5 w-5" />;
                      })()}
                      {item.label}
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </div>
                    {item.children && (
                      <div className="ml-6 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            to={child.path || "#"}
                            className={cn(
                              "group flex items-center px-3 py-2 text-xs rounded-md transition-colors",
                              isActiveLink(child.path)
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                            onClick={isMobile ? onClose : undefined}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
