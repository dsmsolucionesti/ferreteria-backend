import { BaseRepository } from "../../../shared/base.repository";
import { buildDelete, buildInsert, buildSelect, buildSelectWithFilters, buildUpdate } from "../../../shared/query.builder";
import { Categoria } from "../models/categoria.model";
import { CategoriaRepositoryInterface } from "../interfaces/categoria.repository.interface";

export class CategoriaRepository
  extends BaseRepository
  implements CategoriaRepositoryInterface
{
  async findAll(): Promise<Categoria[]> {
    const query = buildSelect("categorias");
    const result = await this.query<Categoria>(query.text);
    return result;
  }
 
  async findById(id: number): Promise<Categoria | null> {
    const query = buildSelectWithFilters("categorias", "id", id);
    console.log("query", query);
    const result = await this.query<Categoria>(query.text);
    return result[0] || null;
  }

  async create(data: Partial<Categoria>): Promise<Categoria> {
    const query = buildInsert("categorias", data);
    const result = await this.query<Categoria>(query.text, query.values);
    return result[0]!;
  }

  async update(id: number, data: Partial<Categoria>): Promise<Categoria> {
    const query = buildUpdate("categorias", data, id);
    const result = await this.query<Categoria>(query.text, query.values);
    return result[0]!;
  }

  async delete(id: number): Promise<number> {
    const query = buildDelete("categorias", "id", id);
    const rows = await this.query<any>(query.text);

    return rows.length;
  }
}
