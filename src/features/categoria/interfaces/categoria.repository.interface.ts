import { Categoria } from "../models/categoria.model";

export interface CategoriaRepositoryInterface {
  findAll(): Promise<Categoria[]>;
  findById(id: number): Promise<Categoria | null>;
  create(data: Partial<Categoria>): Promise<Categoria>;
  update(id: number, data: Partial<Categoria>): Promise<Categoria>;
  delete(id: number): Promise<number>;
}
