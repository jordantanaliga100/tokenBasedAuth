import { getPool } from "../../db/mysql/mysql.js";
import { QueryParams } from "../../types/query.js";

class UserService {
  private get pool() {
    return getPool()!;
  }

  public async getAll({ page = "1", limit = "10", sort = "id" }: QueryParams) {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const sql = `
      SELECT * FROM user
      ORDER BY ?? 
      LIMIT ? OFFSET ?
    `;
    const [data] = await this.pool.query(sql, [sort, parseInt(limit), offset]);

    const [countResult]: any = await this.pool.query(
      "SELECT COUNT(*) as count FROM user"
    );
    const count = countResult[0]?.count || 0;

    return { data, count };
  }

  public async getById(id: string) {
    const sql = `SELECT * FROM user WHERE id = ?`;
    const [rows]: any = await this.pool.query(sql, [id]);
    return rows[0] ?? null;
  }

  public async create(payload: { name: string; email: string }) {
    const sql = `INSERT INTO user (name, email) VALUES (?, ?)`;
    const [result]: any = await this.pool.query(sql, [
      payload.name,
      payload.email,
    ]);
    return { id: result.insertId, ...payload };
  }

  public async update(id: string, payload: { name?: string; email?: string }) {
    const fields = [];
    const values: any[] = [];

    if (payload.name) {
      fields.push("name = ?");
      values.push(payload.name);
    }
    if (payload.email) {
      fields.push("email = ?");
      values.push(payload.email);
    }

    if (fields.length === 0) return null;

    const sql = `UPDATE user SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    const [result]: any = await this.pool.query(sql, values);
    if (result.affectedRows === 0) return null;

    return await this.getById(id);
  }

  public async delete(id: string) {
    const sql = `DELETE FROM user WHERE id = ?`;
    const [result]: any = await this.pool.query(sql, [id]);
    return result.affectedRows > 0;
  }
}

export default new UserService();
