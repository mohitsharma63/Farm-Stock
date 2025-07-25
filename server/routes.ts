import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertCompanySchema, insertAccountMasterSchema, insertInventoryMasterSchema,
  insertCustomerSchema, insertSupplierSchema, insertAccountingTransactionSchema,
  insertInventoryTransactionSchema, insertColdStorageSchema, insertCrateSchema,
  insertUserSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard metrics
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard metrics" });
    }
  });

  // Companies routes
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await storage.getAllCompanies();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  });

  app.get("/api/companies/:id", async (req, res) => {
    try {
      const company = await storage.getCompany(parseInt(req.params.id));
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch company" });
    }
  });

  app.post("/api/companies", async (req, res) => {
    try {
      const validatedData = insertCompanySchema.parse(req.body);
      const company = await storage.createCompany(validatedData);
      res.status(201).json(company);
    } catch (error) {
      res.status(400).json({ error: "Invalid company data" });
    }
  });

  app.put("/api/companies/:id", async (req, res) => {
    try {
      const validatedData = insertCompanySchema.partial().parse(req.body);
      const company = await storage.updateCompany(parseInt(req.params.id), validatedData);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(400).json({ error: "Invalid company data" });
    }
  });

  app.delete("/api/companies/:id", async (req, res) => {
    try {
      const success = await storage.deleteCompany(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete company" });
    }
  });

  // Account Master routes
  app.get("/api/account-master", async (req, res) => {
    try {
      const accounts = await storage.getAllAccountMaster();
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch accounts" });
    }
  });

  app.post("/api/account-master", async (req, res) => {
    try {
      const validatedData = insertAccountMasterSchema.parse(req.body);
      const account = await storage.createAccountMaster(validatedData);
      res.status(201).json(account);
    } catch (error) {
      res.status(400).json({ error: "Invalid account data" });
    }
  });

  app.put("/api/account-master/:id", async (req, res) => {
    try {
      const validatedData = insertAccountMasterSchema.partial().parse(req.body);
      const account = await storage.updateAccountMaster(parseInt(req.params.id), validatedData);
      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }
      res.json(account);
    } catch (error) {
      res.status(400).json({ error: "Invalid account data" });
    }
  });

  app.delete("/api/account-master/:id", async (req, res) => {
    try {
      const success = await storage.deleteAccountMaster(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ error: "Account not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete account" });
    }
  });

  // Inventory Master routes
  app.get("/api/inventory-master", async (req, res) => {
    try {
      const items = await storage.getAllInventoryMaster();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory items" });
    }
  });

  app.get("/api/inventory-master/low-stock", async (req, res) => {
    try {
      const items = await storage.getLowStockItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch low stock items" });
    }
  });

  app.post("/api/inventory-master", async (req, res) => {
    try {
      const validatedData = insertInventoryMasterSchema.parse(req.body);
      const item = await storage.createInventoryMaster(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid inventory data" });
    }
  });

  app.put("/api/inventory-master/:id", async (req, res) => {
    try {
      const validatedData = insertInventoryMasterSchema.partial().parse(req.body);
      const item = await storage.updateInventoryMaster(parseInt(req.params.id), validatedData);
      if (!item) {
        return res.status(404).json({ error: "Inventory item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid inventory data" });
    }
  });

  app.delete("/api/inventory-master/:id", async (req, res) => {
    try {
      const success = await storage.deleteInventoryMaster(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ error: "Inventory item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete inventory item" });
    }
  });

  // Customers routes
  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await storage.getAllCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(validatedData);
      res.status(201).json(customer);
    } catch (error) {
      res.status(400).json({ error: "Invalid customer data" });
    }
  });

  app.put("/api/customers/:id", async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.partial().parse(req.body);
      const customer = await storage.updateCustomer(parseInt(req.params.id), validatedData);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      res.status(400).json({ error: "Invalid customer data" });
    }
  });

  app.delete("/api/customers/:id", async (req, res) => {
    try {
      const success = await storage.deleteCustomer(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete customer" });
    }
  });

  // Suppliers routes
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getAllSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch suppliers" });
    }
  });

  app.post("/api/suppliers", async (req, res) => {
    try {
      const validatedData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(validatedData);
      res.status(201).json(supplier);
    } catch (error) {
      res.status(400).json({ error: "Invalid supplier data" });
    }
  });

  app.put("/api/suppliers/:id", async (req, res) => {
    try {
      const validatedData = insertSupplierSchema.partial().parse(req.body);
      const supplier = await storage.updateSupplier(parseInt(req.params.id), validatedData);
      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error) {
      res.status(400).json({ error: "Invalid supplier data" });
    }
  });

  app.delete("/api/suppliers/:id", async (req, res) => {
    try {
      const success = await storage.deleteSupplier(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ error: "Supplier not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete supplier" });
    }
  });

  // Accounting Transactions routes
  app.get("/api/accounting-transactions", async (req, res) => {
    try {
      const transactions = await storage.getAllAccountingTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch accounting transactions" });
    }
  });

  app.post("/api/accounting-transactions", async (req, res) => {
    try {
      const validatedData = insertAccountingTransactionSchema.parse(req.body);
      const transaction = await storage.createAccountingTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ error: "Invalid transaction data" });
    }
  });

  // Inventory Transactions routes
  app.get("/api/inventory-transactions", async (req, res) => {
    try {
      const transactions = await storage.getAllInventoryTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory transactions" });
    }
  });

  app.post("/api/inventory-transactions", async (req, res) => {
    try {
      const validatedData = insertInventoryTransactionSchema.parse(req.body);
      const transaction = await storage.createInventoryTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ error: "Invalid transaction data" });
    }
  });

  // Cold Storage routes
  app.get("/api/cold-storage", async (req, res) => {
    try {
      const coldStorage = await storage.getAllColdStorage();
      res.json(coldStorage);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cold storage data" });
    }
  });

  app.post("/api/cold-storage", async (req, res) => {
    try {
      const validatedData = insertColdStorageSchema.parse(req.body);
      const coldStorageItem = await storage.createColdStorage(validatedData);
      res.status(201).json(coldStorageItem);
    } catch (error) {
      res.status(400).json({ error: "Invalid cold storage data" });
    }
  });

  // Crates routes
  app.get("/api/crates", async (req, res) => {
    try {
      const crates = await storage.getAllCrates();
      res.json(crates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch crates" });
    }
  });

  app.post("/api/crates", async (req, res) => {
    try {
      const validatedData = insertCrateSchema.parse(req.body);
      const crate = await storage.createCrate(validatedData);
      res.status(201).json(crate);
    } catch (error) {
      res.status(400).json({ error: "Invalid crate data" });
    }
  });

  // User Management routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const validatedData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(parseInt(req.params.id), validatedData);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const success = await storage.deleteUser(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
