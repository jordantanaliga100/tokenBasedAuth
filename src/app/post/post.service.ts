import { getPool } from "../../db/mysql/mysql.js";

class PostService {
  private get pool() {
    return getPool()!;
  }

  public async getAll({ page = "1", limit = "10", sort = "id" }) {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const sql = `
      SELECT post.*, user.name as authorName, user.email as authorEmail
      FROM post
      LEFT JOIN user ON post.authorId = user.id
      ORDER BY ?? 
      LIMIT ? OFFSET ?
    `;
    const [data] = await this.pool.query(sql, [sort, parseInt(limit), offset]);

    const [countResult]: any = await this.pool.query(
      "SELECT COUNT(*) as count FROM post"
    );
    const count = countResult[0]?.count || 0;

    return { data, count };
  }

  public async getById(id: string) {
    const sql = `
      SELECT post.*, user.name as authorName, user.email as authorEmail
      FROM post
      LEFT JOIN user ON post.authorId = user.id
      WHERE post.id = ?
    `;
    const [rows]: any = await this.pool.query(sql, [id]);
    return rows[0] ?? null;
  }

  public async create(payload: {
    title: string;
    content: string;
    authorId: number;
  }) {
    const sql = `INSERT INTO post (title, content, authorId) VALUES (?, ?, ?)`;
    const [result]: any = await this.pool.query(sql, [
      payload.title,
      payload.content,
      payload.authorId,
    ]);
    return { id: result.insertId, ...payload };
  }

  public async update(
    id: string,
    payload: { title?: string; content?: string; authorId?: number }
  ) {
    const fields = [];
    const values: any[] = [];

    if (payload.title) {
      fields.push("title = ?");
      values.push(payload.title);
    }
    if (payload.content) {
      fields.push("content = ?");
      values.push(payload.content);
    }
    if (payload.authorId) {
      fields.push("authorId = ?");
      values.push(payload.authorId);
    }

    if (fields.length === 0) return null;

    const sql = `UPDATE post SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    const [result]: any = await this.pool.query(sql, values);
    if (result.affectedRows === 0) return null;

    return await this.getById(id);
  }

  public async delete(id: string) {
    const sql = `DELETE FROM post WHERE id = ?`;
    const [result]: any = await this.pool.query(sql, [id]);
    return result.affectedRows > 0;
  }
}

export default new PostService();
