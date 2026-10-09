'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  discountPrice?: number;
  size?: string;
  color?: string;
  sku?: string;
  quantity: number;
  maxStock: number;
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses?: any[];
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  insideDhakaFee: number;
  outsideDhakaFee: number;
  freeShippingThreshold?: number;
  bkashNumber: string;
  nagadNumber: string;
  rocketNumber: string;
  codAvailable: boolean;
  announcementBarText: string;
  showAnnouncementBar: boolean;
}

interface StoreContextType {
  user: User | null;
  loadingUser: boolean;
  setUser: (user: User | null) => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, size: string | undefined, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartSubtotal: number;
  cartItemCount: number;
  settings: StoreSettings | null;
  fetchSettings: () => Promise<void>;
  logout: () => Promise<void>;
}

const defaultSettings: StoreSettings = {
  storeName: 'Yah SABAB',
  tagline: 'Heritage & Modern Elegance for Men',
  phone: '01711223344',
  email: 'support@yahsabab.com',
  address: 'Banani, Road 11, Dhaka-1213, Bangladesh',
  insideDhakaFee: 80,
  outsideDhakaFee: 130,
  freeShippingThreshold: 3500,
  bkashNumber: '01711002233',
  nagadNumber: '01811002233',
  rocketNumber: '01911002233',
  codAvailable: true,
  announcementBarText: '✨ FREE Express Delivery nationwide on orders over ৳3,500 | Cash on Delivery & bKash Verified',
  showAnnouncementBar: true
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [settings, setSettings] = useState<StoreSettings | null>(defaultSettings);

  // Initialize cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('naborupa_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (err) {
      console.error('Failed to load cart from localStorage', err);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('naborupa_cart', JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }
  }, [cart]);

  // Check auth user session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        }
      } catch (e) {
        console.error('Auth check error', e);
      } finally {
        setLoadingUser(false);
      }
    };
    checkAuth();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (e) {
      console.error('Settings fetch error', e);
    }
  };

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const qtyToAdd = item.quantity || 1;
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === item.productId && (i.size || '') === (item.size || '')
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(
          updated[existingIndex].quantity + qtyToAdd,
          updated[existingIndex].maxStock || 99
        );
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      }

      return [
        ...prev,
        {
          ...item,
          quantity: Math.min(qtyToAdd, item.maxStock || 99)
        }
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size?: string) => {
    setCart((prev) =>
      prev.filter((i) => !(i.productId === productId && (i.size || '') === (size || '')))
    );
  };

  const updateQuantity = (productId: string, size: string | undefined, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.productId === productId && (i.size || '') === (size || '')) {
            const newQty = i.quantity + delta;
            if (newQty <= 0) return null;
            return { ...i, quantity: Math.min(newQty, i.maxStock || 99) };
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (e) {
      console.error('Logout error', e);
    }
  };

  const cartSubtotal = cart.reduce((sum, item) => {
    const price = item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.price;
    return sum + price * item.quantity;
  }, 0);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        user,
        loadingUser,
        setUser,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartSubtotal,
        cartItemCount,
        settings,
        fetchSettings,
        logout
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
