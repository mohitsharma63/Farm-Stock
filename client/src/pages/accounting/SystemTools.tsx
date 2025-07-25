import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Database, 
  Search, 
  Calendar, 
  Settings, 
  RefreshCw, 
  Archive, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2
} from "lucide-react";

interface SystemTask {
  id: string;
  name: string;
  description: string;
  type: "maintenance" | "process" | "utility";
  status: "idle" | "running" | "completed" | "error";
  lastRun?: Date;
  icon: React.ComponentType<any>;
}

const systemTasks: SystemTask[] = [
  {
    id: "working-data",
    name: "Working Data Backup",
    description: "Backup current working data and transaction files",
    type: "maintenance",
    status: "idle",
    lastRun: new Date("2024-03-25"),
    icon: Database
  },
  {
    id: "search-voucher",
    name: "Search Voucher",
    description: "Search and locate specific vouchers and transactions",
    type: "utility",
    status: "idle",
    icon: Search
  },
  {
    id: "year-end-process",
    name: "Year End Process",
    description: "Execute year-end closing procedures and archival",
    type: "process",
    status: "idle",
    lastRun: new Date("2023-12-31"),
    icon: Calendar
  },
  {
    id: "data-verification",
    name: "Data Verification",
    description: "Verify data integrity and account balances",
    type: "maintenance",
    status: "completed",
    lastRun: new Date("2024-03-30"),
    icon: CheckCircle
  },
  {
    id: "archive-old-data",
    name: "Archive Old Data",
    description: "Archive transactions older than specified period",
    type: "maintenance",
    status: "idle",
    lastRun: new Date("2024-03-01"),
    icon: Archive
  },
  {
    id: "reindex-accounts",
    name: "Reindex Accounts",
    description: "Rebuild account indexes for optimal performance",
    type: "maintenance",
    status: "idle",
    lastRun: new Date("2024-03-20"),
    icon: RefreshCw
  }
];

export default function SystemTools() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState<SystemTask | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [voucherSearch, setVoucherSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Settings className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      idle: "secondary" as const,
      running: "default" as const,
      completed: "default" as const,
      error: "destructive" as const,
    };
    return variants[status as keyof typeof variants] || "secondary";
  };

  const handleRunTask = (task: SystemTask) => {
    console.log(`Running task: ${task.name}`);
    // Implement task execution logic
  };

  const handleSearchVoucher = () => {
    // Mock search results
    const mockResults = [
      {
        id: "V001",
        number: "VCH-2024-001",
        date: "2024-03-30",
        amount: "1,250.00",
        description: "Purchase of office supplies"
      },
      {
        id: "V002",
        number: "VCH-2024-002",
        date: "2024-03-29",
        amount: "2,500.00",
        description: "Payment to supplier"
      }
    ];
    setSearchResults(mockResults);
  };

  const filteredTasks = systemTasks.filter(task =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Tools</h1>
          <p className="text-gray-600">Manage system maintenance, data processing, and utilities</p>
        </div>
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Status
        </Button>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="text-blue-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">System Status</p>
                <p className="text-2xl font-bold text-green-600">Healthy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {systemTasks.filter(task => task.status === "completed").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="text-orange-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {systemTasks.filter(task => task.status === "idle").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Settings className="text-purple-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tools</p>
                <p className="text-2xl font-bold text-gray-900">{systemTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-20 flex flex-col">
                  <Search className="h-6 w-6 mb-2" />
                  <span className="text-sm">Search Voucher</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Search Voucher</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter voucher number, amount, or description..."
                      value={voucherSearch}
                      onChange={(e) => setVoucherSearch(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleSearchVoucher}>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                  
                  {searchResults.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Search Results:</h4>
                      {searchResults.map((result) => (
                        <div key={result.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{result.number}</p>
                              <p className="text-sm text-gray-600">{result.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${result.amount}</p>
                              <p className="text-sm text-gray-500">{result.date}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="h-20 flex flex-col">
              <Database className="h-6 w-6 mb-2" />
              <span className="text-sm">Backup Data</span>
            </Button>

            <Button variant="outline" className="h-20 flex flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              <span className="text-sm">Year End Process</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Tasks */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search system tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* System Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>System Tools ({filteredTasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTasks.map((task) => {
              const IconComponent = task.icon;
              return (
                <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <IconComponent className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{task.name}</h3>
                        <Badge variant={getStatusBadge(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      {task.lastRun && (
                        <p className="text-xs text-gray-500 mt-1">
                          Last run: {task.lastRun.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(task.status)}
                    <Button
                      size="sm"
                      onClick={() => handleRunTask(task)}
                      disabled={task.status === "running"}
                    >
                      {task.status === "running" ? "Running..." : "Run"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <div className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Maintenance Required:</strong> Last data backup was performed 5 days ago. 
            Consider running a backup to ensure data safety.
          </AlertDescription>
        </Alert>

        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>System Status:</strong> All critical processes are running normally. 
            Data integrity check completed successfully.
          </AlertDescription>
        </Alert>
      </div>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Archive Options</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Archive className="h-4 w-4 mr-2" />
                  Archive Transactions (6 months+)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Archive className="h-4 w-4 mr-2" />
                  Archive Closed Accounts
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clean Temporary Files
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Maintenance Tools</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Rebuild Indexes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify Data Integrity
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate System Report
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
