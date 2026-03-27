import {
  comparePassword,
  generarToken,
} from "../../../shared/helper/auth.helper";
import { UsuarioRepository } from "../../usuario/infrastructure/usuario.repository";

export class AuthService {
  private _usuarioRepository = new UsuarioRepository();

  async login(email: string, password: string) {
    const usuario = await this._usuarioRepository.findByEmail(email);

    if (!usuario) {
      throw new Error("Usuario no existe");
    }

    if (!usuario.activo) {
      throw new Error("Usuario inactivo");
    }

    const valid = await comparePassword(password, usuario.password);

    if (!valid) {
      throw new Error("Credenciales incorrectas");
    }

    const token = generarToken(usuario);

    return {
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
      token,
    };
  }
}
