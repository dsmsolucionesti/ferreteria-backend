import { ClienteService } from "./services/cliente.service";
import { ClienteRepository } from "./infrastructure/cliente.repository";

export const buildClienteService = () => {
  const repository = new ClienteRepository();
  return new ClienteService(repository);
};