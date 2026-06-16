export interface Product {
  id: string;
  name: string;
  category: 'resep' | 'vitamin' | 'ibu_bayi' | 'tubuh';
  apotek: string;
  price: number;
  originalPrice?: number;
  discountPrice?: number;
  discountLabel?: string;
  image: string;
  rating?: number;
  salesCount?: string;
  description?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  items: CartItem[];
  total: number;
  date: string;
  deliveryStatus: 'Pending' | 'Diproses' | 'Dikirim' | 'Selesai';
  trackingNumber: string;
}
