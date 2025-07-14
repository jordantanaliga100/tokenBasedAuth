import { MongoClient } from "mongodb";

export const connectMongoDB = async (DB_URI: string) => {
  try {
    const client = new MongoClient(DB_URI, {
      authSource: "admin", // needed for root user
    });

    await client.connect();

    // Test connection: list databases
    const adminDb = client.db().admin();
    const { databases } = await adminDb.listDatabases();
    console.log(
      `✅ MongoDB Databases:`,
      databases.map((db) => db.name)
    );

    return client; // return the connected client
  } catch (error: any) {
    console.error("❌ MongoDB Error:", error?.message);
    throw error;
  }
};
