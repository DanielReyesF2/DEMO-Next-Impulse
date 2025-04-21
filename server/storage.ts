import { 
  Client, InsertClient, 
  Document, InsertDocument, 
  WasteData, InsertWasteData, 
  Alert, InsertAlert,
  clients, documents, wasteData, alerts
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // Client operations
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  
  // Document operations
  getDocuments(): Promise<Document[]>;
  getDocumentsByClient(clientId: number): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, updates: Partial<Document>): Promise<Document | undefined>;
  
  // Waste data operations
  getWasteData(filters?: {clientId?: number, fromDate?: Date, toDate?: Date}): Promise<WasteData[]>;
  getWasteDataById(id: number): Promise<WasteData | undefined>;
  createWasteData(data: InsertWasteData): Promise<WasteData>;
  
  // Alert operations
  getAlerts(clientId?: number): Promise<Alert[]>;
  getAlert(id: number): Promise<Alert | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlert(id: number, updates: Partial<Alert>): Promise<Alert | undefined>;
}

export class MemStorage implements IStorage {
  private clients: Map<number, Client>;
  private documents: Map<number, Document>;
  private wasteData: Map<number, WasteData>;
  private alerts: Map<number, Alert>;
  
  private clientId: number;
  private documentId: number;
  private wasteDataId: number;
  private alertId: number;

  constructor() {
    this.clients = new Map();
    this.documents = new Map();
    this.wasteData = new Map();
    this.alerts = new Map();
    
    this.clientId = 1;
    this.documentId = 1;
    this.wasteDataId = 1;
    this.alertId = 1;
    
    // Add sample clients for development
    this.createClient({ name: "Empresa Sustentable S.A.", description: "Empresa de manufactura" });
    this.createClient({ name: "EcoServicios SpA", description: "Servicios ambientales" });
    this.createClient({ name: "Constructora Verde Ltda.", description: "Construcción sustentable" });
  }

  // Client operations
  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(client: InsertClient): Promise<Client> {
    const id = this.clientId++;
    const newClient: Client = { ...client, id };
    this.clients.set(id, newClient);
    return newClient;
  }

  // Document operations
  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async getDocumentsByClient(clientId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (doc) => doc.clientId === clientId
    );
  }

  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const id = this.documentId++;
    const newDocument: Document = {
      ...document,
      id,
      uploadDate: new Date(),
      processed: false
    };
    this.documents.set(id, newDocument);
    return newDocument;
  }

  async updateDocument(id: number, updates: Partial<Document>): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) return undefined;
    
    const updatedDocument = { ...document, ...updates };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }

  // Waste data operations
  async getWasteData(filters?: { clientId?: number, fromDate?: Date, toDate?: Date }): Promise<WasteData[]> {
    let data = Array.from(this.wasteData.values());
    
    if (filters?.clientId) {
      data = data.filter(d => d.clientId === filters.clientId);
    }
    
    if (filters?.fromDate) {
      data = data.filter(d => d.date >= filters.fromDate!);
    }
    
    if (filters?.toDate) {
      data = data.filter(d => d.date <= filters.toDate!);
    }
    
    return data;
  }

  async getWasteDataById(id: number): Promise<WasteData | undefined> {
    return this.wasteData.get(id);
  }

  async createWasteData(data: InsertWasteData): Promise<WasteData> {
    const id = this.wasteDataId++;
    const newData: WasteData = { ...data, id };
    this.wasteData.set(id, newData);
    return newData;
  }

  // Alert operations
  async getAlerts(clientId?: number): Promise<Alert[]> {
    let alerts = Array.from(this.alerts.values());
    
    if (clientId) {
      alerts = alerts.filter(a => a.clientId === clientId);
    }
    
    // Sort by date, most recent first
    return alerts.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async getAlert(id: number): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const id = this.alertId++;
    const newAlert: Alert = {
      ...alert,
      id,
      date: new Date(),
      resolved: false
    };
    this.alerts.set(id, newAlert);
    return newAlert;
  }

  async updateAlert(id: number, updates: Partial<Alert>): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;
    
    const updatedAlert = { ...alert, ...updates };
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }
}

export class DatabaseStorage implements IStorage {
  // Client operations
  async getClients(): Promise<Client[]> {
    return await db.select().from(clients);
  }
  
  async getClient(id: number): Promise<Client | undefined> {
    const results = await db.select().from(clients).where(eq(clients.id, id));
    return results.length > 0 ? results[0] : undefined;
  }
  
  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db.insert(clients).values(client).returning();
    return newClient;
  }
  
  // Document operations
  async getDocuments(): Promise<Document[]> {
    return await db.select().from(documents);
  }
  
  async getDocumentsByClient(clientId: number): Promise<Document[]> {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.clientId, clientId));
  }
  
  async getDocument(id: number): Promise<Document | undefined> {
    const results = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id));
    return results.length > 0 ? results[0] : undefined;
  }
  
  async createDocument(document: InsertDocument): Promise<Document> {
    const [newDocument] = await db
      .insert(documents)
      .values({
        ...document,
        uploadDate: new Date(),
        processed: false
      })
      .returning();
    return newDocument;
  }
  
  async updateDocument(id: number, updates: Partial<Document>): Promise<Document | undefined> {
    // No podemos actualizar directamente el id
    if ('id' in updates) {
      delete updates.id;
    }
    
    const results = await db
      .update(documents)
      .set(updates)
      .where(eq(documents.id, id))
      .returning();
    
    return results.length > 0 ? results[0] : undefined;
  }
  
  // Waste data operations
  async getWasteData(filters?: { clientId?: number, fromDate?: Date, toDate?: Date }): Promise<WasteData[]> {
    let query = db.select().from(wasteData);
    
    // Agregar condiciones de acuerdo a los filtros
    if (filters) {
      const conditions = [];
      
      if (filters.clientId !== undefined) {
        conditions.push(eq(wasteData.clientId, filters.clientId));
      }
      
      if (filters.fromDate !== undefined) {
        conditions.push(gte(wasteData.date, filters.fromDate));
      }
      
      if (filters.toDate !== undefined) {
        conditions.push(lte(wasteData.date, filters.toDate));
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
    }
    
    return await query;
  }
  
  async getWasteDataById(id: number): Promise<WasteData | undefined> {
    const results = await db
      .select()
      .from(wasteData)
      .where(eq(wasteData.id, id));
    
    return results.length > 0 ? results[0] : undefined;
  }
  
  async createWasteData(data: InsertWasteData): Promise<WasteData> {
    const [newData] = await db
      .insert(wasteData)
      .values(data)
      .returning();
    
    return newData;
  }
  
  // Alert operations
  async getAlerts(clientId?: number): Promise<Alert[]> {
    let query = db.select().from(alerts);
    
    if (clientId !== undefined) {
      query = query.where(eq(alerts.clientId, clientId));
    }
    
    const results = await query;
    // Sort by date, most recent first
    return results.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  
  async getAlert(id: number): Promise<Alert | undefined> {
    const results = await db
      .select()
      .from(alerts)
      .where(eq(alerts.id, id));
    
    return results.length > 0 ? results[0] : undefined;
  }
  
  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [newAlert] = await db
      .insert(alerts)
      .values({
        ...alert,
        date: new Date(),
        resolved: false
      })
      .returning();
    
    return newAlert;
  }
  
  async updateAlert(id: number, updates: Partial<Alert>): Promise<Alert | undefined> {
    // No podemos actualizar directamente el id
    if ('id' in updates) {
      delete updates.id;
    }
    
    const results = await db
      .update(alerts)
      .set(updates)
      .where(eq(alerts.id, id))
      .returning();
    
    return results.length > 0 ? results[0] : undefined;
  }
}

// Asegurémonos de tener algunos datos iniciales de clientes
async function initializeDatabase() {
  try {
    const existingClients = await db.select().from(clients);
    
    if (existingClients.length === 0) {
      await db.insert(clients).values([
        {
          name: "Empresa Sustentable S.A.",
          description: "Empresa líder en gestión sustentable de recursos y residuos industriales."
        },
        {
          name: "EcoServicios SpA",
          description: "Servicios de reciclaje y manejo de residuos para empresas e instituciones."
        },
        {
          name: "Constructora Verde Ltda.",
          description: "Construcción sustentable con enfoque en minimización y gestión de residuos."
        }
      ]);
      console.log("Base de datos inicializada con datos de muestra");
    }
  } catch (err) {
    console.error("Error al inicializar la base de datos:", err);
  }
}

// Inicializar la base de datos y exportar la instancia de almacenamiento
initializeDatabase().catch(err => console.error("Error al inicializar la base de datos:", err));

export const storage = new DatabaseStorage();
