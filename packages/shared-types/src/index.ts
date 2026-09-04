// packages/shared-types/src/index.ts

export type UserRole = 'customer' | 'seller' | 'admin' | 'b2b_member' | 'b2b_approver';
export type AccountStatus = 'active' | 'pending' | 'suspended' | 'banned';
export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentTerms = 'prepay' | 'net_30';
export type Currency = 'NGN' | 'USD';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: AccountStatus;
  createdAt: string;
}

export interface Seller {
  id: string;
  ownerId: string;
  businessName: string;
  category: string;
  address: string;
  operatingHours: Record<string, { opensAt: string; closesAt: string; closed: boolean }>;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  rating: number;
  totalOrders: number;
  isCookingToday: boolean;
}

export interface MenuItem {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: Currency;
  photoUrl?: string;
  available: boolean;
  bulkCapable: boolean;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  note?: string;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  buyerType: 'b2c' | 'b2b';
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  platformFee: number;
  total: number;
  currency: Currency;
  scheduledFor?: string;
  createdAt: string;
}

export interface B2BCompany {
  id: string;
  name: string;
  industry: string;
  size: string;
  billingContact: string;
  paymentTerms: PaymentTerms;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  deliveryLocations: DeliveryLocation[];
}

export interface DeliveryLocation { id: string; label: string; address: string; contactName: string; }
export interface Invoice { id: string; companyId: string; orderIds: string[]; amount: number; currency: Currency; dueDate: string; status: 'open' | 'paid' | 'overdue'; }
export interface LoyaltyTier { id: string; name: 'Bronze' | 'Silver' | 'Gold'; minimumPoints: number; discountPercent: number; }
