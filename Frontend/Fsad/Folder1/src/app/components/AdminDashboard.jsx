import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { Users, UserPlus, Package, Shield, ExternalLink, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { getPendingFarmers, approveFarmer, getAllFarmers, getAllCustomers, getAllProductsAdmin } from '../data/api';
import { toast } from 'sonner';

export function AdminDashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'farmers', 'customers', 'products'
  const [pendingFarmers, setPendingFarmers] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (location.pathname.includes('/admin/products')) setActiveTab('products');
    else if (location.pathname.includes('/admin/users')) setActiveTab('farmers');
    else if (location.pathname.includes('/admin/dashboard')) setActiveTab('pending');
  }, [location.pathname]);

  const loadData = async () => {
    try {
      const [pend, frms, csts, prods] = await Promise.all([
        getPendingFarmers(),
        getAllFarmers(),
        getAllCustomers(),
        getAllProductsAdmin()
      ]);
      setPendingFarmers(pend || []);
      setFarmers(frms || []);
      setCustomers(csts || []);
      setProducts(prods || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load dashboard data.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id) => {
    const success = await approveFarmer(id);
    if (success) {
      toast.success("Farmer Approved & Unlocked!");
      loadData();
    } else {
      toast.error("Failed to approve farmer.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Command Center</h1>
        <p className="text-gray-600 mt-1">Manage farmers, buyers, and platform products</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Awaiting Approval</p>
            <p className="text-3xl font-bold text-orange-600">{pendingFarmers.length}</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Farmers</p>
            <p className="text-3xl font-bold text-emerald-600">{farmers.length}</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Buyers</p>
            <p className="text-3xl font-bold text-blue-600">{customers.length}</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Products</p>
            <p className="text-3xl font-bold text-purple-600">{products.length}</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
            <Package className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
             <button
              onClick={() => setActiveTab('pending')}
              className={`${
                activeTab === 'pending'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Pending Verification
            </button>
            <button
              onClick={() => setActiveTab('farmers')}
              className={`${
                activeTab === 'farmers'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              All Farmers
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`${
                activeTab === 'customers'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              All Buyers
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`${
                activeTab === 'products'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              All Products
            </button>
          </nav>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'pending' && (
            pendingFarmers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No pending farmers to approve.
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Name & Email</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Contact / Address</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pendingFarmers.map((farmer) => (
                    <tr key={farmer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{farmer.name}</p>
                        <p className="text-sm text-gray-500">{farmer.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <p>{farmer.contact}</p>
                        <p className="text-xs text-gray-400">{farmer.address}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                          PENDING
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 border-none"
                          onClick={() => handleApprove(farmer.id)}
                        >
                          Approve Account
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}

          {activeTab === 'farmers' && (
            farmers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No farmers found on the platform.
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Name & Email</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Contact Details</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Age / Gender</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {farmers.map((farmer) => (
                    <tr key={farmer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{farmer.name}</p>
                        <p className="text-sm text-gray-500">{farmer.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <p>{farmer.contact}</p>
                        <p className="text-xs text-gray-400">{farmer.address}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <p>Age: {farmer.age}</p>
                        <p>Gender: {farmer.gender}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          farmer.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {farmer.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}

          {activeTab === 'customers' && (
            customers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No buyers found on the platform.
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Name & Email</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Contact / Address</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Age / Gender</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <p>{customer.contact}</p>
                        <p className="text-xs text-gray-400">{customer.address}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <p>Age: {customer.age}</p>
                        <p>Gender: {customer.gender}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}

          {activeTab === 'products' && (
            products.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No products found on the platform.
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Product Name</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Price</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Quantity Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{product.productname}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        ₹{product.price ? product.price.toFixed(2) : "0.00"}
                      </td>
                      <td className="px-6 py-4">
                         <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          product.quantity > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {product.quantity} in stock
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>
    </div>
  );
}
