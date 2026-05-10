// ─── Auth ───────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  storeName: string
  location?: string
  avatarUrl?: string
  plan: 'free' | 'pro' | 'enterprise'
  stats: {
    skuCount: number
    alertCount: number
    stockedPercent: number
  }
  createdAt: Date
}

// ─── Products ────────────────────────────────────
export type StockStatus = 'safe' | 'low' | 'critical' | 'out_of_stock'
export type StockHealth = 'stable' | 'low' | 'critical'
export type ProductCategory =
  | 'Electronics' | 'Food' | 'Furniture' | 'Apparel'
  | 'Beverages' | 'Office Supplies' | 'Other'

export interface Product {
  id: string
  name: string
  sku: string
  category: ProductCategory
  subcategory?: string
  imageUrl?: string
  currentStock: number
  reorderPoint: number
  purchasePrice: number
  sellingPrice: number
  unit: string
  supplier?: string
  supplierLeadTime?: number
  status: StockStatus
  stockHealth: StockHealth
  totalValue: number
  lastAudited?: Date
  createdAt: Date
  updatedAt: Date
}

// ─── Stock Movements ─────────────────────────────
export type MovementType = 'stock_in' | 'stock_out' | 'correction' | 'audit'
export type StockOutReason =
  | 'customer_sale' | 'damage' | 'internal_use' | 'return' | 'other'

export interface StockMovement {
  id: string
  productId: string
  productName: string
  productImageUrl?: string
  type: MovementType
  quantity: number
  referenceNote?: string
  reason?: StockOutReason
  orderId?: string
  performedBy: string
  timestamp: Date
  stockBefore: number
  stockAfter: number
}

// ─── Dashboard ───────────────────────────────────
export interface DashboardStats {
  totalProducts: number
  lowStockCount: number
  inToday: number
  outToday: number
}

export interface RecentActivity {
  id: string
  productName: string
  productImageUrl?: string
  action: string
  detail: string
  time: string
  status: 'completed' | 'system' | 'pending'
}

// ─── Reports ─────────────────────────────────────
export interface ReportStats {
  totalStockValue: number
  stockValueChange: number
  lowStockItems: number
  lowStockAlerts: number
  turnoverRate: number
}

export interface ChartDataPoint {
  day: number
  label: string
  value: number
}

export interface TopSeller {
  productName: string
  units: number
  maxUnits: number
  percentage: number
}

export interface CriticalAlert {
  id: string
  productName: string
  sku: string
  imageUrl?: string
  stockLeft: number
  alertType: 'restock_required' | 'out_of_stock'
}

// ─── Forms ───────────────────────────────────────
export interface AddProductForm {
  name: string
  category: string
  supplier: string
  purchasePrice: number
  sellingPrice: number
  initialStock: number
  unit: string
  imageFile?: File
}

export interface StockInForm {
  productId: string
  quantity: number
  referenceNote: string
}

export interface StockOutForm {
  productId: string
  quantity: number
  reason: StockOutReason
  additionalNotes?: string
}

export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  storeName: string
  ownerName: string
  email: string
  password: string
  agreeToTerms: boolean
}
