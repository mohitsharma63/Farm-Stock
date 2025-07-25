import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, decimal, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Companies table
export const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Account Master table
export const accountMaster = pgTable("account_master", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accountCode: text("account_code").notNull().unique(),
  accountName: text("account_name").notNull(),
  accountType: text("account_type").notNull(),
  parentAccount: text("parent_account"),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Inventory Master table
export const inventoryMaster = pgTable("inventory_master", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemCode: text("item_code").notNull().unique(),
  itemName: text("item_name").notNull(),
  category: text("category").notNull(),
  unit: text("unit").notNull(),
  description: text("description"),
  minimumStock: integer("minimum_stock").default(0),
  maximumStock: integer("maximum_stock").default(0),
  reorderLevel: integer("reorder_level").default(0),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Customers table
export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerCode: text("customer_code").notNull().unique(),
  customerName: text("customer_name").notNull(),
  contactPerson: text("contact_person"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  creditLimit: decimal("credit_limit", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Suppliers table
export const suppliers = pgTable("suppliers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierCode: text("supplier_code").notNull().unique(),
  supplierName: text("supplier_name").notNull(),
  contactPerson: text("contact_person"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  paymentTerms: text("payment_terms"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionNumber: text("transaction_number").notNull().unique(),
  transactionType: text("transaction_type").notNull(),
  accountId: text("account_id").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  referenceNumber: text("reference_number"),
  transactionDate: date("transaction_date").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Stock Transactions table
export const stockTransactions = pgTable("stock_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionNumber: text("transaction_number").notNull().unique(),
  itemId: text("item_id").notNull(),
  transactionType: text("transaction_type").notNull(), // IN, OUT, TRANSFER
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }),
  totalValue: decimal("total_value", { precision: 12, scale: 2 }),
  referenceNumber: text("reference_number"),
  description: text("description"),
  transactionDate: date("transaction_date").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Cold Storage Units table
export const coldStorageUnits = pgTable("cold_storage_units", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  unitCode: text("unit_code").notNull().unique(),
  unitName: text("unit_name").notNull(),
  capacity: integer("capacity").notNull(),
  currentOccupancy: integer("current_occupancy").default(0),
  temperature: decimal("temperature", { precision: 4, scale: 2 }),
  humidity: decimal("humidity", { precision: 4, scale: 2 }),
  location: text("location"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Cold Storage Transactions table
export const coldStorageTransactions = pgTable("cold_storage_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionNumber: text("transaction_number").notNull().unique(),
  unitId: text("unit_id").notNull(),
  itemId: text("item_id").notNull(),
  transactionType: text("transaction_type").notNull(), // IN, OUT
  quantity: integer("quantity").notNull(),
  temperature: decimal("temperature", { precision: 4, scale: 2 }),
  entryDate: date("entry_date"),
  exitDate: date("exit_date"),
  description: text("description"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
});

export const insertAccountMasterSchema = createInsertSchema(accountMaster).omit({
  id: true,
  createdAt: true,
});

export const insertInventoryMasterSchema = createInsertSchema(inventoryMaster).omit({
  id: true,
  createdAt: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertStockTransactionSchema = createInsertSchema(stockTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertColdStorageUnitSchema = createInsertSchema(coldStorageUnits).omit({
  id: true,
  createdAt: true,
});

export const insertColdStorageTransactionSchema = createInsertSchema(coldStorageTransactions).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;
export type InsertAccountMaster = z.infer<typeof insertAccountMasterSchema>;
export type AccountMaster = typeof accountMaster.$inferSelect;
export type InsertInventoryMaster = z.infer<typeof insertInventoryMasterSchema>;
export type InventoryMaster = typeof inventoryMaster.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Supplier = typeof suppliers.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertStockTransaction = z.infer<typeof insertStockTransactionSchema>;
export type StockTransaction = typeof stockTransactions.$inferSelect;
export type InsertColdStorageUnit = z.infer<typeof insertColdStorageUnitSchema>;
export type ColdStorageUnit = typeof coldStorageUnits.$inferSelect;
export type InsertColdStorageTransaction = z.infer<typeof insertColdStorageTransactionSchema>;
export type ColdStorageTransaction = typeof coldStorageTransactions.$inferSelect;
