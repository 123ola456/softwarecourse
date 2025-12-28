//Pool = contains many ready-to-use connections to the PostgreSQL database.
//PoolClient = a single connection that you “borrow” from the pool to run a query.
import { Pool, PoolClient } from "pg"; 
import config from "../config"; 
import { DatabaseConnectionError } from "../utils/Exceptions/DatabaseConnectionError";

export class ConnectionManager {
    // Singleton pool instance
    private static pool: Pool | null = null;

    // Private constructor to prevent instantiation
    private constructor() {}

    /**
     * Returns a PostgreSQL client from the pool.
     * If the pool is not initialized, it will create it.
     */
    public static async getConnection(): Promise<PoolClient> {
        try {
            if (!this.pool) {
                // Initialize the pool with connection info
                this.pool = new Pool({
                connectionString: config.postgres.connectionString,
                    
                });
            }
            // Acquire a client from the pool
            const client = await this.pool.connect();
            return client;
        } catch (error: unknown) {
            throw new DatabaseConnectionError(
                "Failed to connect to PostgreSQL database",
                error as Error
            );
        }
    }

    /**
     * close the pool when the app shuts down
     */
    public static async closePool(): Promise<void> {
        if (this.pool) {
            await this.pool.end();
            this.pool = null;
        }
    }
}
