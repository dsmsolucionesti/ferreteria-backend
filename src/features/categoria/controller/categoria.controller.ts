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
import { buildCategoriaService } from "../categoria.factory";
import { Categoria } from "../models/categoria.model";
import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";

@JsonController("/categorias")
export class CategoriaController {
  private service = buildCategoriaService();

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
  async create(@Body() data: Partial<Categoria>): Promise<RespuestaProceso> {
    return this.service.post(data);
  }

  @Patch("/:id")
  @HttpCode(200)
  async update(@Param("id") id: number, @Body() data: Partial<Categoria>): Promise<RespuestaProceso> {
    return this.service.update(id, data);
  }

  @Delete("/:id")
  @HttpCode(200)
  async delete(@Param("id") id: number): Promise<RespuestaProceso> {
    return this.service.delete(id);
  }
}
