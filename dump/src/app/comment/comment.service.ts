import { getPool } from "../../db/mysql/mysql.js";

class CommentService {
  private get pool() {
    return getPool()!;
  }

  public async getAll({ page = "1", limit = "10", sort = "id" }) {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const sql = `
      SELECT comment.*, user.name as authorName, post.title as postTitle
      FROM comment
      LEFT JOIN user ON comment.authorId = user.id
      LEFT JOIN post ON comment.postId = post.id
      ORDER BY ?? 
      LIMIT ? OFFSET ?
    `;
    const [data] = await this.pool.query(sql, [sort, parseInt(limit), offset]);

    const [countResult]: any = await this.pool.query(
      "SELECT COUNT(*) as count FROM comment"
    );
    const count = countResult[0]?.count || 0;

    return { data, count };
  }

  public async getById(id: string) {
    const sql = `
      SELECT comment.*, user.name as authorName, post.title as postTitle
      FROM comment
      LEFT JOIN user ON comment.authorId = user.id
      LEFT JOIN post ON comment.postId = post.id
      WHERE comment.id = ?
    `;
    const [rows]: any = await this.pool.query(sql, [id]);
    return rows[0] ?? null;
  }

  public async create(payload: {
    text: string;
    postId: number;
    authorId: number;
  }) {
    const sql = `INSERT INTO comment (text, postId, authorId) VALUES (?, ?, ?)`;
    const [result]: any = await this.pool.query(sql, [
      payload.text,
      payload.postId,
      payload.authorId,
    ]);
    return { id: result.insertId, ...payload };
  }

  public async update(
    id: string,
    payload: { text?: string; postId?: number; authorId?: number }
  ) {
    const fields = [];
    const values: any[] = [];

    if (payload.text) {
      fields.push("text = ?");
      values.push(payload.text);
    }
    if (payload.postId) {
      fields.push("postId = ?");
      values.push(payload.postId);
    }
    if (payload.authorId) {
      fields.push("authorId = ?");
      values.push(payload.authorId);
    }

    if (fields.length === 0) return null;

    const sql = `UPDATE comment SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    const [result]: any = await this.pool.query(sql, values);
    if (result.affectedRows === 0) return null;

    return await this.getById(id);
  }

  public async delete(id: string) {
    const sql = `DELETE FROM comment WHERE id = ?`;
    const [result]: any = await this.pool.query(sql, [id]);
    return result.affectedRows > 0;
  }
}

export default new CommentService();
