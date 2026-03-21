import { Body, Get, HttpCode, JsonController, Post } from "routing-controllers";
import { ProductoService } from "../services/producto.service";
import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";
import { buildProductoService } from "../producto.factory";
import { Producto } from "../model/producto.model";

@JsonController("/producto")
export class ProductoController {
  
    private productoService= buildProductoService();

  @Get("/")
  @HttpCode(200)
  async findAll(): Promise<RespuestaProceso> {
    return this.productoService.findAll();
  }
  
  @Post("/")
  @HttpCode(201)
  async create(@Body() data: Partial<Producto>): Promise<RespuestaProceso> {
    return this.productoService.create(data);
  }
}
