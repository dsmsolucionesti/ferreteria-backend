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
  QueryParam,
} from "routing-controllers";
import { buildProductoService } from "../producto.factory";
import { Producto } from "../model/producto.model";
import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";

@JsonController("/producto")
export class ProductoController {
  private service = buildProductoService();

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

  @Get("/buscar/:query")
  @HttpCode(200)
  async searchCategorias(
    @QueryParam("query") query: string,
  ): Promise<RespuestaProceso> {
    return this.service.searchProductos(query);
  }

  @Post("/")
  @HttpCode(201)
  async create(@Body() data: Partial<Producto>): Promise<RespuestaProceso> {
    return this.service.post(data);
  }

  @Patch("/:id")
  @HttpCode(200)
  async update(
    @Param("id") id: number,
    @Body() data: Partial<Producto>,
  ): Promise<RespuestaProceso> {
    return this.service.update(id, data);
  }

  @Delete("/:id")
  @HttpCode(200)
  async delete(@Param("id") id: number): Promise<RespuestaProceso> {
    return this.service.delete(id);
  }
}
