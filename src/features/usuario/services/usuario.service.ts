import { UsuarioRepositoryInterface } from "../interfaces/usuario.repository.interface";
import { Usuario } from "../models/usuario.model";
import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";
import { Cliente } from "../../clientes/models/cliente.model";
import { hashPassword } from "../../../shared/helper/auth.helper";

export class UsuarioService {
  constructor(
    private readonly _usuarioRepository: UsuarioRepositoryInterface,
  ) {}

  async findAll(): Promise<RespuestaProceso> {
    return await this._usuarioRepository.findAll();
  }

  async findById(id: number): Promise<RespuestaProceso> {
    return await this._usuarioRepository.findById(id);
  }

  async post(data: Partial<Cliente>): Promise<RespuestaProceso> {
    return await this._usuarioRepository.post(data);
  }

  async update(id: number, data: Partial<Usuario>): Promise<RespuestaProceso> {
    if (id === 0) {
      return this.crearRespuestaError("ID de usuario no válido");
    }

    const usuario = await this._usuarioRepository.findById(id);

    if (!usuario || !usuario.datos || usuario.datos.length === 0) {
      return this.crearRespuestaError("Usuario no encontrado");
    }

    const usuarioData = usuario.datos[0]!;

    usuarioData.nombre = data.nombre ?? usuarioData.nombre;
    usuarioData.email = data.email ?? usuarioData.email;

    if (data.password && data.password.trim() !== "") {
      usuarioData.password = await hashPassword(data.password);
    }

    return await this._usuarioRepository.update(id, usuarioData);
  }

  async delete(id: number): Promise<RespuestaProceso> {
    const deleted = await this._usuarioRepository.delete(id);
    if (deleted.idEstado === 1) {
      return this.crearRespuestaError("Usuario no encontrado");
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
