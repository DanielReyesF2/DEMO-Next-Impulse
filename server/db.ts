import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configuración para trabajar con Neon Serverless (que es lo que usa Supabase bajo el capó)
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL debe estar configurado. ¿Olvidaste provisionar una base de datos?",
  );
}

// Crear el pool de conexiones a la base de datos
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Crear la instancia de drizzle con nuestro esquema
export const db = drizzle(pool, { schema });