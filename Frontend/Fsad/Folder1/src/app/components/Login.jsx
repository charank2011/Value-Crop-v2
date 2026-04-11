import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Sprout, ShoppingCart, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { loginFarmer, loginAdmin, loginCustomer, signupFarmer, signupCustomer } from '../data/api';

export function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('M');
  const [address, setAddress] = useState('');
  
  const [selectedRole, setSelectedRole] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) return;

    if (isSignUp) {
      if (selectedRole === 'admin') {
        toast.error("Cannot sign up as admin!");
        return;
      }
      
      const payload = {
        name, email, password, contact, address,
        age: parseInt(age, 10) || 0,
        gender
      };

      try {
        let ok = false;
        if (selectedRole === 'farmer') ok = await signupFarmer(payload);
        else if (selectedRole === 'buyer') ok = await signupCustomer(payload);

        if (ok) {
          toast.success("Account created successfully!");
          setIsSignUp(false);
        } else {
          toast.error("Failed to sign up.");
        }
      } catch (e) {
        toast.error("Server error during signup.");
      }
    } else {
      // LOGIN
      try {
        let authResponse = null;
        if (selectedRole === 'farmer') {
          authResponse = await loginFarmer(email, password);
        } else if (selectedRole === 'buyer') {
          authResponse = await loginCustomer(email, password);
        } else if (selectedRole === 'admin') {
          authResponse = await loginAdmin(email, password);
        }

        if (authResponse && authResponse.token) {
          localStorage.setItem('jwt_token', authResponse.token);
          if (authResponse.user) localStorage.setItem('user_profile', JSON.stringify(authResponse.user));
          login(selectedRole);
          toast.success("Logged in successfully!");
          if (selectedRole === 'farmer') navigate('/farmer/dashboard');
          if (selectedRole === 'buyer') navigate('/buyer/dashboard');
          if (selectedRole === 'admin') navigate('/admin/dashboard');
        } else {
          toast.error("Invalid credentials or account pending.");
        }
      } catch (e) {
        toast.error(e.message || "Server error during login.");
      }
    }
  };

  const roles = [
    { id: 'farmer', title: 'Farmer / Seller', description: 'Manage products', icon: Sprout, color: 'emerald' },
    { id: 'buyer', title: 'Buyer', description: 'Purchase products', icon: ShoppingCart, color: 'blue' },
    { id: 'admin', title: 'Admin', description: 'Manage platform', icon: Shield, color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-700 mb-2">ValueCrop</h1>
          <p className="text-gray-600">Elevate farm yields to premium profits</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600">
              {isSignUp ? 'Sign up to get started' : 'Sign in to continue'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {isSignUp && (
              <>
                <div>
                  <Label>Full Name</Label>
                  <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <Label>Contact</Label>
                  <Input type="text" value={contact} onChange={(e) => setContact(e.target.value)} required />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label>Age</Label>
                    <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
                  </div>
                  <div className="flex-1">
                    <Label>Gender</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={gender} onChange={(e) => setGender(e.target.value)}>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Address</Label>
                  <Input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
              </>
            )}

            <div>
              <Label className="mb-3 block">I am a:</Label>
              <div className="grid gap-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id} type="button" onClick={() => setSelectedRole(role.id)}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left ${isSelected ? `border-${role.color}-500 bg-${role.color}-50` : 'border-gray-200 hover:border-gray-300' }`}
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isSelected ? `bg-${role.color}-100` : 'bg-gray-100'}`}>
                        <Icon className={`w-6 h-6 ${isSelected ? `text-${role.color}-600` : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{role.title}</p>
                        <p className="text-sm text-gray-600">{role.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={!selectedRole}>
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-emerald-600 hover:text-emerald-700 font-medium">
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
