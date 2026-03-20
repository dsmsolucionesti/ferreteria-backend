import { CategoriaRepositoryInterface } from "../interfaces/categoria.repository.interface";
import { Categoria } from "../models/categoria.model";

export class CategoriaService {
  constructor(private readonly _categoriaRepository: CategoriaRepositoryInterface) {}

  async findAll(): Promise<Categoria[]> {
    return this._categoriaRepository.findAll();
  }
}
