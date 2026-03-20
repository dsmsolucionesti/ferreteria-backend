import { CategoriaRepositoryInterface } from "../interfaces/categoria.repository.interface";
import { Categoria } from "../models/categoria.model";
import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";

export class CategoriaService {
  constructor(
    private readonly _categoriaRepository: CategoriaRepositoryInterface,
  ) {}

  async findAll(): Promise<RespuestaProceso> {
    return await this._categoriaRepository.findAll();
  }

  async findById(id: number): Promise<RespuestaProceso> {
    return await this._categoriaRepository.findById(id);
  }

  async create(data: Partial<Categoria>): Promise<RespuestaProceso> {
    return await this._categoriaRepository.create(data);
  }

  async update(
    id: number,
    data: Partial<Categoria>,
  ): Promise<RespuestaProceso> {
    if (id === 0) {
      return this.crearRespuestaError("ID de categoría no válido");
    }
    return await this._categoriaRepository.update(id, data);
  }

  async delete(id: number): Promise<RespuestaProceso> {
    const deleted = await this._categoriaRepository.delete(id);
    if (deleted.idEstado === 1) {
      return this.crearRespuestaError("Categoría no encontrada");
    }

    return deleted;
  }

  private crearRespuestaError(mensaje: string): RespuestaProceso {
    return new RespuestaProceso({
      idEstado: -1,
      dsEstado: mensaje,
      totalRegistros: 0,
      datos: [],
    });
  }
}
