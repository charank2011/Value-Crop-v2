import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package
} from
  'lucide-react';
import { getProducts, deleteProduct } from '../data/api';

import { toast } from 'sonner';

export function ProductsList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      const success = await deleteProduct(id);
      if (success) {
        toast.success('Product deleted successfully');
        loadProducts();
      } else {
        toast.error('Failed to delete product');
      }
    }
  };

  const categories = ['all', ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.productname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your farm products and pricing</p>
        </div>
        <Link to="/farmer/products/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10" />

            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) =>
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {filteredProducts.length === 0 ?
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || categoryFilter !== 'all' ?
                'Try adjusting your filters' :
                'Get started by adding your first product'}
            </p>
            <Link to="/farmer/products/new">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </CardContent>
        </Card> :

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) =>
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video w-full bg-gray-100 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.productname}
                  className="w-full h-full object-cover" />

              </div>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{product.productname}</CardTitle>
                    <Badge variant="secondary" className="mt-2">
                      {product.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-emerald-600">
                      ₹{product.price}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">In Stock:</span>
                    <span className="font-medium text-gray-900">
                      {product.quantity}
                    </span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link to={`/farmer/products/edit/${product.id}`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id, product.productname)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50">

                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      }

      {/* Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </span>
            <span className="text-gray-600">
              Total value: ₹{filteredProducts.reduce((sum, p) => sum + p.price * p.quantity, 0).toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>);

}