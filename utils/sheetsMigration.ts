/**
 * Google Sheets to Firebase Migration Utility
 * 
 * This utility helps you migrate data from Google Sheets to Firebase
 * Follow the steps below to complete the migration
 */

import { getFirestore, collection, addDoc, writeBatch, doc } from 'firebase/firestore';
// Types are defined locally to avoid external dependency
type Product = Record<string, any>;
type Expense = Record<string, any>;
type Shipment = Record<string, any>;
type PartnerPayment = Record<string, any>;

interface SheetsProduct {
  name: string;
  market: string;
  sellingPrice: number;
  costPerUnit: number;
  totalLeads: number;
  totalOrders: number;
  totalDelivered: number;
  totalRevenue: number;
  adsFacebook: number;
  adsTikTok: number;
  adsGoogle?: number;
  cogs: number;
  serviceFeePerUnit: number;
  extraFees?: number;
  shippingFees?: number;
  stockTotal: number;
  isTest?: boolean;
  testResult?: 'Winner' | 'Loser' | 'Pending';
  imageUrl?: string;
}

interface SheetsExpense {
  name: string;
  category: 'Business' | 'Tools & Services' | 'Logistics' | 'Salaries' | 'Marketing' | 'Other';
  amount: number;
  date: string;
  description?: string;
}

/**
 * Step 1: Export your Google Sheets data to CSV
 * Go to File > Download > Comma Separated Values (.csv)
 * 
 * Step 2: Convert CSV to JSON
 * Use an online tool like https://csvjson.com/csv2json
 * Or use this function after loading the CSV
 * 
 * Step 3: Run the migration functions below
 */

/**
 * Convert Google Sheets product data to Firebase format
 */
export function convertProductFromSheets(sheetProduct: SheetsProduct): Omit<Product, 'id'> {
  const now = new Date().toISOString();
  
  return {
    name: sheetProduct.name,
    market: sheetProduct.market,
    category: sheetProduct.isTest ? 'Testing' : 'Active',
    status: 'Active',
    
    // Logistics
    totalLeads: sheetProduct.totalLeads || 0,
    totalConfirms: sheetProduct.totalOrders || 0,
    totalOrders: sheetProduct.totalOrders || 0,
    totalDelivered: sheetProduct.totalDelivered || 0,
    stockAvailable: (sheetProduct.stockTotal || 0) - (sheetProduct.totalDelivered || 0),
    stockTotal: sheetProduct.stockTotal || 0,
    initialStock: sheetProduct.stockTotal || 0,
    
    // Financials
    sellingPrice: sheetProduct.sellingPrice || 0,
    costPerUnit: sheetProduct.costPerUnit || 0,
    totalRevenue: sheetProduct.totalRevenue || 0,
    
    // Costs
    cogs: -(Math.abs(sheetProduct.cogs || 0)),
    serviceFees: 0, // Will be calculated
    extraFees: -(Math.abs(sheetProduct.extraFees || 0)),
    shippingFees: -(Math.abs(sheetProduct.shippingFees || 0)),
    serviceFeePerUnit: sheetProduct.serviceFeePerUnit || 0,
    
    // Marketing
    adsFacebook: -(Math.abs(sheetProduct.adsFacebook || 0)),
    adsTikTok: -(Math.abs(sheetProduct.adsTikTok || 0)),
    adsGoogle: -(Math.abs(sheetProduct.adsGoogle || 0)),
    totalAdSpend: 0, // Will be calculated
    
    // Calculated fields (will be auto-computed by Firebase functions)
    netProfit: 0,
    grossRevenue: 0,
    deliveryRate: 0,
    confirmationRate: 0,
    breakEvenDeliveryRate: 0,
    breakEvenCostPerDelivered: 0,
    breakEvenAdCost: 0,
    cpdBreakeven: 0,
    cplBreakeven: 0,
    cpl: 0,
    cpd: 0,
    profitPerOrder: 0,
    profitMargin: 0,
    netProfitPercentage: 0,
    
    // Test lab
    isTest: sheetProduct.isTest || false,
    testResult: sheetProduct.testResult || 'Pending',
    isSourced: false,
    imageUrl: sheetProduct.imageUrl || '',
    
    // Timestamps
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Convert Google Sheets expense data to Firebase format
 */
export function convertExpenseFromSheets(sheetExpense: SheetsExpense): Omit<Expense, 'id'> {
  return {
    name: sheetExpense.name,
    category: sheetExpense.category,
    amount: Math.abs(sheetExpense.amount),
    date: sheetExpense.date,
    description: sheetExpense.description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Migrate products to Firebase in batches
 */
export async function migrateProducts(db: any, products: SheetsProduct[]) {
  console.log(`Starting migration of ${products.length} products...`);
  
  const batchSize = 500; // Firestore batch limit
  let migratedCount = 0;
  
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = writeBatch(db);
    const chunk = products.slice(i, i + batchSize);
    
    chunk.forEach((sheetProduct) => {
      const productData = convertProductFromSheets(sheetProduct);
      const docRef = doc(collection(db, 'products'));
      batch.set(docRef, productData);
    });
    
    await batch.commit();
    migratedCount += chunk.length;
    console.log(`Migrated ${migratedCount}/${products.length} products`);
  }
  
  console.log('✓ Product migration complete!');
  return migratedCount;
}

/**
 * Migrate expenses to Firebase in batches
 */
export async function migrateExpenses(db: any, expenses: SheetsExpense[]) {
  console.log(`Starting migration of ${expenses.length} expenses...`);
  
  const batchSize = 500;
  let migratedCount = 0;
  
  for (let i = 0; i < expenses.length; i += batchSize) {
    const batch = writeBatch(db);
    const chunk = expenses.slice(i, i + batchSize);
    
    chunk.forEach((sheetExpense) => {
      const expenseData = convertExpenseFromSheets(sheetExpense);
      const docRef = doc(collection(db, 'expenses'));
      batch.set(docRef, expenseData);
    });
    
    await batch.commit();
    migratedCount += chunk.length;
    console.log(`Migrated ${migratedCount}/${expenses.length} expenses`);
  }
  
  console.log('✓ Expense migration complete!');
  return migratedCount;
}

/**
 * USAGE EXAMPLE:
 * 
 * import { getFirestore } from 'firebase/firestore';
 * import { app } from './firebase-config';
 * import { migrateProducts, migrateExpenses } from './utils/sheetsMigration';
 * 
 * const db = getFirestore(app);
 * 
 * // Your data from Google Sheets (converted from CSV to JSON)
 * const productsFromSheets = [
 *   {
 *     name: "Product A",
 *     market: "Kenya",
 *     sellingPrice: 50,
 *     costPerUnit: 20,
 *     totalLeads: 100,
 *     totalOrders: 50,
 *     totalDelivered: 45,
 *     totalRevenue: 2250,
 *     adsFacebook: 500,
 *     adsTikTok: 300,
 *     cogs: 900,
 *     serviceFeePerUnit: 5,
 *     stockTotal: 100,
 *   },
 *   // ... more products
 * ];
 * 
 * // Run migration
 * await migrateProducts(db, productsFromSheets);
 */

/**
 * Sample CSV to JSON converter function
 * Use this if you want to convert CSV directly in the app
 */
export function csvToJSON(csv: string): any[] {
  const lines = csv.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const result: any[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const obj: any = {};
    const currentLine = lines[i].split(',');
    
    headers.forEach((header, index) => {
      const value = currentLine[index]?.trim();
      // Try to parse as number
      obj[header] = isNaN(Number(value)) ? value : Number(value);
    });
    
    result.push(obj);
  }
  
  return result;
}

/**
 * Generate sample CSV template for products
 */
export function generateProductCSVTemplate(): string {
  return `name,market,sellingPrice,costPerUnit,totalLeads,totalOrders,totalDelivered,totalRevenue,adsFacebook,adsTikTok,adsGoogle,cogs,serviceFeePerUnit,extraFees,shippingFees,stockTotal,isTest,testResult,imageUrl
Product A,Kenya,50,20,100,50,45,2250,500,300,0,900,5,50,100,100,false,Pending,https://example.com/image.jpg
Product B,Uganda,75,30,200,100,90,6750,800,400,200,2700,7,100,150,150,false,Pending,https://example.com/image2.jpg`;
}

/**
 * Generate sample CSV template for expenses
 */
export function generateExpenseCSVTemplate(): string {
  return `name,category,amount,date,description
Office Rent,Business,1000,2024-01-15,Monthly office rent
Marketing Tools,Tools & Services,299,2024-01-10,Social media management software
Shipping to Warehouse,Logistics,500,2024-01-20,Bulk shipping from China
Employee Salary,Salaries,2000,2024-01-31,Monthly salary payment`;
}
