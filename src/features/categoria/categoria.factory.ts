import { CategoriaService } from "./services/categoria.service";
import { CategoriaRepository } from "./infrastructure/categoria.repository";

export const buildCategoriaService = () => {
  const repository = new CategoriaRepository();
  return new CategoriaService(repository);
};