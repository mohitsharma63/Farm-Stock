import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Shield, 
  Database, 
  Mail, 
  Bell, 
  Clock, 
  Globe,
  Palette,
  Users,
  Lock,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface SystemParameter {
  id: string;
  category: string;
  name: string;
  value: string | boolean | number;
  type: "text" | "number" | "boolean" | "select" | "textarea";
  description: string;
  options?: string[];
  required?: boolean;
}

const systemParameters: SystemParameter[] = [
  // General Settings
  {
    id: "app_name",
    category: "general",
    name: "Application Name",
    value: "InvenTrack Enterprise Suite",
    type: "text",
    description: "Display name for the application"
  },
  {
    id: "company_name",
    category: "general",
    name: "Company Name",
    value: "Your Company Ltd.",
    type: "text",
    description: "Primary company name for reports and documents"
  },
  {
    id: "timezone",
    category: "general",
    name: "Default Timezone",
    value: "America/New_York",
    type: "select",
    options: ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "Europe/London", "Europe/Paris", "Asia/Tokyo"],
    description: "Default timezone for all date/time operations"
  },
  {
    id: "date_format",
    category: "general",
    name: "Date Format",
    value: "MM/dd/yyyy",
    type: "select",
    options: ["MM/dd/yyyy", "dd/MM/yyyy", "yyyy-MM-dd"],
    description: "Default date format for display"
  },
  {
    id: "currency",
    category: "general",
    name: "Default Currency",
    value: "USD",
    type: "select",
    options: ["USD", "EUR", "GBP", "CAD", "AUD"],
    description: "Default currency for financial calculations"
  },

  // Security Settings
  {
    id: "session_timeout",
    category: "security",
    name: "Session Timeout (minutes)",
    value: 60,
    type: "number",
    description: "Automatic logout time for inactive users"
  },
  {
    id: "password_complexity",
    category: "security",
    name: "Require Complex Passwords",
    value: true,
    type: "boolean",
    description: "Enforce strong password requirements"
  },
  {
    id: "two_factor_auth",
    category: "security",
    name: "Two-Factor Authentication",
    value: false,
    type: "boolean",
    description: "Enable 2FA for all user accounts"
  },
  {
    id: "login_attempts",
    category: "security",
    name: "Max Login Attempts",
    value: 5,
    type: "number",
    description: "Maximum failed login attempts before account lock"
  },

  // Database Settings
  {
    id: "backup_frequency",
    category: "database",
    name: "Backup Frequency",
    value: "daily",
    type: "select",
    options: ["hourly", "daily", "weekly", "monthly"],
    description: "Automatic backup frequency"
  },
  {
    id: "backup_retention",
    category: "database",
    name: "Backup retention (days)",
    value: 90,
    type: "number",
    description: "Number of days to keep backup files"
  },
  {
    id: "enable_audit_log",
    category: "database",
    name: "Enable Audit Logging",
    value: true,
    type: "boolean",
    description: "Log all database changes for auditing"
  },

  // Email Settings
  {
    id: "smtp_server",
    category: "email",
    name: "SMTP Server",
    value: "smtp.gmail.com",
    type: "text",
    description: "SMTP server hostname"
  },
  {
    id: "smtp_port",
    category: "email",
    name: "SMTP Port",
    value: 587,
    type: "number",
    description: "SMTP server port number"
  },
  {
    id: "email_from",
    category: "email",
    name: "From Email Address",
    value: "noreply@company.com",
    type: "text",
    description: "Default sender email address"
  },
  {
    id: "email_notifications",
    category: "email",
    name: "Email Notifications",
    value: true,
    type: "boolean",
    description: "Enable email notifications for system events"
  },

  // Inventory Settings
  {
    id: "low_stock_threshold",
    category: "inventory",
    name: "Low Stock Threshold %",
    value: 10,
    type: "number",
    description: "Percentage threshold for low stock alerts"
  },
  {
    id: "auto_reorder",
    category: "inventory",
    name: "Auto Reorder",
    value: false,
    type: "boolean",
    description: "Automatically create purchase orders for low stock items"
  },
  {
    id: "barcode_format",
    category: "inventory",
    name: "Barcode Format",
    value: "CODE128",
    type: "select",
    options: ["CODE128", "CODE39", "EAN13", "UPC"],
    description: "Default barcode format for inventory items"
  }
];

export default function Parameters() {
  const [parameters, setParameters] = useState<SystemParameter[]>(systemParameters);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const handleParameterChange = (id: string, value: string | boolean | number) => {
    setParameters(prev => prev.map(param => 
      param.id === id ? { ...param, value } : param
    ));
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log("Saving parameters:", parameters);
    setHasChanges(false);
  };

  const handleReset = () => {
    setParameters(systemParameters);
    setHasChanges(false);
  };

  const renderParameterInput = (param: SystemParameter) => {
    switch (param.type) {
      case "text":
        return (
          <Input
            value={param.value as string}
            onChange={(e) => handleParameterChange(param.id, e.target.value)}
            placeholder={param.description}
          />
        );
      
      case "number":
        return (
          <Input
            type="number"
            value={param.value as number}
            onChange={(e) => handleParameterChange(param.id, parseInt(e.target.value) || 0)}
            placeholder={param.description}
          />
        );
      
      case "boolean":
        return (
          <Switch
            checked={param.value as boolean}
            onCheckedChange={(checked) => handleParameterChange(param.id, checked)}
          />
        );
      
      case "select":
        return (
          <Select
            value={param.value as string}
            onValueChange={(value) => handleParameterChange(param.id, value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {param.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case "textarea":
        return (
          <Textarea
            value={param.value as string}
            onChange={(e) => handleParameterChange(param.id, e.target.value)}
            placeholder={param.description}
            rows={3}
          />
        );
      
      default:
        return null;
    }
  };

  const getParametersByCategory = (category: string) => {
    return parameters.filter(param => param.category === category);
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      general: Settings,
      security: Shield, 
      database: Database,
      email: Mail,
      inventory: Package,
      notifications: Bell
    };
    return icons[category as keyof typeof icons] || Settings;
  };

  const categories = [
    { id: "general", name: "General", icon: Settings },
    { id: "security", name: "Security", icon: Shield },
    { id: "database", name: "Database", icon: Database },
    { id: "email", name: "Email", icon: Mail },
    { id: "inventory", name: "Inventory", icon: Package }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Parameters</h1>
          <p className="text-gray-600">Configure system settings and operational parameters</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      {hasChanges && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Unsaved Changes:</strong> You have modified system parameters. 
            Remember to save your changes before leaving this page.
          </AlertDescription>
        </Alert>
      )}

      {/* Parameter Categories */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-2">
                <IconComponent className="h-4 w-4" />
                <span>{category.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {getParametersByCategory(category.id).map((param) => (
                <Card key={param.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-900">
                            {param.name}
                            {param.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </label>
                          {param.type === "boolean" && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">
                                {param.value ? "Enabled" : "Disabled"}
                              </span>
                              {renderParameterInput(param)}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{param.description}</p>
                        {param.type !== "boolean" && (
                          <div className="space-y-2">
                            {renderParameterInput(param)}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* System Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Application Version</span>
                <Badge variant="outline">v2.1.0</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Database Version</span>
                <Badge variant="outline">PostgreSQL 15.2</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Last Update</span>
                <Badge variant="secondary">March 25, 2024</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">System Status</span>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <Badge variant="default">Healthy</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Database className="h-4 w-4 mr-2" />
                Test Database Connection
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Test Email Configuration
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Security Audit
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="h-4 w-4 mr-2" />
                Clear System Cache
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Export Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Changes */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Parameter Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Settings className="text-blue-600 h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Session Timeout Updated</p>
                  <p className="text-sm text-gray-500">Changed from 30 to 60 minutes</p>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>March 28, 2024</p>
                <p>by Admin User</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="text-green-600 h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Password Complexity Enabled</p>
                  <p className="text-sm text-gray-500">Enhanced security requirements activated</p>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>March 25, 2024</p>
                <p>by System Admin</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Database className="text-orange-600 h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Backup Frequency Modified</p>
                  <p className="text-sm text-gray-500">Changed from weekly to daily backups</p>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>March 20, 2024</p>
                <p>by Data Manager</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
