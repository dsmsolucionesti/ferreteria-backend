import { UsuarioRepositoryInterface } from "../interfaces/usuario.repository.interface";
import { Usuario } from "../models/usuario.model";

export class UsuarioService {
  constructor(private readonly _usuarioRepository: UsuarioRepositoryInterface) {}

  async findAll(): Promise<Usuario[]> {
    return this._usuarioRepository.findAll();
  }

  async findById(id: number): Promise<Usuario | null> {
    return this._usuarioRepository.findById(id);
  }
  
  async create(usuario: Usuario): Promise<Usuario> {
    return this._usuarioRepository.create(usuario);
  }
}
