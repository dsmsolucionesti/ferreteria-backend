import { pool } from "../config/database";
import { PoolClient } from "pg";

export class BaseRepository {
  protected async query<T>(
    text: string,
    params?: any[],
    client?: PoolClient,
  ): Promise<T[]> {
    const executor = client || pool;

    try {
      // console.log("[DB QUERY]", text, params || []);
      const result = await executor.query(text, params);
      // console.log('result', result.rows)
      return result.rows;
    } catch (error) {
      console.error("[DB ERROR]", error);
      throw error;
    }
  }

  protected async getClient(): Promise<PoolClient> {
    return await pool.connect();
  }
}
