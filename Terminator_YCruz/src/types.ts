export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  isNew?: boolean;
  isOffer?: boolean;
  isTrending?: boolean;
  rating: number;
  colors: { name: string; hex: string }[];
  sizes: string[];
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
}

export interface Category {
  id: string;
  name: string;
  image: string;
  count: number;
}

export interface User {
  email: string;
  fullName: string;
  isLoggedIn: boolean;
}
