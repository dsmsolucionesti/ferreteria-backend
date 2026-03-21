import { ProductoRepository } from "./infrastructure/producto.repository";
import { ProductoService } from "./services/producto.service";

export const buildProductoService = () => {
    const repository = new ProductoRepository();
    return new ProductoService(repository);
};