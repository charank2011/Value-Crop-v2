import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  Package,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Plus,
  ArrowRight
} from
  'lucide-react';
import { getProducts } from '../data/api';


export function DashboardHome() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setProducts(data);
    }
    load();
  }, []);

  const totalProducts = products.length;
  const lowStockItems = products.filter((p) => p.quantity <= 20).length;
  const recentSales = 156; // Mock value

  const stats = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },

    {
      title: 'Low Stock Alerts',
      value: lowStockItems,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Recent Sales',
      value: recentSales,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }];


  const lowStockProducts = products.
    filter((p) => p.quantity <= 20).
    sort((a, b) => a.quantity - b.quantity).
    slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your farm overview.</p>
        </div>
        <Link to="/farmer/products/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>);

        })}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Low Stock Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Low Stock Alerts</CardTitle>
            <Link to="/farmer/inventory">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.length === 0 ?
                <p className="text-gray-500 text-center py-8">
                  All products are well stocked!
                </p> :

                lowStockProducts.map((product) => {
                  const severity = product.quantity <= 10 ? 'critical' : 'low';

                  return (
                    <div key={product.id} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <img
                          src={product.imageUrl}
                          alt={product.productname}
                          className="w-full h-full object-cover" />

                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.productname}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {product.quantity}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${severity === 'critical' ?
                          'bg-red-100 text-red-700' :
                          'bg-orange-100 text-orange-700'}`
                      }>
                        {severity === 'critical' ? 'Critical' : 'Low'}
                      </div>
                    </div>);

                })
              }
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
            <Link to="/farmer/products/new" className="block">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Plus className="w-6 h-6" />
                <span>Add New Product</span>
              </Button>
            </Link>
            <Link to="/farmer/products" className="block">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Package className="w-6 h-6" />
                <span>Manage Products</span>
              </Button>
            </Link>
            <Link to="/farmer/inventory" className="block">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <AlertTriangle className="w-6 h-6" />
                <span>Check Inventory</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>);

}