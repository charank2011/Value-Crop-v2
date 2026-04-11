import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft } from 'lucide-react';
import { getProductById, addProduct, updateProduct } from '../data/api';
import { toast } from 'sonner';

export function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    productname: '',
    category: '',
    price: '',
    quantity: '',
    imageUrl: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function fetchProduct() {
      if (isEditing && id) {
        const product = await getProductById(id);
        if (product) {
          setFormData({
            productname: product.productname,
            category: product.category,
            price: product.price ? product.price.toString() : '',
            quantity: product.quantity ? product.quantity.toString() : '',
            imageUrl: product.imageUrl
          });
        } else {
          toast.error('Product not found');
          navigate('/farmer/products');
        }
      }
    }
    fetchProduct();
  }, [id, isEditing, navigate]);

  const validate = () => {
    const newErrors = {};

    if (!formData.productname.trim()) newErrors.productname = 'Name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      newErrors.quantity = 'Quantity must be 0 or greater';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const productData = {
      productname: formData.productname.trim(),
      category: formData.category,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      imageUrl: formData.imageUrl.trim()
    };

    if (isEditing && id) {
      const updated = await updateProduct(id, productData);
      if (updated) {
        toast.success('Product updated successfully');
        navigate('/farmer/products');
      } else {
        toast.error('Failed to update product');
      }
    } else {
      const success = await addProduct(productData);
      if (success) {
        toast.success('Product added successfully');
        navigate('/farmer/products');
      } else {
        toast.error('Failed to add product');
      }
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const categories = [
    'Vegetables',
    'Fruits',
    'Dairy & Eggs',
    'Grains',
    'Herbs',
    'Other'];



  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/farmer/products')}>

          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Update product information' : 'Enter details for your new product'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="productname">Product Name *</Label>
              <Input
                id="productname"
                value={formData.productname}
                onChange={(e) => handleChange('productname', e.target.value)}
                placeholder="e.g., Organic Tomatoes"
                className={errors.productname ? 'border-red-500' : ''} />

              {errors.productname && <p className="text-sm text-red-600">{errors.productname}</p>}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(val) => handleChange('category', val)}>
                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) =>
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="0.00"
                  className={`pl-8 ${errors.price ? 'border-red-500' : ''}`} />

              </div>
              {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                placeholder="0"
                className={errors.quantity ? 'border-red-500' : ''} />

              {errors.quantity && <p className="text-sm text-red-600">{errors.quantity}</p>}
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (Optional)</Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className={errors.imageUrl ? 'border-red-500' : ''} />

              {errors.imageUrl && <p className="text-sm text-red-600">{errors.imageUrl}</p>}
              {formData.imageUrl && !errors.imageUrl &&
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }} />

                  </div>
                </div>
              }
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700">

                {isEditing ? 'Update Product' : 'Add Product'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/farmer/products')}>

                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>);

}