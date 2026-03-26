import { Cotizacion } from "../../cotizacion/models/cotizacion.model";
import { Producto } from "../../producto/model/producto.model";

export interface DetalleCotizacion {
  id: number;
  idCotizacion: Cotizacion;
  idProducto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}