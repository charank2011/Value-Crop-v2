import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { 
  LayoutDashboard, 
  Package, 
  Warehouse, 
  Settings as SettingsIcon,
  Menu,
  LogOut
} from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function DashboardLayout() {
  const userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/farmer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/farmer/products', label: 'Products', icon: Package },
    { path: '/farmer/inventory', label: 'Inventory', icon: Warehouse },
    { path: '/farmer/settings', label: 'Settings', icon: SettingsIcon },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const NavLinks = ({ mobile = false }) => (
    <nav className={`flex ${mobile ? 'flex-col' : 'flex-col gap-1'}`}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => mobile && setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              active
                ? 'bg-emerald-100 text-emerald-900'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 w-full text-left"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </nav>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-emerald-700">ValueCrop</h1>
          <p className="text-sm text-gray-600 mt-1">Elevate farm yields to premium profits</p>
        </div>
        <div className="flex-1 p-4">
          <NavLinks />
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold border-2 border-emerald-200 uppercase">
              {userProfile?.name ? userProfile.name.charAt(0) : 'F'}
            </div>
            <div>
              <p className="font-medium text-sm capitalize">{userProfile?.name || 'Farmer'}</p>
              <p className="text-xs text-gray-500">Farmer</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10">
        <h1 className="text-xl font-bold text-emerald-700">ValueCrop</h1>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-emerald-700">ValueCrop</h1>
              <p className="text-sm text-gray-600 mt-1">Elevate farm yields to premium profits</p>
            </div>
            <div className="p-4">
              <NavLinks mobile />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto mt-16 md:mt-0">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
