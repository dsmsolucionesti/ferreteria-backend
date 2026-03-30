import {
  JsonController,
  Get,
  Param,
  Body,
  Post,
  Delete,
  Patch,
  HttpCode,
} from "routing-controllers";
import { Cotizacion } from "../models/cotizacion.model";
import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";
import { buildCotizacionService } from "../cotizacion.factory";
import { CotizacionRequest } from "../models/cotizacion-request.model";

@JsonController("/cotizaciones")
export class CotizacionController {
  private service = buildCotizacionService();

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
  async create(
    @Body() data: Partial<CotizacionRequest>,
  ): Promise<RespuestaProceso> {
    return this.service.post(data);
  }

  @Patch("/:id")
  @HttpCode(200)
  async update(
    @Param("id") id: number,
    @Body() data: Partial<CotizacionRequest>,
  ): Promise<RespuestaProceso> {
    return this.service.update(id, data);
  }

  @Delete("/:id")
  @HttpCode(200)
  async delete(@Param("id") id: number): Promise<RespuestaProceso> {
    return this.service.delete(id);
  }

  @Patch("/:id/estado")
  @HttpCode(200)
  async updateEstado(
    @Param("id") id: number,
    @Body() body: { estado: number },
  ): Promise<RespuestaProceso> {
    return this.service.updateEstado(id, body.estado);
  }
}
