import { Usuario } from "../models/usuario.model";

export interface UsuarioRepositoryInterface {
  findAll(): Promise<any[]>;
  findById(id: number): Promise<any | null>;
  create(usuario: Usuario): Promise<any>;
}
