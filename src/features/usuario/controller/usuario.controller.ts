import { JsonController, Get, Param, Post, Body } from "routing-controllers";
import { buildUsuarioService } from "../usuario.factory";
import { Usuario } from "../models/usuario.model";

@JsonController("/usuarios")
export class UsuarioController {
  private service = buildUsuarioService();

  @Get("/")
  async findAll() {
    return this.service.findAll();
  }

  @Get("/:id")
  async findById(@Param("id") id: number) {
    return this.service.findById(id);
  }

  @Post("/")
  async create(@Body() usuario: Usuario) {
    return this.service.create(usuario);
  }
}
