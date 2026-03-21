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

  async create(data: Partial<Producto>): Promise<RespuestaProceso> {
    return await this._productoRepository.create(data);
  }
}
