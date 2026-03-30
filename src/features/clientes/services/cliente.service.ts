import { ClienteRepositoryInterface } from "../interfaces/cliente.repository.interface";
import { Cliente } from "../models/cliente.model";
import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";

export class ClienteService {
  constructor(
    private readonly _clienteRepository: ClienteRepositoryInterface,
  ) {}

  async findAll(): Promise<RespuestaProceso> {
    return await this._clienteRepository.findAll();
  }

  async findById(id: number): Promise<RespuestaProceso> {
    return await this._clienteRepository.findById(id);
  }

  async searchClientes(query: string): Promise<RespuestaProceso> {
    return await this._clienteRepository.searchClientes(query);
  }

  async post(data: Partial<Cliente>): Promise<RespuestaProceso> {
    return await this._clienteRepository.post(data);
  }

  async update(id: number, data: Partial<Cliente>): Promise<RespuestaProceso> {
    if (id === 0) {
      return this.crearRespuestaError("ID de cliente no válido");
    }
    return await this._clienteRepository.update(id, data);
  }

  async delete(id: number): Promise<RespuestaProceso> {
    const deleted = await this._clienteRepository.delete(id);
    if (deleted.idEstado === 1) {
      return this.crearRespuestaError("Cliente no encontrado");
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
