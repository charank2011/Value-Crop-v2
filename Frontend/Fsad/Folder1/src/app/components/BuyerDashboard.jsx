import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Heart, Star, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { getProducts } from '../data/api';

export function BuyerDashboard() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    async function fetchBackendProducts() {
      const data = await getProducts();
      const mappedProducts = data.map(p => ({
        id: p.id,
        name: p.productname,
        category: p.category,
        image: p.imageUrl,
        stock: p.quantity,
        price: p.price,
        description: 'Fresh from local farms',
        unit: 'item'
      }));
      setProducts(mappedProducts);
    }
    fetchBackendProducts();

    // Load cart and favorites
    const savedCart = localStorage.getItem('buyerCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    const savedFavorites = localStorage.getItem('buyerFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('buyerCart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('buyerFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.stock > 0;
  });

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
        toast.success('Quantity updated in cart');
      } else {
        toast.error('Cannot add more than available stock');
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      toast.success('Added to cart');
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    toast.success('Removed from cart');
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const toggleFavorite = (productId) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
      toast.success('Removed from favorites');
    } else {
      setFavorites([...favorites, productId]);
      toast.success('Added to favorites');
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    toast.success('Order placed successfully!');
    setCart([]);
    setShowCart(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-600 mt-1">Browse and purchase fresh products</p>
        </div>
        <Button
          onClick={() => setShowCart(!showCart)}
          className="bg-emerald-600 hover:bg-emerald-700 relative"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Cart
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-square bg-gradient-to-br from-emerald-100 to-emerald-200 relative">
              <button
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
              >
                <Heart
                  className={`w-5 h-5 ${favorites.includes(product.id)
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-400'
                    }`}
                />
              </button>
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">{getCategoryIcon(product.category)}</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm text-gray-600">4.5</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{product.description}</p>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-2xl font-bold text-emerald-600">₹{product.price}</span>
                  <span className="text-sm text-gray-600">/{product.unit}</span>
                </div>
                <span className="text-sm text-gray-500">Stock: {product.stock}</span>
              </div>
              <Button
                onClick={() => addToCart(product)}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center">
          <p className="text-gray-500">No products found matching your criteria</p>
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowCart(false)}>
          <div
            className="absolute right-0 top-0 h-full w-full md:w-96 bg-white shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100">
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-3xl overflow-hidden shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        getCategoryIcon(item.category)
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">₹{item.price}/{item.unit}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-200 space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-emerald-600">₹{totalAmount.toFixed(2)}</span>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getCategoryIcon(category) {
  const icons = {
    'Vegetables': '🥬',
    'Fruits': '🍎',
    'Dairy': '🥛',
    'Grains': '🌾',
    'Poultry': '🥚',
    'Other': '🌱',
  };
  return icons[category] || '🌱';
}
