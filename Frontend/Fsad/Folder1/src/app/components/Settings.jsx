import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { toast } from 'sonner';

export function Settings() {
  const userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your farm dashboard preferences</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={userProfile?.name || ''} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={userProfile?.email || ''} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" defaultValue={userProfile?.contact || ''} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" defaultValue={userProfile?.address || ''} readOnly />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Low Stock Alerts</Label>
              <p className="text-sm text-gray-600">
                Receive notifications when products reach low stock threshold
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-gray-600">
                Send daily inventory summaries via email
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Product Updates</Label>
              <p className="text-sm text-gray-600">
                Get notified when products are added or modified
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Inventory Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="defaultUnit">Default Unit of Measurement</Label>
            <Select defaultValue="lb">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lb">Pounds (lb)</SelectItem>
                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                <SelectItem value="dozen">Dozen</SelectItem>
                <SelectItem value="piece">Piece</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select defaultValue="usd">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD ($)</SelectItem>
                <SelectItem value="eur">EUR (€)</SelectItem>
                <SelectItem value="gbp">GBP (£)</SelectItem>
                <SelectItem value="cad">CAD ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lowStockDefault">Default Low Stock Threshold</Label>
            <Input
              id="lowStockDefault"
              type="number"
              defaultValue="50"
              placeholder="Enter default threshold" />
            
            <p className="text-sm text-gray-600">
              This will be used as the default when adding new products
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Display Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="itemsPerPage">Products per Page</Label>
            <Select defaultValue="12">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="48">48</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Product Images</Label>
              <p className="text-sm text-gray-600">
                Display product images in lists and grids
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Compact View</Label>
              <p className="text-sm text-gray-600">
                Use a more compact layout for product listings
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Export Data</Label>
            <p className="text-sm text-gray-600 mb-3">
              Download your product and inventory data
            </p>
            <Button variant="outline">Export as CSV</Button>
          </div>
          <Separator />
          <div>
            <Label className="text-red-600">Danger Zone</Label>
            <p className="text-sm text-gray-600 mb-3">
              Permanently delete all product data. This action cannot be undone.
            </p>
            <Button variant="destructive" onClick={() => {
              if (window.confirm('Are you sure you want to delete all data? This cannot be undone.')) {
                localStorage.removeItem('farmer-dashboard-products');
                toast.success('All data has been cleared');
              }
            }}>
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>);

}