import { JsonController, Get } from "routing-controllers";
import { buildCategoriaService } from "../categoria.factory";

@JsonController("/categorias")
export class CategoriaController {

  private service = buildCategoriaService();

  @Get("/")
  async findAll() {
    return this.service.findAll();
  }
}