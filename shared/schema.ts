import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("user"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Companies table
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  taxId: text("tax_id").notNull(),
  registrationNumber: text("registration_number").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

// Account Master
export const accountMaster = pgTable("account_master", {
  id: serial("id").primaryKey(),
  accountCode: text("account_code").notNull().unique(),
  accountName: text("account_name").notNull(),
  accountType: text("account_type").notNull(), // Asset, Liability, Income, Expense
  parentAccountId: integer("parent_account_id"),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
});

// Inventory Master
export const inventoryMaster = pgTable("inventory_master", {
  id: serial("id").primaryKey(),
  sku: text("sku").notNull().unique(),
  itemName: text("item_name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  unit: text("unit").notNull(),
  minimumStock: integer("minimum_stock").notNull().default(0),
  maximumStock: integer("maximum_stock").notNull().default(1000),
  currentStock: integer("current_stock").notNull().default(0),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

// Customers
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  customerCode: text("customer_code").notNull().unique(),
  name: text("name").notNull(),
  contactPerson: text("contact_person"),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  creditLimit: decimal("credit_limit", { precision: 10, scale: 2 }).notNull().default("0"),
  paymentTerms: text("payment_terms"),
  isActive: boolean("is_active").notNull().default(true),
});

// Suppliers
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  supplierCode: text("supplier_code").notNull().unique(),
  name: text("name").notNull(),
  contactPerson: text("contact_person"),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  paymentTerms: text("payment_terms"),
  isActive: boolean("is_active").notNull().default(true),
});

// Accounting Transactions
export const accountingTransactions = pgTable("accounting_transactions", {
  id: serial("id").primaryKey(),
  transactionId: text("transaction_id").notNull().unique(),
  date: timestamp("date").notNull(),
  accountId: integer("account_id").notNull(),
  description: text("description").notNull(),
  debitAmount: decimal("debit_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  creditAmount: decimal("credit_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  referenceType: text("reference_type"), // Sale, Purchase, Journal, etc.
  referenceId: text("reference_id"),
});

// Inventory Transactions
export const inventoryTransactions = pgTable("inventory_transactions", {
  id: serial("id").primaryKey(),
  transactionId: text("transaction_id").notNull().unique(),
  date: timestamp("date").notNull(),
  itemId: integer("item_id").notNull(),
  transactionType: text("transaction_type").notNull(), // IN, OUT, ADJUSTMENT
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  referenceType: text("reference_type"),
  referenceId: text("reference_id"),
  description: text("description"),
});

// Cold Storage
export const coldStorage = pgTable("cold_storage", {
  id: serial("id").primaryKey(),
  storageId: text("storage_id").notNull().unique(),
  itemId: integer("item_id").notNull(),
  quantity: integer("quantity").notNull(),
  temperature: decimal("temperature", { precision: 5, scale: 2 }).notNull(),
  humidity: decimal("humidity", { precision: 5, scale: 2 }),
  entryDate: timestamp("entry_date").notNull(),
  expiryDate: timestamp("expiry_date"),
  location: text("location").notNull(),
  status: text("status").notNull().default("stored"), // stored, removed, expired
});

// Crates Management
export const crates = pgTable("crates", {
  id: serial("id").primaryKey(),
  crateId: text("crate_id").notNull().unique(),
  customerId: integer("customer_id"),
  supplierId: integer("supplier_id"),
  crateType: text("crate_type").notNull(),
  quantity: integer("quantity").notNull(),
  status: text("status").notNull().default("available"), // available, assigned, damaged
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertCompanySchema = createInsertSchema(companies).omit({ id: true });
export const insertAccountMasterSchema = createInsertSchema(accountMaster).omit({ id: true });
export const insertInventoryMasterSchema = createInsertSchema(inventoryMaster).omit({ id: true });
export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true });
export const insertSupplierSchema = createInsertSchema(suppliers).omit({ id: true });
export const insertAccountingTransactionSchema = createInsertSchema(accountingTransactions).omit({ id: true });
export const insertInventoryTransactionSchema = createInsertSchema(inventoryTransactions).omit({ id: true });
export const insertColdStorageSchema = createInsertSchema(coldStorage).omit({ id: true });
export const insertCrateSchema = createInsertSchema(crates).omit({ id: true, lastUpdated: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type AccountMaster = typeof accountMaster.$inferSelect;
export type InsertAccountMaster = z.infer<typeof insertAccountMasterSchema>;
export type InventoryMaster = typeof inventoryMaster.$inferSelect;
export type InsertInventoryMaster = z.infer<typeof insertInventoryMasterSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type AccountingTransaction = typeof accountingTransactions.$inferSelect;
export type InsertAccountingTransaction = z.infer<typeof insertAccountingTransactionSchema>;
export type InventoryTransaction = typeof inventoryTransactions.$inferSelect;
export type InsertInventoryTransaction = z.infer<typeof insertInventoryTransactionSchema>;
export type ColdStorage = typeof coldStorage.$inferSelect;
export type InsertColdStorage = z.infer<typeof insertColdStorageSchema>;
export type Crate = typeof crates.$inferSelect;
export type InsertCrate = z.infer<typeof insertCrateSchema>;
