import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configuración para trabajar con Neon Serverless (que es lo que usa Supabase bajo el capó)
neonConfig.webSocketConstructor = ws;

// Crear el pool de conexiones a la base de datos solo si DATABASE_URL está configurado
export const pool = process.env.DATABASE_URL 
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

// Crear la instancia de drizzle con nuestro esquema
export const db = pool ? drizzle(pool, { schema }) : null;

// Función helper para verificar si la base de datos está disponible
export function isDatabaseAvailable(): boolean {
  return db !== null && pool !== null;
}