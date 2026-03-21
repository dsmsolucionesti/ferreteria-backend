import { PoolClient } from "pg";
import { pool } from "../config/database";

export class BaseRepository {
  protected async query<T>(
    text: string,
    params?: any[],
    client?: PoolClient,
  ): Promise<T[]> {
    const executor = client || pool;

    try {
      const result = await executor.query(text, params);
      return result.rows;
    } catch (error) {
      console.error("[DB ERROR]", error);
      throw error;
    }
  }

  protected async selectEntity<T>(table: string): Promise<T[]> {
    const query = `SELECT * FROM ${table}`;

    return this.query<T>(query);
  }
 
  protected async selectEntityById<T>(table: string, id: number): Promise<T[]> {
    const query = `SELECT * FROM ${table} WHERE id = $1`;

    return this.query<T>(query, [id]);
  }

  protected async insertEntity<T>(
    table: string,
    data: Partial<T>,
  ): Promise<T[]> {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const columns = keys.join(", ");
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO ${table} (${columns})
      VALUES (${placeholders})
      RETURNING *
    `;

    return this.query<T>(query, values);
  }

  protected async updateEntity<T>(
    table: string,
    data: Partial<T>,
    id: number,
  ): Promise<T[]> {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const set = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");

    const query = `
      UPDATE ${table}
      SET ${set}
      WHERE id = $${keys.length + 1}
      RETURNING *
    `;

    return this.query<T>(query, [...values, id]);
  }

  protected async deleteEntity(table: string, id: number): Promise<any[]> {
    const query = `
      DELETE FROM ${table}
      WHERE id = $1
      RETURNING id
    `;

    return this.query(query, [id]);
  }
}
