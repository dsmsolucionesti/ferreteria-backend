import { UsuarioService } from "./services/usuario.service";
import { UsuarioRepository } from "./infrastructure/usuario.repository";

export const buildUsuarioService = () => {
  const repository = new UsuarioRepository();
  return new UsuarioService(repository);
};