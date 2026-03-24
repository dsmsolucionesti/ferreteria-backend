import { CotizacionService } from "./services/cotizacion.service";
import { CotizacionRepository } from "./infrastructure/cotizacion.repository";

export const buildCotizacionService = () => {
  const repository = new CotizacionRepository();
  return new CotizacionService(repository);
};