import { DetalleCotizacionService } from "./services/detalle-cotizacion.service";
import { DetalleCotizacionRepository } from "./infrastructure/detalle-cotizacion.repository";

export const buildDetalleCotizacionService = () => {
  const repository = new DetalleCotizacionRepository();
  return new DetalleCotizacionService(repository);
};