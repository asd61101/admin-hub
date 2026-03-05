<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# E-Com Master - Complete Analytics & Business Management Platform

A comprehensive e-commerce business management system with real-time analytics, inventory tracking, financial management, and product testing capabilities.

## Table of Contents

- [Quick Start](#quick-start)
- [Calculation Formulas](#calculation-formulas)
  - [Product Metrics](#product-metrics)
  - [Dashboard Financial Metrics](#dashboard-financial-metrics)
  - [Test Lab Metrics](#test-lab-metrics)
  - [Inventory Calculations](#inventory-calculations)
  - [Sourcing & Shipments](#sourcing--shipments)
  - [Expense Management](#expense-management)
  - [Partner Payments](#partner-payments)

---

## Quick Start

**Prerequisites:** Node.js

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

3. Run the app:
   ```bash
   npm run dev
   ```

---

## Key Formula Updates (March 2, 2026)

The following formulas have been updated for accuracy:

**Product Metrics:**

- **Service Fees**: Now dynamic based on delivery fee per unit (set during data entry) instead of fixed $7.50
- **Delivery Rate**: Changed from `(Total Delivered ÷ Total Orders) × 100` to `(Total Orders × 100) ÷ Total Leads`
- **Removed**: Confirmation Rate (no longer calculated)

**Break-Even Calculations:**

- **Removed**: Break-Even Delivery Rate, Break-Even Cost Per Delivered, Break-Even Ad Cost
- **Kept**: CPD Break-Even and CPL Break-Even (accurate formulas retained)

**Dashboard Metrics:**

- **Total Delivery Rate**: Changed to average of all product delivery rates (excluding test products)
  - Old: `(Total Delivered ÷ Total Orders) × 100`
  - New: `(Σ Delivery Rate % ÷ Number of Active Products)`

**Data Access:**

- All authenticated users share the same data (team collaboration model)
- No user-specific data isolation

---

## Calculation Formulas

### Product Metrics

#### Revenue Calculations

```
Gross Revenue = Total Amount of the product
Total Revenue = Total Amount in $ (manually tracked)
```

#### Cost Calculations

```
Cost Per Unit = COGS (Total Stock Cost) ÷ Initial Stock (Total Units Purchased)

Total Ad Spend = Facebook Ads + TikTok Ads + Google Ads

Service Fees (Delivery Fees) = Total Orders × Delivery Fee Per Unit
Note: Delivery fee per unit varies by service (e.g., $3, $6, $7.50) and is set during data entry

Total Costs = Total Ad Spend + Service Fees + COGS + Extra Fees + Shipping Fees + Testing Ad Spend
```

#### Profit Calculations

```
Net Profit = Total Revenue - Total Ad Spend - COGS - Service Fees - Shipping Fees - Extra Fees

Profit Per Order = Net Profit ÷ Total Orders

Profit Margin % = (Net Profit × 100) ÷ Total Revenue

Net Profit Percentage = (Net Profit ÷ Total Revenue) × 100
```

#### Performance Metrics

```
CPL (Cost Per Lead) = Total Ad Spend ÷ Total Leads

CPD (Cost Per Delivered) = (Facebook Ads + TikTok Ads) ÷ Total Orders

Delivery Rate % = (Total Orders × 100) ÷ Total Leads
Note: Capped at maximum 100%
```

#### Break-Even Calculations

```
CPD Break-Even = Selling Price - Unit Product Cost - Delivery Fee - ((Extra Fee + Shipping Fee) ÷ Total Units Stocked)

CPL Break-Even = (CPD Break-Even × Delivery Rate) ÷ 100
```

#### Inventory Calculations

```
Stock Available = Initial Stock - Total Delivered

Stock Status:
- Out of Stock: Stock Available = 0
- Low Stock: 0 < Stock Available ≤ 20
- Active: Stock Available > 20
```

---

### Dashboard Financial Metrics

#### Revenue Overview

```
Gross Revenue = Σ(Total Amount) for all products

Total Remitted = Gross Revenue - Total Not Remitted

Total Not Remitted = Delivery Fees + Shipment Fees + Extra Fees
```

#### Cost Breakdown

```
Total Facebook Ads = Σ(Facebook Ads) for all products

Total TikTok Ads = Σ(TikTok Ads) for all products

Total Google Ads = Σ(Google Ads) for all products

Total Ads (All Products) = Total Facebook Ads + Total TikTok Ads + Total Google Ads
Note: This includes ad spend from both testing products and regular products

Total Ads on Testing = Σ(Total Ad Spend) for products where isTest = true

Total Expenses = Σ(Expense Amounts) from expense records

Total Stock Fees = Σ(Cost Per Unit × Stock Total) for all products

Total Shipment Fees = Σ(Shipping Fees) for all products

Total Extra Fees = Σ(Extra Fees) for all products

Total Delivery Fees = Σ(Service Fees) for all products
```

#### Profit Calculations

```
Net Profit = Revenue – Expenses – Ads on Testing – Ads of all Products – Shipment Fees – Extra Fees – Delivery Fees – Stock Fees

Net Profit (% from Revenue) = (Net Profit ÷ Revenue) × 100

Net Profit From Remitted = Total Remitted - Total Expenses - Total Ads on Testing - Total Ads (All Products) - Total Stock Fees

Net Profit From Remitted % = (Net Profit From Remitted ÷ Total Remitted) × 100
```

#### Advertising Performance

```
Facebook Ads Percentage = (Total Facebook Ads ÷ Gross Revenue) × 100

TikTok Ads Percentage = (Total TikTok Ads ÷ Gross Revenue) × 100

Stock Fee Percentage = (Total Stock Fees ÷ Gross Revenue) × 100
```

#### Product Performance Dashboard

```
Total Products = Count of all active products (excluding test products)

Total Leads = Σ(Total Leads) for all active products (excluding test products)

Total Orders = Σ(Total Orders) for all products

Total Delivered = Σ(Total Delivered) for all products

Total Delivery Rate = Average of all product delivery rates (excluding test products)
Calculation: (Σ(Delivery Rate %) ÷ Number of Active Products)
```

---

### Test Lab Metrics

#### Test Product Analysis

```
CPL (Cost Per Lead) = Total Ad Spend ÷ Total Leads

Test Status Categories:
- Pending: Initial testing phase
- Winner: Positive ROI, ready for scaling
- Super Winner: Exceptional performance
- Loser: Negative ROI, discontinue testing
```

#### Test Product Fields

```
Total Leads: Number of potential customers reached
Total Ad Spend: Combined spend across platforms
Facebook Ads: Spend on Facebook advertising
TikTok Ads: Spend on TikTok advertising
Google Ads: Spend on Google advertising
```

---

### Inventory Calculations

#### Stock Metrics

```
Total Units In Stock = Σ(Stock Available) for all active products

Low Stock Alerts = Count of products where 0 < Stock Available ≤ 20

Out of Stock Count = Count of products where Stock Available = 0
```

#### Stock Management

```
Stock Available = Initial Stock - Total Delivered

Total Stock = Initial Stock (can be updated manually)

Delivery Rate % = (Total Orders × 100) ÷ Total Leads
```

---

### Sourcing & Shipments

#### Shipment Status

```
Status Categories:
- In Transit: Currently shipping
- Delivered: Arrived at destination
- Pending: Awaiting shipment
- In Production: Being manufactured
- Shipped: Left origin location
- In Customs: Clearing customs
- Cancelled: Shipment cancelled
```

#### Transit Calculations

```
Products in Transit (Count) = Count of shipments with status in ['In Transit', 'Shipped', 'Pending', 'In Production']

Total Units in Transit = Σ(Product Quantities) from in-transit shipments
```

#### Stock in Transit

```
Stock in Transit = Σ(Quantity) for all products in shipments where status ∈ ['In Transit', 'Pending', 'Shipped', 'In Production']
```

---

### Expense Management

#### Expense Categories

```
Categories:
- Business: General business expenses
- Tools & Services: Software and subscriptions
- Logistics: Shipping and handling
- Salaries: Employee compensation
- Marketing: Advertising and promotion
- Other: Miscellaneous expenses
```

#### Expense Calculations

```
Total Expenses = Σ(Expense Amounts) for all expense records

Filtered Total = Σ(Expense Amounts) for expenses within date range

Category Breakdown = Σ(Expense Amounts) grouped by category
```

#### Expense Impact on Profit

```
Expenses are subtracted from Net Profit calculations:
Net Profit = Revenue - Ad Spend - COGS - Service Fees - Expenses - Other Costs
```

---

### Partner Payments

#### Payment Tracking

```
Total Due = Σ(Payment Amounts) for all partner payment records

Total Paid = Σ(Payment Amounts) where status = 'Paid'

Total Pending = Total Due - Total Paid
```

#### Payment Status

```
Status Options:
- Paid: Payment completed
- Pending: Payment awaiting processing
```

#### Payment Methods

```
Supported Methods:
- BINANCE
- MERCURY
- WISE
- ATTIJARI
- PAYONEER
- REDOTPAY
- Custom methods (user-defined)
```

---

## Real-Time Updates

All metrics and calculations update automatically when:

- Products are added, edited, or deleted
- Orders and deliveries are recorded
- Expenses are added or modified
- Shipments are updated
- Partner payments are recorded

The system uses Firebase Firestore with real-time listeners (`onSnapshot`) to ensure all components stay synchronized without manual refresh.

---

## Data Management

### Shared Data Access

All authenticated users have access to the same data:

- Any user who logs in can view and manage all products, expenses, shipments, and payments
- Data is shared across the entire organization/team
- Changes made by one user are immediately visible to all other logged-in users via real-time synchronization
- Authentication is required - only logged-in users can access the platform

### Reset Database

A reset button is available on the Dashboard that allows complete database clearing:

- Removes all products
- Clears all expenses
- Deletes shipment records
- Removes invoices
- Clears partner payments
- Deletes history logs

**Warning:** This action is permanent and cannot be undone.

---

## Features

- **Real-time Analytics**: Live dashboard with key business metrics
- **Product Management**: Track performance, inventory, and profitability
- **Test Lab**: Manage product testing with dedicated metrics
- **Inventory Control**: Monitor stock levels with automatic alerts
- **Financial Tracking**: Comprehensive expense and revenue management
- **Sourcing**: Track shipments from suppliers worldwide
- **Partner Payments**: Manage payments to business partners
- **Date Filtering**: Filter all data by custom date ranges

---

## Support

For technical support or questions about calculations, refer to the inline code documentation in:

- `context/DataContext.tsx` - Core calculation engine
- `components/Dashboard.tsx` - Dashboard metrics
- `components/ProductTable.tsx` - Product calculations
- `components/TestLab.tsx` - Testing metrics

---

**Last Updated:** March 2, 2026
