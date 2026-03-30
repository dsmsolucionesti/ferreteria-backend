export interface CotizacionRequest {
  idCliente: number;
  idUsuario: number;
  cotizacionDetalle: {
    idProducto: {
      id: number;
      nombre?: string;
    };
    cantidad: number;
    precioUnitario: number;
  }[];
}
