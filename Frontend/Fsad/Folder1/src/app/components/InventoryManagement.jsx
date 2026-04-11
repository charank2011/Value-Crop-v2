import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  AlertTriangle,
  Search,
  TrendingDown,
  TrendingUp,
  Package } from
'lucide-react';
import { getProducts, updateProduct } from '../data/api';

import { toast } from 'sonner';

export function InventoryManagement() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const handleStockUpdate = async (id, newQuantity) => {
    if (newQuantity < 0) {
      toast.error('Quantity cannot be negative');
      return;
    }

    // Get current product details as update requires full payload for simplicity
    const product = products.find((p) => p.id === id);
    if (!product) return;
    
    // We pass the updated quantity
    const updated = await updateProduct(id, { ...product, quantity: newQuantity });
    if (updated) {
      toast.success('Quantity updated successfully');
      loadProducts();
    } else {
      toast.error('Failed to update quantity');
    }
  };

  const getStockStatus = (product) => {
    if (product.quantity === 0) return 'out';
    if (product.quantity <= 10) return 'critical';
    if (product.quantity <= 20) return 'low';
    return 'good';
  };

  const filteredProducts = products.
  filter((product) => {
    const matchesSearch = product.productname.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getStockStatus(product);

    if (filter === 'all') return matchesSearch;
    if (filter === 'critical') return matchesSearch && (status === 'critical' || status === 'out');
    if (filter === 'low') return matchesSearch && (status === 'low' || status === 'critical' || status === 'out');

    return matchesSearch;
  }).
  sort((a, b) => a.quantity - b.quantity);

  const stats = {
    total: products.length,
    critical: products.filter((p) => p.quantity <= 10).length,
    low: products.filter((p) => p.quantity > 10 && p.quantity <= 20).length,
    good: products.filter((p) => p.quantity > 20).length
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-600 mt-1">Monitor and manage stock levels across all products</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-2xl font-bold mt-1 text-red-600">{stats.critical}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold mt-1 text-orange-600">{stats.low}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Well Stocked</p>
                <p className="text-2xl font-bold mt-1 text-emerald-600">{stats.good}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10" />
              
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm">
                
                All
              </Button>
              <Button
                variant={filter === 'critical' ? 'default' : 'outline'}
                onClick={() => setFilter('critical')}
                size="sm"
                className={filter === 'critical' ? 'bg-red-600 hover:bg-red-700' : ''}>
                
                Critical
              </Button>
              <Button
                variant={filter === 'low' ? 'default' : 'outline'}
                onClick={() => setFilter('low')}
                size="sm"
                className={filter === 'low' ? 'bg-orange-600 hover:bg-orange-700' : ''}>
                
                Low Stock
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProducts.length === 0 ?
            <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No products found</p>
              </div> :

            filteredProducts.map((product) => {
              const status = getStockStatus(product);

              let statusColor = 'bg-emerald-100 text-emerald-700';
              let progressColor = 'bg-emerald-600';

              if (status === 'out') {
                statusColor = 'bg-gray-100 text-gray-700';
                progressColor = 'bg-gray-400';
              } else if (status === 'critical') {
                statusColor = 'bg-red-100 text-red-700';
                progressColor = 'bg-red-600';
              } else if (status === 'low') {
                statusColor = 'bg-orange-100 text-orange-700';
                progressColor = 'bg-orange-600';
              }

              return (
                <div key={product.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <img
                          src={product.imageUrl}
                          alt={product.productname}
                          className="w-full h-full object-cover" />
                        
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{product.productname}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {product.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {product.quantity} in stock
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge className={statusColor}>
                          {status === 'out' ? 'Out of Stock' :
                        status === 'critical' ? 'Critical' :
                        status === 'low' ? 'Low' : 'In Stock'}
                        </Badge>
                        <Link to={`/farmer/products/edit/${product.id}`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>



                    <div className="flex items-center gap-2">
                      <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStockUpdate(product.id, product.quantity - 10)}
                      disabled={product.quantity === 0}>
                      
                        -10
                      </Button>
                      <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStockUpdate(product.id, product.quantity - 1)}
                      disabled={product.quantity === 0}>
                      
                        -1
                      </Button>
                      <Input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value)) {
                          handleStockUpdate(product.id, value);
                        }
                      }}
                      className="w-24 text-center" />
                    
                      <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStockUpdate(product.id, product.quantity + 1)}>
                      
                        +1
                      </Button>
                      <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStockUpdate(product.id, product.quantity + 10)}>
                      
                        +10
                      </Button>
                    </div>
                  </div>);

            })
            }
          </div>
        </CardContent>
      </Card>
    </div>);

}