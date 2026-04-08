import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";
import { ProductoRepositoryInterface } from "../interfaces/producto.repository.interface";
import { Producto } from "../model/producto.model";

export class ProductoService {
  constructor(
    private readonly _productoRepository: ProductoRepositoryInterface,
  ) {}

  async findAll(): Promise<RespuestaProceso> {
    return await this._productoRepository.findAll();
  }

  async findById(id: number): Promise<RespuestaProceso> {
    return await this._productoRepository.findById(id);
  }

  async searchProductos(query: string): Promise<RespuestaProceso> {
    return await this._productoRepository.searchProductos(query);
  }

  async post(data: Partial<Producto>): Promise<RespuestaProceso> {
    return await this._productoRepository.post(data);
  }

  async update(id: number, data: Partial<Producto>): Promise<RespuestaProceso> {
    if (id === 0) {
      return this.crearRespuestaError("ID de categoría no válido");
    }
    return await this._productoRepository.update(id, data);
  }

  async delete(id: number): Promise<RespuestaProceso> {
    const deleted = await this._productoRepository.delete(id);
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
