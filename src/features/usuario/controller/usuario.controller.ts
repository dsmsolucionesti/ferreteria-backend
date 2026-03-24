import {
  JsonController,
  Get,
  Param,
  Body,
  Post,
  Put,
  Delete,
  Patch,
  HttpCode,
} from "routing-controllers";
import { Usuario } from "../models/usuario.model";
import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";
import { buildUsuarioService } from "../usuario.factory";

@JsonController("/usuarios")
export class UsuarioController {
  private service = buildUsuarioService();

  @Get("/")
  @HttpCode(200)
  async findAll(): Promise<RespuestaProceso> {
    return this.service.findAll();
  }

  @Get("/:id")
  @HttpCode(200)
  async findById(@Param("id") id: number): Promise<RespuestaProceso> {
    return this.service.findById(id);
  }

  @Post("/")
  @HttpCode(201)
  async create(@Body() usuario: Usuario): Promise<RespuestaProceso> {
    return this.service.post(usuario);
  }

  @Patch("/:id")
  @HttpCode(200)
  async update(
    @Param("id") id: number,
    @Body() data: Partial<Usuario>,
  ): Promise<RespuestaProceso> {
    return this.service.update(id, data);
  }

  @Delete("/:id")
  @HttpCode(200)
  async delete(@Param("id") id: number): Promise<RespuestaProceso> {
    return this.service.delete(id);
  }
}
