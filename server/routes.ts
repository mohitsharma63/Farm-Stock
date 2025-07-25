import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCompanySchema,
  insertAccountMasterSchema,
  insertInventoryMasterSchema,
  insertCustomerSchema,
  insertSupplierSchema,
  insertTransactionSchema,
  insertStockTransactionSchema,
  insertColdStorageUnitSchema,
  insertColdStorageTransactionSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Company routes
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await storage.getCompanies();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });

  app.get("/api/companies/:id", async (req, res) => {
    try {
      const company = await storage.getCompany(req.params.id);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch company" });
    }
  });

  app.post("/api/companies", async (req, res) => {
    try {
      const validatedData = insertCompanySchema.parse(req.body);
      const company = await storage.createCompany(validatedData);
      res.status(201).json(company);
    } catch (error) {
      res.status(400).json({ message: "Invalid company data" });
    }
  });

  app.put("/api/companies/:id", async (req, res) => {
    try {
      const validatedData = insertCompanySchema.partial().parse(req.body);
      const company = await storage.updateCompany(req.params.id, validatedData);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(400).json({ message: "Invalid company data" });
    }
  });

  app.delete("/api/companies/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCompany(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete company" });
    }
  });

  // Account Master routes
  app.get("/api/account-masters", async (req, res) => {
    try {
      const accounts = await storage.getAccountMasters();
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch account masters" });
    }
  });

  app.post("/api/account-masters", async (req, res) => {
    try {
      const validatedData = insertAccountMasterSchema.parse(req.body);
      const account = await storage.createAccountMaster(validatedData);
      res.status(201).json(account);
    } catch (error) {
      res.status(400).json({ message: "Invalid account master data" });
    }
  });

  app.put("/api/account-masters/:id", async (req, res) => {
    try {
      const validatedData = insertAccountMasterSchema.partial().parse(req.body);
      const account = await storage.updateAccountMaster(req.params.id, validatedData);
      if (!account) {
        return res.status(404).json({ message: "Account master not found" });
      }
      res.json(account);
    } catch (error) {
      res.status(400).json({ message: "Invalid account master data" });
    }
  });

  app.delete("/api/account-masters/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAccountMaster(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Account master not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete account master" });
    }
  });

  // Inventory Master routes
  app.get("/api/inventory-masters", async (req, res) => {
    try {
      const items = await storage.getInventoryMasters();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory masters" });
    }
  });

  app.post("/api/inventory-masters", async (req, res) => {
    try {
      const validatedData = insertInventoryMasterSchema.parse(req.body);
      const item = await storage.createInventoryMaster(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid inventory master data" });
    }
  });

  app.put("/api/inventory-masters/:id", async (req, res) => {
    try {
      const validatedData = insertInventoryMasterSchema.partial().parse(req.body);
      const item = await storage.updateInventoryMaster(req.params.id, validatedData);
      if (!item) {
        return res.status(404).json({ message: "Inventory master not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid inventory master data" });
    }
  });

  app.delete("/api/inventory-masters/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteInventoryMaster(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Inventory master not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete inventory master" });
    }
  });

  // Customer routes
  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(validatedData);
      res.status(201).json(customer);
    } catch (error) {
      res.status(400).json({ message: "Invalid customer data" });
    }
  });

  app.put("/api/customers/:id", async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.partial().parse(req.body);
      const customer = await storage.updateCustomer(req.params.id, validatedData);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      res.status(400).json({ message: "Invalid customer data" });
    }
  });

  app.delete("/api/customers/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCustomer(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete customer" });
    }
  });

  // Supplier routes
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  app.post("/api/suppliers", async (req, res) => {
    try {
      const validatedData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(validatedData);
      res.status(201).json(supplier);
    } catch (error) {
      res.status(400).json({ message: "Invalid supplier data" });
    }
  });

  app.put("/api/suppliers/:id", async (req, res) => {
    try {
      const validatedData = insertSupplierSchema.partial().parse(req.body);
      const supplier = await storage.updateSupplier(req.params.id, validatedData);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error) {
      res.status(400).json({ message: "Invalid supplier data" });
    }
  });

  app.delete("/api/suppliers/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteSupplier(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete supplier" });
    }
  });

  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Invalid transaction data" });
    }
  });

  // Stock Transaction routes
  app.get("/api/stock-transactions", async (req, res) => {
    try {
      const transactions = await storage.getStockTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stock transactions" });
    }
  });

  app.post("/api/stock-transactions", async (req, res) => {
    try {
      const validatedData = insertStockTransactionSchema.parse(req.body);
      const transaction = await storage.createStockTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Invalid stock transaction data" });
    }
  });

  // Cold Storage Unit routes
  app.get("/api/cold-storage-units", async (req, res) => {
    try {
      const units = await storage.getColdStorageUnits();
      res.json(units);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cold storage units" });
    }
  });

  app.post("/api/cold-storage-units", async (req, res) => {
    try {
      const validatedData = insertColdStorageUnitSchema.parse(req.body);
      const unit = await storage.createColdStorageUnit(validatedData);
      res.status(201).json(unit);
    } catch (error) {
      res.status(400).json({ message: "Invalid cold storage unit data" });
    }
  });

  // Cold Storage Transaction routes
  app.get("/api/cold-storage-transactions", async (req, res) => {
    try {
      const transactions = await storage.getColdStorageTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cold storage transactions" });
    }
  });

  app.post("/api/cold-storage-transactions", async (req, res) => {
    try {
      const validatedData = insertColdStorageTransactionSchema.parse(req.body);
      const transaction = await storage.createColdStorageTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Invalid cold storage transaction data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
