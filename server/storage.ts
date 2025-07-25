import { 
  type User, 
  type InsertUser, 
  type Company, 
  type InsertCompany,
  type AccountMaster,
  type InsertAccountMaster,
  type InventoryMaster,
  type InsertInventoryMaster,
  type Customer,
  type InsertCustomer,
  type Supplier,
  type InsertSupplier,
  type Transaction,
  type InsertTransaction,
  type StockTransaction,
  type InsertStockTransaction,
  type ColdStorageUnit,
  type InsertColdStorageUnit,
  type ColdStorageTransaction,
  type InsertColdStorageTransaction
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Company methods
  getCompanies(): Promise<Company[]>;
  getCompany(id: string): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: string, company: Partial<InsertCompany>): Promise<Company | undefined>;
  deleteCompany(id: string): Promise<boolean>;

  // Account Master methods
  getAccountMasters(): Promise<AccountMaster[]>;
  getAccountMaster(id: string): Promise<AccountMaster | undefined>;
  createAccountMaster(account: InsertAccountMaster): Promise<AccountMaster>;
  updateAccountMaster(id: string, account: Partial<InsertAccountMaster>): Promise<AccountMaster | undefined>;
  deleteAccountMaster(id: string): Promise<boolean>;

  // Inventory Master methods
  getInventoryMasters(): Promise<InventoryMaster[]>;
  getInventoryMaster(id: string): Promise<InventoryMaster | undefined>;
  createInventoryMaster(item: InsertInventoryMaster): Promise<InventoryMaster>;
  updateInventoryMaster(id: string, item: Partial<InsertInventoryMaster>): Promise<InventoryMaster | undefined>;
  deleteInventoryMaster(id: string): Promise<boolean>;

  // Customer methods
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: string): Promise<boolean>;

  // Supplier methods
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: string): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: string, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  deleteSupplier(id: string): Promise<boolean>;

  // Transaction methods
  getTransactions(): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: string, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: string): Promise<boolean>;

  // Stock Transaction methods
  getStockTransactions(): Promise<StockTransaction[]>;
  getStockTransaction(id: string): Promise<StockTransaction | undefined>;
  createStockTransaction(transaction: InsertStockTransaction): Promise<StockTransaction>;
  updateStockTransaction(id: string, transaction: Partial<InsertStockTransaction>): Promise<StockTransaction | undefined>;
  deleteStockTransaction(id: string): Promise<boolean>;

  // Cold Storage Unit methods
  getColdStorageUnits(): Promise<ColdStorageUnit[]>;
  getColdStorageUnit(id: string): Promise<ColdStorageUnit | undefined>;
  createColdStorageUnit(unit: InsertColdStorageUnit): Promise<ColdStorageUnit>;
  updateColdStorageUnit(id: string, unit: Partial<InsertColdStorageUnit>): Promise<ColdStorageUnit | undefined>;
  deleteColdStorageUnit(id: string): Promise<boolean>;

  // Cold Storage Transaction methods
  getColdStorageTransactions(): Promise<ColdStorageTransaction[]>;
  getColdStorageTransaction(id: string): Promise<ColdStorageTransaction | undefined>;
  createColdStorageTransaction(transaction: InsertColdStorageTransaction): Promise<ColdStorageTransaction>;
  updateColdStorageTransaction(id: string, transaction: Partial<InsertColdStorageTransaction>): Promise<ColdStorageTransaction | undefined>;
  deleteColdStorageTransaction(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private companies: Map<string, Company> = new Map();
  private accountMasters: Map<string, AccountMaster> = new Map();
  private inventoryMasters: Map<string, InventoryMaster> = new Map();
  private customers: Map<string, Customer> = new Map();
  private suppliers: Map<string, Supplier> = new Map();
  private transactions: Map<string, Transaction> = new Map();
  private stockTransactions: Map<string, StockTransaction> = new Map();
  private coldStorageUnits: Map<string, ColdStorageUnit> = new Map();
  private coldStorageTransactions: Map<string, ColdStorageTransaction> = new Map();

  constructor() {
    // Initialize with some default data
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Add default companies
    const company1: Company = {
      id: "comp1",
      name: "AgriCorp Ltd.",
      code: "AC001",
      email: "contact@agricorp.com",
      phone: "+1-555-0101",
      address: "123 Farm Road",
      city: "Fresno",
      state: "CA",
      zipCode: "93701",
      isActive: true,
      createdAt: new Date("2024-01-15"),
    };
    this.companies.set(company1.id, company1);

    const company2: Company = {
      id: "comp2",
      name: "Fresh Harvest Inc.",
      code: "FH002",
      email: "info@freshharvest.com",
      phone: "+1-555-0102",
      address: "456 Green Valley",
      city: "Orlando",
      state: "FL",
      zipCode: "32801",
      isActive: true,
      createdAt: new Date("2024-02-03"),
    };
    this.companies.set(company2.id, company2);

    // Add default inventory items
    const item1: InventoryMaster = {
      id: "item1",
      itemCode: "CAR001",
      itemName: "Fresh Carrots",
      category: "Vegetables",
      unit: "kg",
      description: "Premium quality fresh carrots",
      minimumStock: 100,
      maximumStock: 1000,
      reorderLevel: 200,
      unitPrice: "5.00",
      isActive: true,
      createdAt: new Date(),
    };
    this.inventoryMasters.set(item1.id, item1);

    // Add default customers
    const customer1: Customer = {
      id: "cust1",
      customerCode: "CUST001",
      customerName: "Green Market Co.",
      contactPerson: "John Smith",
      email: "john@greenmarket.com",
      phone: "+1-555-0201",
      address: "789 Market Street",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      creditLimit: "50000.00",
      isActive: true,
      createdAt: new Date(),
    };
    this.customers.set(customer1.id, customer1);

    // Add default cold storage unit
    const coldUnit1: ColdStorageUnit = {
      id: "cold1",
      unitCode: "CS001",
      unitName: "Cold Storage Unit #1",
      capacity: 1000,
      currentOccupancy: 650,
      temperature: "-2.5",
      humidity: "85.0",
      location: "Warehouse A",
      isActive: true,
      createdAt: new Date(),
    };
    this.coldStorageUnits.set(coldUnit1.id, coldUnit1);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Company methods
  async getCompanies(): Promise<Company[]> {
    return Array.from(this.companies.values());
  }

  async getCompany(id: string): Promise<Company | undefined> {
    return this.companies.get(id);
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = randomUUID();
    const company: Company = { 
      ...insertCompany, 
      id, 
      createdAt: new Date() 
    };
    this.companies.set(id, company);
    return company;
  }

  async updateCompany(id: string, updates: Partial<InsertCompany>): Promise<Company | undefined> {
    const company = this.companies.get(id);
    if (!company) return undefined;
    
    const updated = { ...company, ...updates };
    this.companies.set(id, updated);
    return updated;
  }

  async deleteCompany(id: string): Promise<boolean> {
    return this.companies.delete(id);
  }

  // Account Master methods
  async getAccountMasters(): Promise<AccountMaster[]> {
    return Array.from(this.accountMasters.values());
  }

  async getAccountMaster(id: string): Promise<AccountMaster | undefined> {
    return this.accountMasters.get(id);
  }

  async createAccountMaster(insertAccount: InsertAccountMaster): Promise<AccountMaster> {
    const id = randomUUID();
    const account: AccountMaster = { 
      ...insertAccount, 
      id, 
      createdAt: new Date() 
    };
    this.accountMasters.set(id, account);
    return account;
  }

  async updateAccountMaster(id: string, updates: Partial<InsertAccountMaster>): Promise<AccountMaster | undefined> {
    const account = this.accountMasters.get(id);
    if (!account) return undefined;
    
    const updated = { ...account, ...updates };
    this.accountMasters.set(id, updated);
    return updated;
  }

  async deleteAccountMaster(id: string): Promise<boolean> {
    return this.accountMasters.delete(id);
  }

  // Inventory Master methods
  async getInventoryMasters(): Promise<InventoryMaster[]> {
    return Array.from(this.inventoryMasters.values());
  }

  async getInventoryMaster(id: string): Promise<InventoryMaster | undefined> {
    return this.inventoryMasters.get(id);
  }

  async createInventoryMaster(insertItem: InsertInventoryMaster): Promise<InventoryMaster> {
    const id = randomUUID();
    const item: InventoryMaster = { 
      ...insertItem, 
      id, 
      createdAt: new Date() 
    };
    this.inventoryMasters.set(id, item);
    return item;
  }

  async updateInventoryMaster(id: string, updates: Partial<InsertInventoryMaster>): Promise<InventoryMaster | undefined> {
    const item = this.inventoryMasters.get(id);
    if (!item) return undefined;
    
    const updated = { ...item, ...updates };
    this.inventoryMasters.set(id, updated);
    return updated;
  }

  async deleteInventoryMaster(id: string): Promise<boolean> {
    return this.inventoryMasters.delete(id);
  }

  // Customer methods
  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const customer: Customer = { 
      ...insertCustomer, 
      id, 
      createdAt: new Date() 
    };
    this.customers.set(id, customer);
    return customer;
  }

  async updateCustomer(id: string, updates: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const customer = this.customers.get(id);
    if (!customer) return undefined;
    
    const updated = { ...customer, ...updates };
    this.customers.set(id, updated);
    return updated;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    return this.customers.delete(id);
  }

  // Supplier methods
  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplier(id: string): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = randomUUID();
    const supplier: Supplier = { 
      ...insertSupplier, 
      id, 
      createdAt: new Date() 
    };
    this.suppliers.set(id, supplier);
    return supplier;
  }

  async updateSupplier(id: string, updates: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const supplier = this.suppliers.get(id);
    if (!supplier) return undefined;
    
    const updated = { ...supplier, ...updates };
    this.suppliers.set(id, updated);
    return updated;
  }

  async deleteSupplier(id: string): Promise<boolean> {
    return this.suppliers.delete(id);
  }

  // Transaction methods
  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = { 
      ...insertTransaction, 
      id, 
      createdAt: new Date() 
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: string, updates: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const updated = { ...transaction, ...updates };
    this.transactions.set(id, updated);
    return updated;
  }

  async deleteTransaction(id: string): Promise<boolean> {
    return this.transactions.delete(id);
  }

  // Stock Transaction methods
  async getStockTransactions(): Promise<StockTransaction[]> {
    return Array.from(this.stockTransactions.values());
  }

  async getStockTransaction(id: string): Promise<StockTransaction | undefined> {
    return this.stockTransactions.get(id);
  }

  async createStockTransaction(insertTransaction: InsertStockTransaction): Promise<StockTransaction> {
    const id = randomUUID();
    const transaction: StockTransaction = { 
      ...insertTransaction, 
      id, 
      createdAt: new Date() 
    };
    this.stockTransactions.set(id, transaction);
    return transaction;
  }

  async updateStockTransaction(id: string, updates: Partial<InsertStockTransaction>): Promise<StockTransaction | undefined> {
    const transaction = this.stockTransactions.get(id);
    if (!transaction) return undefined;
    
    const updated = { ...transaction, ...updates };
    this.stockTransactions.set(id, updated);
    return updated;
  }

  async deleteStockTransaction(id: string): Promise<boolean> {
    return this.stockTransactions.delete(id);
  }

  // Cold Storage Unit methods
  async getColdStorageUnits(): Promise<ColdStorageUnit[]> {
    return Array.from(this.coldStorageUnits.values());
  }

  async getColdStorageUnit(id: string): Promise<ColdStorageUnit | undefined> {
    return this.coldStorageUnits.get(id);
  }

  async createColdStorageUnit(insertUnit: InsertColdStorageUnit): Promise<ColdStorageUnit> {
    const id = randomUUID();
    const unit: ColdStorageUnit = { 
      ...insertUnit, 
      id, 
      createdAt: new Date() 
    };
    this.coldStorageUnits.set(id, unit);
    return unit;
  }

  async updateColdStorageUnit(id: string, updates: Partial<InsertColdStorageUnit>): Promise<ColdStorageUnit | undefined> {
    const unit = this.coldStorageUnits.get(id);
    if (!unit) return undefined;
    
    const updated = { ...unit, ...updates };
    this.coldStorageUnits.set(id, updated);
    return updated;
  }

  async deleteColdStorageUnit(id: string): Promise<boolean> {
    return this.coldStorageUnits.delete(id);
  }

  // Cold Storage Transaction methods
  async getColdStorageTransactions(): Promise<ColdStorageTransaction[]> {
    return Array.from(this.coldStorageTransactions.values());
  }

  async getColdStorageTransaction(id: string): Promise<ColdStorageTransaction | undefined> {
    return this.coldStorageTransactions.get(id);
  }

  async createColdStorageTransaction(insertTransaction: InsertColdStorageTransaction): Promise<ColdStorageTransaction> {
    const id = randomUUID();
    const transaction: ColdStorageTransaction = { 
      ...insertTransaction, 
      id, 
      createdAt: new Date() 
    };
    this.coldStorageTransactions.set(id, transaction);
    return transaction;
  }

  async updateColdStorageTransaction(id: string, updates: Partial<InsertColdStorageTransaction>): Promise<ColdStorageTransaction | undefined> {
    const transaction = this.coldStorageTransactions.get(id);
    if (!transaction) return undefined;
    
    const updated = { ...transaction, ...updates };
    this.coldStorageTransactions.set(id, updated);
    return updated;
  }

  async deleteColdStorageTransaction(id: string): Promise<boolean> {
    return this.coldStorageTransactions.delete(id);
  }
}

export const storage = new MemStorage();
