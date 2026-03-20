import { NotFoundError } from "routing-controllers";
import { CategoriaRepositoryInterface } from "../interfaces/categoria.repository.interface";
import { Categoria } from "../models/categoria.model";

export class CategoriaService {
  constructor(
    private readonly _categoriaRepository: CategoriaRepositoryInterface,
  ) {}

  async findAll(): Promise<Categoria[]> {
    return this._categoriaRepository.findAll();
  }

  async findById(id: number): Promise<Categoria | null> {
    return this._categoriaRepository.findById(id);
  }

  async create(data: Partial<Categoria>): Promise<Categoria> {
    return this._categoriaRepository.create(data);
  }

  async update(id: number, data: Partial<Categoria>): Promise<Categoria> {
    return this._categoriaRepository.update(id, data);
  }

  async delete(id: number): Promise<{ message: string }> {
    const deleted = await this._categoriaRepository.delete(id);
    console.log(deleted)

    if (deleted === 0) {
      return { message: "Categoría no encontrada" };
    }

    return { message: "Eliminado correctamente" };
  }
}
