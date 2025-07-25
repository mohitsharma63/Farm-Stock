import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  Database, 
  Bell, 
  Shield, 
  Globe, 
  Mail,
  Download,
  Upload,
  Trash2
} from "lucide-react";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [stockAlerts, setStockAlerts] = useState(true);
  const [systemMaintenance, setSystemMaintenance] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [selectedTimezone, setSelectedTimezone] = useState("UTC");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const { toast } = useToast();

  const handleSaveGeneralSettings = () => {
    toast({ title: "General settings saved successfully" });
  };

  const handleSaveNotifications = () => {
    toast({ title: "Notification settings saved successfully" });
  };

  const handleBackupData = () => {
    toast({ title: "Data backup initiated successfully" });
  };

  const handleExportData = () => {
    toast({ title: "Data export started - you will receive a download link via email" });
  };

  const handleImportData = () => {
    toast({ title: "Data import feature - please select a valid backup file" });
  };

  const handleClearCache = () => {
    toast({ title: "System cache cleared successfully" });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-500">Configure system preferences and parameters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                defaultValue="BizManager Enterprise"
                placeholder="Enter company name"
              />
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                  <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                  <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
                  <SelectItem value="GMT">GMT (Greenwich Mean Time)</SelectItem>
                  <SelectItem value="CET">CET (Central European Time)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="currency">Default Currency</Label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fiscalYearStart">Fiscal Year Start</Label>
              <Select defaultValue="january">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="january">January</SelectItem>
                  <SelectItem value="april">April</SelectItem>
                  <SelectItem value="july">July</SelectItem>
                  <SelectItem value="october">October</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSaveGeneralSettings} className="w-full">
              Save General Settings
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Low Stock Alerts</Label>
                <p className="text-sm text-gray-500">Alert when inventory is low</p>
              </div>
              <Switch
                checked={stockAlerts}
                onCheckedChange={setStockAlerts}
              />
            </div>

            <div>
              <Label htmlFor="alertEmail">Alert Email Address</Label>
              <Input
                id="alertEmail"
                type="email"
                defaultValue="admin@bizmanager.com"
                placeholder="Enter email for alerts"
              />
            </div>

            <div>
              <Label htmlFor="stockThreshold">Stock Alert Threshold (%)</Label>
              <Input
                id="stockThreshold"
                type="number"
                defaultValue="20"
                placeholder="20"
              />
            </div>

            <Button onClick={handleSaveNotifications} className="w-full">
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Select defaultValue="60">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="480">8 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="passwordPolicy">Password Policy</Label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - 6 characters minimum</SelectItem>
                  <SelectItem value="medium">Medium - 8 characters with numbers</SelectItem>
                  <SelectItem value="high">High - 12 characters with special chars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500">Require 2FA for all users</p>
              </div>
              <Switch defaultChecked={false} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Login Attempt Limit</Label>
                <p className="text-sm text-gray-500">Lock account after failed attempts</p>
              </div>
              <Switch defaultChecked={true} />
            </div>

            <Button className="w-full">Save Security Settings</Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Automatic Backup</Label>
                <p className="text-sm text-gray-500">Daily automatic data backup</p>
              </div>
              <Switch
                checked={autoBackup}
                onCheckedChange={setAutoBackup}
              />
            </div>

            <div>
              <Label>Backup Frequency</Label>
              <Select defaultValue="daily">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-3">
              <Button onClick={handleBackupData} variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Create Backup Now
              </Button>

              <Button onClick={handleExportData} variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Export Data
              </Button>

              <Button onClick={handleImportData} variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Import Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Maintenance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              System Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">Put system in maintenance mode</p>
                  </div>
                  <Switch
                    checked={systemMaintenance}
                    onCheckedChange={setSystemMaintenance}
                  />
                </div>

                <div>
                  <Label>Data Retention Period</Label>
                  <Select defaultValue="2years">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1year">1 Year</SelectItem>
                      <SelectItem value="2years">2 Years</SelectItem>
                      <SelectItem value="5years">5 Years</SelectItem>
                      <SelectItem value="forever">Forever</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Log Level</Label>
                  <Select defaultValue="info">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="error">Error Only</SelectItem>
                      <SelectItem value="warn">Warning & Error</SelectItem>
                      <SelectItem value="info">Info, Warning & Error</SelectItem>
                      <SelectItem value="debug">All (Debug Mode)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Button onClick={handleClearCache} variant="outline" className="w-full">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear System Cache
                </Button>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">System Information</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Version: 2.1.4</div>
                    <div>Last Updated: Nov 15, 2024</div>
                    <div>Database Size: 2.3 GB</div>
                    <div>Active Users: 12</div>
                    <div>Uptime: 15 days, 4 hours</div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center">
                    <Bell className="w-4 h-4 text-amber-600 mr-2" />
                    <span className="text-sm font-medium text-amber-800">
                      System Update Available
                    </span>
                  </div>
                  <p className="text-sm text-amber-700 mt-1">
                    Version 2.2.0 is available with new features and security improvements.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
