import {
  users, companies, accountMaster, inventoryMaster, customers, suppliers,
  accountingTransactions, inventoryTransactions, coldStorage, crates,
  type User, type InsertUser, type Company, type InsertCompany,
  type AccountMaster, type InsertAccountMaster, type InventoryMaster, type InsertInventoryMaster,
  type Customer, type InsertCustomer, type Supplier, type InsertSupplier,
  type AccountingTransaction, type InsertAccountingTransaction,
  type InventoryTransaction, type InsertInventoryTransaction,
  type ColdStorage, type InsertColdStorage, type Crate, type InsertCrate
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;

  // Companies
  getAllCompanies(): Promise<Company[]>;
  getCompany(id: number): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company | undefined>;
  deleteCompany(id: number): Promise<boolean>;

  // Account Master
  getAllAccountMaster(): Promise<AccountMaster[]>;
  getAccountMaster(id: number): Promise<AccountMaster | undefined>;
  createAccountMaster(account: InsertAccountMaster): Promise<AccountMaster>;
  updateAccountMaster(id: number, account: Partial<InsertAccountMaster>): Promise<AccountMaster | undefined>;
  deleteAccountMaster(id: number): Promise<boolean>;

  // Inventory Master
  getAllInventoryMaster(): Promise<InventoryMaster[]>;
  getInventoryMaster(id: number): Promise<InventoryMaster | undefined>;
  createInventoryMaster(item: InsertInventoryMaster): Promise<InventoryMaster>;
  updateInventoryMaster(id: number, item: Partial<InsertInventoryMaster>): Promise<InventoryMaster | undefined>;
  deleteInventoryMaster(id: number): Promise<boolean>;
  getLowStockItems(): Promise<InventoryMaster[]>;

  // Customers
  getAllCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: number): Promise<boolean>;

  // Suppliers
  getAllSuppliers(): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  deleteSupplier(id: number): Promise<boolean>;

  // Accounting Transactions
  getAllAccountingTransactions(): Promise<AccountingTransaction[]>;
  getAccountingTransaction(id: number): Promise<AccountingTransaction | undefined>;
  createAccountingTransaction(transaction: InsertAccountingTransaction): Promise<AccountingTransaction>;
  updateAccountingTransaction(id: number, transaction: Partial<InsertAccountingTransaction>): Promise<AccountingTransaction | undefined>;
  deleteAccountingTransaction(id: number): Promise<boolean>;

  // Inventory Transactions
  getAllInventoryTransactions(): Promise<InventoryTransaction[]>;
  getInventoryTransaction(id: number): Promise<InventoryTransaction | undefined>;
  createInventoryTransaction(transaction: InsertInventoryTransaction): Promise<InventoryTransaction>;
  updateInventoryTransaction(id: number, transaction: Partial<InsertInventoryTransaction>): Promise<InventoryTransaction | undefined>;
  deleteInventoryTransaction(id: number): Promise<boolean>;

  // Cold Storage
  getAllColdStorage(): Promise<ColdStorage[]>;
  getColdStorage(id: number): Promise<ColdStorage | undefined>;
  createColdStorage(storage: InsertColdStorage): Promise<ColdStorage>;
  updateColdStorage(id: number, storage: Partial<InsertColdStorage>): Promise<ColdStorage | undefined>;
  deleteColdStorage(id: number): Promise<boolean>;

  // Crates
  getAllCrates(): Promise<Crate[]>;
  getCrate(id: number): Promise<Crate | undefined>;
  createCrate(crate: InsertCrate): Promise<Crate>;
  updateCrate(id: number, crate: Partial<InsertCrate>): Promise<Crate | undefined>;
  deleteCrate(id: number): Promise<boolean>;

  // Dashboard metrics
  getDashboardMetrics(): Promise<{
    totalRevenue: number;
    totalItems: number;
    activeCustomers: number;
    coldStorageCapacity: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private companies: Map<number, Company> = new Map();
  private accountMaster: Map<number, AccountMaster> = new Map();
  private inventoryMaster: Map<number, InventoryMaster> = new Map();
  private customers: Map<number, Customer> = new Map();
  private suppliers: Map<number, Supplier> = new Map();
  private accountingTransactions: Map<number, AccountingTransaction> = new Map();
  private inventoryTransactions: Map<number, InventoryTransaction> = new Map();
  private coldStorage: Map<number, ColdStorage> = new Map();
  private crates: Map<number, Crate> = new Map();
  
  private currentIds = {
    users: 1,
    companies: 1,
    accountMaster: 1,
    inventoryMaster: 1,
    customers: 1,
    suppliers: 1,
    accountingTransactions: 1,
    inventoryTransactions: 1,
    coldStorage: 1,
    crates: 1
  };

  constructor() {
    // Initialize with sample data for demonstration
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample companies
    this.companies.set(1, { id: 1, name: "Tech Solutions Inc.", address: "123 Business St", phone: "+1-555-0123", email: "info@techsolutions.com", taxId: "TAX123456", registrationNumber: "REG789012", isActive: true });

    // Sample account master
    this.accountMaster.set(1, { id: 1, accountCode: "1000", accountName: "Cash", accountType: "Asset", parentAccountId: null, description: "Cash in hand and bank", isActive: true });
    this.accountMaster.set(2, { id: 2, accountCode: "2000", accountName: "Accounts Payable", accountType: "Liability", parentAccountId: null, description: "Money owed to suppliers", isActive: true });

    // Sample inventory master
    this.inventoryMaster.set(1, { id: 1, sku: "APL-001", itemName: "Organic Apples", description: "Fresh organic apples", category: "Fruits", unit: "kg", minimumStock: 20, maximumStock: 500, currentStock: 12, unitPrice: "3.50", isActive: true });
    this.inventoryMaster.set(2, { id: 2, sku: "CAR-002", itemName: "Fresh Carrots", description: "Farm fresh carrots", category: "Vegetables", unit: "kg", minimumStock: 15, maximumStock: 300, currentStock: 8, unitPrice: "2.25", isActive: true });

    // Sample customers
    this.customers.set(1, { id: 1, customerCode: "CUST001", name: "Acme Corp Ltd.", contactPerson: "John Smith", address: "456 Market Ave", phone: "+1-555-0456", email: "john@acmecorp.com", creditLimit: "10000.00", paymentTerms: "Net 30", isActive: true });
    this.customers.set(2, { id: 2, customerCode: "CUST002", name: "Fresh Foods Inc.", contactPerson: "Sarah Johnson", address: "789 Food Plaza", phone: "+1-555-0789", email: "sarah@freshfoods.com", creditLimit: "15000.00", paymentTerms: "Net 15", isActive: true });

    // Sample suppliers
    this.suppliers.set(1, { id: 1, supplierCode: "SUP001", name: "Farm Fresh Supplies", contactPerson: "Mike Wilson", address: "321 Farm Road", phone: "+1-555-0321", email: "mike@farmfresh.com", paymentTerms: "Net 30", isActive: true });

    // Update current IDs
    this.currentIds.companies = 2;
    this.currentIds.accountMaster = 3;
    this.currentIds.inventoryMaster = 3;
    this.currentIds.customers = 3;
    this.currentIds.suppliers = 2;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
      role: insertUser.role || "user",
      isActive: insertUser.isActive !== undefined ? insertUser.isActive : true
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updateUser: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...updateUser };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Company methods
  async getAllCompanies(): Promise<Company[]> {
    return Array.from(this.companies.values());
  }

  async getCompany(id: number): Promise<Company | undefined> {
    return this.companies.get(id);
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = this.currentIds.companies++;
    const company: Company = {
      ...insertCompany,
      id,
      isActive: insertCompany.isActive !== undefined ? insertCompany.isActive : true
    };
    this.companies.set(id, company);
    return company;
  }

  async updateCompany(id: number, updateCompany: Partial<InsertCompany>): Promise<Company | undefined> {
    const company = this.companies.get(id);
    if (!company) return undefined;
    const updatedCompany = { ...company, ...updateCompany };
    this.companies.set(id, updatedCompany);
    return updatedCompany;
  }

  async deleteCompany(id: number): Promise<boolean> {
    return this.companies.delete(id);
  }

  // Account Master methods
  async getAllAccountMaster(): Promise<AccountMaster[]> {
    return Array.from(this.accountMaster.values());
  }

  async getAccountMaster(id: number): Promise<AccountMaster | undefined> {
    return this.accountMaster.get(id);
  }

  async createAccountMaster(insertAccount: InsertAccountMaster): Promise<AccountMaster> {
    const id = this.currentIds.accountMaster++;
    const account: AccountMaster = {
      ...insertAccount,
      id,
      description: insertAccount.description || null,
      isActive: insertAccount.isActive !== undefined ? insertAccount.isActive : true,
      parentAccountId: insertAccount.parentAccountId || null
    };
    this.accountMaster.set(id, account);
    return account;
  }

  async updateAccountMaster(id: number, updateAccount: Partial<InsertAccountMaster>): Promise<AccountMaster | undefined> {
    const account = this.accountMaster.get(id);
    if (!account) return undefined;
    const updatedAccount = { ...account, ...updateAccount };
    this.accountMaster.set(id, updatedAccount);
    return updatedAccount;
  }

  async deleteAccountMaster(id: number): Promise<boolean> {
    return this.accountMaster.delete(id);
  }

  // Inventory Master methods
  async getAllInventoryMaster(): Promise<InventoryMaster[]> {
    return Array.from(this.inventoryMaster.values());
  }

  async getInventoryMaster(id: number): Promise<InventoryMaster | undefined> {
    return this.inventoryMaster.get(id);
  }

  async createInventoryMaster(insertItem: InsertInventoryMaster): Promise<InventoryMaster> {
    const id = this.currentIds.inventoryMaster++;
    const item: InventoryMaster = {
      ...insertItem,
      id,
      description: insertItem.description || null,
      isActive: insertItem.isActive !== undefined ? insertItem.isActive : true,
      minimumStock: insertItem.minimumStock || 0,
      maximumStock: insertItem.maximumStock || 0,
      currentStock: insertItem.currentStock || 0
    };
    this.inventoryMaster.set(id, item);
    return item;
  }

  async updateInventoryMaster(id: number, updateItem: Partial<InsertInventoryMaster>): Promise<InventoryMaster | undefined> {
    const item = this.inventoryMaster.get(id);
    if (!item) return undefined;
    const updatedItem = { ...item, ...updateItem };
    this.inventoryMaster.set(id, updatedItem);
    return updatedItem;
  }

  async deleteInventoryMaster(id: number): Promise<boolean> {
    return this.inventoryMaster.delete(id);
  }

  async getLowStockItems(): Promise<InventoryMaster[]> {
    return Array.from(this.inventoryMaster.values()).filter(item => item.currentStock <= item.minimumStock);
  }

  // Customer methods
  async getAllCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = this.currentIds.customers++;
    const customer: Customer = {
      ...insertCustomer,
      id,
      email: insertCustomer.email || null,
      isActive: insertCustomer.isActive !== undefined ? insertCustomer.isActive : true,
      contactPerson: insertCustomer.contactPerson || null,
      creditLimit: insertCustomer.creditLimit || "0",
      paymentTerms: insertCustomer.paymentTerms || null
    };
    this.customers.set(id, customer);
    return customer;
  }

  async updateCustomer(id: number, updateCustomer: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const customer = this.customers.get(id);
    if (!customer) return undefined;
    const updatedCustomer = { ...customer, ...updateCustomer };
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }

  async deleteCustomer(id: number): Promise<boolean> {
    return this.customers.delete(id);
  }

  // Supplier methods
  async getAllSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = this.currentIds.suppliers++;
    const supplier: Supplier = {
      ...insertSupplier,
      id,
      email: insertSupplier.email || null,
      isActive: insertSupplier.isActive !== undefined ? insertSupplier.isActive : true,
      contactPerson: insertSupplier.contactPerson || null,
      paymentTerms: insertSupplier.paymentTerms || null
    };
    this.suppliers.set(id, supplier);
    return supplier;
  }

  async updateSupplier(id: number, updateSupplier: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const supplier = this.suppliers.get(id);
    if (!supplier) return undefined;
    const updatedSupplier = { ...supplier, ...updateSupplier };
    this.suppliers.set(id, updatedSupplier);
    return updatedSupplier;
  }

  async deleteSupplier(id: number): Promise<boolean> {
    return this.suppliers.delete(id);
  }

  // Accounting Transaction methods
  async getAllAccountingTransactions(): Promise<AccountingTransaction[]> {
    return Array.from(this.accountingTransactions.values());
  }

  async getAccountingTransaction(id: number): Promise<AccountingTransaction | undefined> {
    return this.accountingTransactions.get(id);
  }

  async createAccountingTransaction(insertTransaction: InsertAccountingTransaction): Promise<AccountingTransaction> {
    const id = this.currentIds.accountingTransactions++;
    const transaction: AccountingTransaction = {
      ...insertTransaction,
      id,
      debitAmount: insertTransaction.debitAmount || "0",
      creditAmount: insertTransaction.creditAmount || "0",
      referenceType: insertTransaction.referenceType || null,
      referenceId: insertTransaction.referenceId || null
    };
    this.accountingTransactions.set(id, transaction);
    return transaction;
  }

  async updateAccountingTransaction(id: number, updateTransaction: Partial<InsertAccountingTransaction>): Promise<AccountingTransaction | undefined> {
    const transaction = this.accountingTransactions.get(id);
    if (!transaction) return undefined;
    const updatedTransaction = { ...transaction, ...updateTransaction };
    this.accountingTransactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  async deleteAccountingTransaction(id: number): Promise<boolean> {
    return this.accountingTransactions.delete(id);
  }

  // Inventory Transaction methods
  async getAllInventoryTransactions(): Promise<InventoryTransaction[]> {
    return Array.from(this.inventoryTransactions.values());
  }

  async getInventoryTransaction(id: number): Promise<InventoryTransaction | undefined> {
    return this.inventoryTransactions.get(id);
  }

  async createInventoryTransaction(insertTransaction: InsertInventoryTransaction): Promise<InventoryTransaction> {
    const id = this.currentIds.inventoryTransactions++;
    const transaction: InventoryTransaction = {
      ...insertTransaction,
      id,
      description: insertTransaction.description || null,
      referenceType: insertTransaction.referenceType || null,
      referenceId: insertTransaction.referenceId || null
    };
    this.inventoryTransactions.set(id, transaction);
    return transaction;
  }

  async updateInventoryTransaction(id: number, updateTransaction: Partial<InsertInventoryTransaction>): Promise<InventoryTransaction | undefined> {
    const transaction = this.inventoryTransactions.get(id);
    if (!transaction) return undefined;
    const updatedTransaction = { ...transaction, ...updateTransaction };
    this.inventoryTransactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  async deleteInventoryTransaction(id: number): Promise<boolean> {
    return this.inventoryTransactions.delete(id);
  }

  // Cold Storage methods
  async getAllColdStorage(): Promise<ColdStorage[]> {
    return Array.from(this.coldStorage.values());
  }

  async getColdStorage(id: number): Promise<ColdStorage | undefined> {
    return this.coldStorage.get(id);
  }

  async createColdStorage(insertStorage: InsertColdStorage): Promise<ColdStorage> {
    const id = this.currentIds.coldStorage++;
    const storage: ColdStorage = {
      ...insertStorage,
      id,
      status: insertStorage.status || "active",
      humidity: insertStorage.humidity || null,
      expiryDate: insertStorage.expiryDate || null
    };
    this.coldStorage.set(id, storage);
    return storage;
  }

  async updateColdStorage(id: number, updateStorage: Partial<InsertColdStorage>): Promise<ColdStorage | undefined> {
    const storage = this.coldStorage.get(id);
    if (!storage) return undefined;
    const updatedStorage = { ...storage, ...updateStorage };
    this.coldStorage.set(id, updatedStorage);
    return updatedStorage;
  }

  async deleteColdStorage(id: number): Promise<boolean> {
    return this.coldStorage.delete(id);
  }

  // Crate methods
  async getAllCrates(): Promise<Crate[]> {
    return Array.from(this.crates.values());
  }

  async getCrate(id: number): Promise<Crate | undefined> {
    return this.crates.get(id);
  }

  async createCrate(insertCrate: InsertCrate): Promise<Crate> {
    const id = this.currentIds.crates++;
    const crate: Crate = {
      ...insertCrate,
      id,
      lastUpdated: new Date(),
      status: insertCrate.status || "available",
      customerId: insertCrate.customerId || null,
      supplierId: insertCrate.supplierId || null
    };
    this.crates.set(id, crate);
    return crate;
  }

  async updateCrate(id: number, updateCrate: Partial<InsertCrate>): Promise<Crate | undefined> {
    const crate = this.crates.get(id);
    if (!crate) return undefined;
    const updatedCrate = { ...crate, ...updateCrate, lastUpdated: new Date() };
    this.crates.set(id, updatedCrate);
    return updatedCrate;
  }

  async deleteCrate(id: number): Promise<boolean> {
    return this.crates.delete(id);
  }

  // Dashboard metrics
  async getDashboardMetrics(): Promise<{
    totalRevenue: number;
    totalItems: number;
    activeCustomers: number;
    coldStorageCapacity: number;
  }> {
    const totalRevenue = Array.from(this.accountingTransactions.values())
      .reduce((sum, t) => sum + parseFloat(t.creditAmount), 0);
    
    const totalItems = this.inventoryMaster.size;
    const activeCustomers = Array.from(this.customers.values()).filter(c => c.isActive).length;
    const coldStorageCapacity = 89; // Mock percentage

    return {
      totalRevenue,
      totalItems,
      activeCustomers,
      coldStorageCapacity
    };
  }
}

export const storage = new MemStorage();
