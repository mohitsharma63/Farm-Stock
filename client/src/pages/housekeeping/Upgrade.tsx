import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Download, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Settings,
  RefreshCw,
  Package,
  Shield,
  Database,
  Zap,
  FileText,
  ExternalLink,
  Info
} from "lucide-react";

interface SystemUpdate {
  id: string;
  version: string;
  type: "major" | "minor" | "patch" | "security";
  status: "available" | "downloading" | "installing" | "completed" | "failed";
  progress?: number;
  size: string;
  releaseDate: Date;
  description: string;
  features: string[];
  requirements: string[];
  critical?: boolean;
}

interface UpdateHistory {
  id: string;
  version: string;
  installedDate: Date;
  type: "major" | "minor" | "patch" | "security";
  status: "success" | "failed" | "rollback";
  notes?: string;
}

const availableUpdates: SystemUpdate[] = [
  {
    id: "1",
    version: "2.2.0",
    type: "minor",
    status: "available",
    size: "145 MB",
    releaseDate: new Date("2024-04-01"),
    description: "Enhanced inventory tracking with new reporting features and performance improvements.",
    features: [
      "Advanced inventory reporting dashboard",
      "Real-time stock level monitoring",
      "Enhanced barcode scanning support",
      "Improved user interface responsiveness",
      "New audit trail functionality"
    ],
    requirements: [
      "Minimum 2GB free disk space", 
      "Database backup recommended",
      "System downtime: ~15 minutes"
    ]
  },
  {
    id: "2",
    version: "2.1.3",
    type: "security",
    status: "available",
    size: "23 MB",
    releaseDate: new Date("2024-03-28"),
    description: "Critical security patch addressing authentication vulnerabilities.",
    features: [
      "Enhanced password encryption",
      "Session security improvements",
      "API security hardening",
      "Updated dependency libraries"
    ],
    requirements: [
      "All users will be logged out",
      "Password reset may be required"
    ],
    critical: true
  },
  {
    id: "3",
    version: "2.1.2",
    type: "patch",
    status: "downloading",
    progress: 75,
    size: "12 MB",
    releaseDate: new Date("2024-03-25"),
    description: "Bug fixes and minor improvements.",
    features: [
      "Fixed inventory calculation errors",
      "Resolved email notification issues",
      "Updated report generation",
      "Performance optimizations"
    ],
    requirements: [
      "System restart required"
    ]
  }
];

const updateHistory: UpdateHistory[] = [
  {
    id: "1",
    version: "2.1.1",
    installedDate: new Date("2024-03-20"),
    type: "patch",
    status: "success",
    notes: "Successfully installed minor bug fixes"
  },
  {
    id: "2", 
    version: "2.1.0",
    installedDate: new Date("2024-03-15"),
    type: "minor",
    status: "success",
    notes: "Major feature update with cold storage management"
  },
  {
    id: "3",
    version: "2.0.5",
    installedDate: new Date("2024-03-10"),
    type: "security",
    status: "success",
    notes: "Security patches applied successfully"
  }
];

export default function Upgrade() {
  const [updates] = useState<SystemUpdate[]>(availableUpdates);
  const [history] = useState<UpdateHistory[]>(updateHistory);
  const [selectedUpdate, setSelectedUpdate] = useState<SystemUpdate | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case "major":
        return <Package className="h-4 w-4 text-purple-600" />;
      case "minor":
        return <Zap className="h-4 w-4 text-blue-600" />;
      case "patch":
        return <Settings className="h-4 w-4 text-green-600" />;
      case "security":
        return <Shield className="h-4 w-4 text-red-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <Download className="h-4 w-4 text-blue-500" />;
      case "downloading":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case "installing":
        return <RefreshCw className="h-4 w-4 text-orange-500 animate-spin" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      available: "secondary" as const,
      downloading: "default" as const,
      installing: "default" as const,
      completed: "default" as const,
      failed: "destructive" as const,
    };
    return variants[status as keyof typeof variants] || "secondary";
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      major: "destructive" as const,
      minor: "default" as const,
      patch: "secondary" as const,
      security: "destructive" as const,
    };
    return variants[type as keyof typeof variants] || "secondary";
  };

  const handleInstallUpdate = (updateId: string) => {
    console.log("Installing update:", updateId);
  };

  const handleViewDetails = (update: SystemUpdate) => {
    setSelectedUpdate(update);
    setIsDetailsOpen(true);
  };

  const availableCount = updates.filter(update => update.status === "available").length;
  const criticalCount = updates.filter(update => update.critical).length;
  const downloadingCount = updates.filter(update => update.status === "downloading").length;
  const successfulUpdates = history.filter(update => update.status === "success").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Upgrade</h1>
          <p className="text-gray-600">Manage system updates, patches, and version upgrades</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Check for Updates
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Download className="text-blue-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Updates</p>
                <p className="text-2xl font-bold text-gray-900">{availableCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="text-red-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Critical Updates</p>
                <p className="text-2xl font-bold text-gray-900">{criticalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <RefreshCw className="text-orange-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{downloadingCount}</p>
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
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-gray-900">{successfulUpdates}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Updates Alert */}
      {criticalCount > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Critical Updates Available:</strong> {criticalCount} security update(s) require immediate attention. 
            It is recommended to install these updates as soon as possible.
          </AlertDescription>
        </Alert>
      )}

      {/* Current System Information */}
      <Card>
        <CardHeader>
          <CardTitle>Current System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Package className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Current Version</p>
                  <p className="text-2xl font-bold text-blue-700">v2.1.1</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">Last Update</p>
                  <p className="text-lg font-bold text-green-700">March 20, 2024</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Database className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-800">System Health</p>
                  <p className="text-lg font-bold text-purple-700">Excellent</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Updates */}
      <Card>
        <CardHeader>
          <CardTitle>Available Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {updates.map((update) => (
              <div key={update.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    {getUpdateIcon(update.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-gray-900">Version {update.version}</h3>
                      <Badge variant={getTypeBadge(update.type)}>
                        {update.type}
                      </Badge>
                      <Badge variant={getStatusBadge(update.status)}>
                        {update.status}
                      </Badge>
                      {update.critical && (
                        <Badge variant="destructive">Critical</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{update.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Size: {update.size}</span>
                      <span>Released: {update.releaseDate.toLocaleDateString()}</span>
                    </div>
                    {update.progress !== undefined && (
                      <div className="mt-2">
                        <Progress value={update.progress} className="w-full" />
                        <p className="text-xs text-gray-500 mt-1">{update.progress}% complete</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {getStatusIcon(update.status)}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewDetails(update)}
                  >
                    <Info className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                  {update.status === "available" && (
                    <Button
                      size="sm"
                      onClick={() => handleInstallUpdate(update.id)}
                      variant={update.critical ? "default" : "outline"}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      {update.critical ? "Install Now" : "Install"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Update History */}
      <Card>
        <CardHeader>
          <CardTitle>Update History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {history.map((update, index) => (
              <div key={update.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    {update.status === "success" ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">Version {update.version}</h4>
                      <Badge variant={getTypeBadge(update.type)}>{update.type}</Badge>
                      <Badge variant={update.status === "success" ? "default" : "destructive"}>
                        {update.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Installed on {update.installedDate.toLocaleDateString()}
                    </p>
                    {update.notes && (
                      <p className="text-sm text-gray-600 mt-1">{update.notes}</p>
                    )}
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4 mr-1" />
                  View Log
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Update Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Update Details - Version {selectedUpdate?.version}
            </DialogTitle>
          </DialogHeader>
          {selectedUpdate && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Badge variant={getTypeBadge(selectedUpdate.type)}>
                  {selectedUpdate.type} Update
                </Badge>
                <Badge variant={getStatusBadge(selectedUpdate.status)}>
                  {selectedUpdate.status}
                </Badge>
                {selectedUpdate.critical && (
                  <Badge variant="destructive">Critical</Badge>
                )}
              </div>

              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-600">{selectedUpdate.description}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">What's New</h4>
                <ul className="space-y-1">
                  {selectedUpdate.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Requirements & Notes</h4>
                <ul className="space-y-1">
                  {selectedUpdate.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Release Date</p>
                  <p className="text-sm text-gray-600">{selectedUpdate.releaseDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Download Size</p>
                  <p className="text-sm text-gray-600">{selectedUpdate.size}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
                {selectedUpdate.status === "available" && (
                  <Button onClick={() => {
                    handleInstallUpdate(selectedUpdate.id);
                    setIsDetailsOpen(false);
                  }}>
                    <Download className="h-4 w-4 mr-2" />
                    Install Update
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
