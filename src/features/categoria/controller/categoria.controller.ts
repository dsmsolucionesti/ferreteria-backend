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

@JsonController("/categorias")
export class CategoriaController {
  private service = buildCategoriaService();

  @Get("/")
  async findAll() {
    return this.service.findAll();
  }

  @Get("/:id")
  async findById(@Param("id") id: number) {
    return this.service.findById(id);
  }

  @Post("/")
  async create(@Body() data: Partial<Categoria>) {
    return this.service.create(data);
  }

  @Patch("/:id")
  async update(@Param("id") id: number, @Body() data: Partial<Categoria>) {
    return this.service.update(id, data);
  }

  @Delete("/:id")
  async delete(@Param("id") id: number) {
    return this.service.delete(id);
  }
}
