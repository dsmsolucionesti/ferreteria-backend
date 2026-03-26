export interface CotizacionRequest {
  idCliente: number;
  isUsuario: number;
  cotizacionDetalle: {
    idProducto: {
      id: number;
      nombre?: string;
    };
    cantidad: number;
    precioUnitario: number;
  }[];
}
