import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Database, 
  Download, 
  Upload, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Settings,
  RefreshCw,
  HardDrive,
  Cloud,
  FileText
} from "lucide-react";

interface BackupJob {
  id: string;
  name: string;
  type: "full" | "incremental" | "differential";
  status: "running" | "completed" | "failed" | "scheduled";
  progress?: number;
  size: string;
  startTime: Date;
  endTime?: Date;
  location: string;
}

interface BackupSchedule {
  id: string;
  name: string;
  frequency: "daily" | "weekly" | "monthly";
  type: "full" | "incremental";
  nextRun: Date;
  isActive: boolean;
}

const mockBackupJobs: BackupJob[] = [
  {
    id: "1",
    name: "Full Database Backup",
    type: "full",
    status: "completed",
    size: "2.4 GB",
    startTime: new Date("2024-03-30T02:00:00"),
    endTime: new Date("2024-03-30T02:45:00"),
    location: "Local Storage"
  },
  {
    id: "2",
    name: "Incremental Backup",
    type: "incremental",
    status: "completed",
    size: "156 MB",
    startTime: new Date("2024-03-29T23:00:00"),
    endTime: new Date("2024-03-29T23:15:00"),
    location: "Cloud Storage"
  },
  {
    id: "3",
    name: "Application Data Backup",
    type: "differential",
    status: "running",
    progress: 65,
    size: "890 MB",
    startTime: new Date(),
    location: "External Drive"
  }
];

const mockSchedules: BackupSchedule[] = [
  {
    id: "1",
    name: "Daily Incremental",
    frequency: "daily",
    type: "incremental",
    nextRun: new Date("2024-03-31T23:00:00"),
    isActive: true
  },
  {
    id: "2",
    name: "Weekly Full Backup",
    frequency: "weekly",
    type: "full",
    nextRun: new Date("2024-04-06T02:00:00"),
    isActive: true
  },
  {
    id: "3",
    name: "Monthly Archive",
    frequency: "monthly",
    type: "full",
    nextRun: new Date("2024-04-30T01:00:00"),
    isActive: false
  }
];

export default function Backup() {
  const [backupJobs] = useState<BackupJob[]>(mockBackupJobs);
  const [schedules] = useState<BackupSchedule[]>(mockSchedules);
  const [isCreateBackupOpen, setIsCreateBackupOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [backupType, setBackupType] = useState("full");
  const [backupLocation, setBackupLocation] = useState("local");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "scheduled":
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <Database className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      running: "default" as const,
      completed: "default" as const,
      failed: "destructive" as const,
      scheduled: "secondary" as const,
    };
    return variants[status as keyof typeof variants] || "secondary";
  };

  const handleCreateBackup = () => {
    console.log("Creating backup:", { backupType, backupLocation });
    setIsCreateBackupOpen(false);
  };

  const handleRestoreBackup = (backupId: string) => {
    console.log("Restoring backup:", backupId);
  };

  const completedBackups = backupJobs.filter(job => job.status === "completed").length;
  const failedBackups = backupJobs.filter(job => job.status === "failed").length;
  const runningBackups = backupJobs.filter(job => job.status === "running").length;
  const activeSchedules = schedules.filter(schedule => schedule.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Backup</h1>
          <p className="text-gray-600">Manage data backups, schedules, and restore operations</p>
        </div>
        <div className="flex space-x-3">
          <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Backup
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Backup</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Backup Name</label>
                  <Input placeholder="Enter backup name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Backup Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select backup type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Backup</SelectItem>
                      <SelectItem value="incremental">Incremental</SelectItem>
                      <SelectItem value="differential">Differential</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsScheduleOpen(false)}>
                    Create Schedule
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateBackupOpen} onOpenChange={setIsCreateBackupOpen}>
            <DialogTrigger asChild>
              <Button>
                <Database className="h-4 w-4 mr-2" />
                Create Backup
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Backup</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Backup Type</label>
                  <Select value={backupType} onValueChange={setBackupType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select backup type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Backup</SelectItem>
                      <SelectItem value="incremental">Incremental Backup</SelectItem>
                      <SelectItem value="differential">Differential Backup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Backup Location</label>
                  <Select value={backupLocation} onValueChange={setBackupLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select backup location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local Storage</SelectItem>
                      <SelectItem value="cloud">Cloud Storage</SelectItem>
                      <SelectItem value="external">External Drive</SelectItem>
                      <SelectItem value="network">Network Storage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateBackupOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateBackup}>
                    Start Backup
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="text-blue-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Backups</p>
                <p className="text-2xl font-bold text-gray-900">{backupJobs.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedBackups}</p>
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
                <p className="text-sm font-medium text-gray-600">Running</p>
                <p className="text-2xl font-bold text-gray-900">{runningBackups}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-purple-600 h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Schedules</p>
                <p className="text-2xl font-bold text-gray-900">{activeSchedules}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <div className="space-y-4">
        {runningBackups > 0 && (
          <Alert>
            <RefreshCw className="h-4 w-4" />
            <AlertDescription>
              <strong>Backup in Progress:</strong> {runningBackups} backup job(s) are currently running. 
              Please do not shut down the system until completion.
            </AlertDescription>
          </Alert>
        )}
        
        {failedBackups > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Backup Failures:</strong> {failedBackups} backup job(s) have failed. 
              Please check the logs and retry the backup operations.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Current Backup Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Backup Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {backupJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    {getStatusIcon(job.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">{job.name}</h3>
                      <Badge variant={getStatusBadge(job.status)}>
                        {job.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span>Type: {job.type}</span>
                      <span>Size: {job.size}</span>
                      <span>Location: {job.location}</span>
                    </div>
                    {job.progress !== undefined && (
                      <div className="mt-2">
                        <Progress value={job.progress} className="w-full" />
                        <p className="text-xs text-gray-500 mt-1">{job.progress}% complete</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right text-sm text-gray-500">
                    <p>Started: {job.startTime.toLocaleTimeString()}</p>
                    {job.endTime && (
                      <p>Completed: {job.endTime.toLocaleTimeString()}</p>
                    )}
                  </div>
                  {job.status === "completed" && (
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestoreBackup(job.id)}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Backup Schedules */}
      <Card>
        <CardHeader>
          <CardTitle>Backup Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="text-blue-600 h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">{schedule.name}</h3>
                      <Badge variant={schedule.isActive ? "default" : "secondary"}>
                        {schedule.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span>Frequency: {schedule.frequency}</span>
                      <span>Type: {schedule.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right text-sm text-gray-500">
                    <p>Next Run:</p> 
                    <p className="font-medium">{schedule.nextRun.toLocaleDateString()}</p>
                    <p>{schedule.nextRun.toLocaleTimeString()}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Storage Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Storage Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <HardDrive className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">Local Storage</span>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>Available: 2.1 TB</p>
                  <p>Used: 856 GB</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Cloud className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Cloud Storage</span>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>Available: 5.0 TB</p>
                  <p>Used: 1.2 TB</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Database className="h-5 w-5 text-green-600" />
                  <span className="font-medium">External Drive</span>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>Available: 8.0 TB</p>
                  <p>Used: 3.4 TB</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Backup Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Automatic Backups</span>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Compression</span>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Encryption</span>
                <Badge variant="default">AES-256</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Retention Period</span>
                <Badge variant="secondary">90 days</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Notification</span>
                <Badge variant="default">Email</Badge>
              </div>
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
