import "reflect-metadata";
import { createExpressServer } from "routing-controllers";

import { ActiveSysController } from "./features/active-sys/active-sys.routes";
import { CategoriaController } from "./features/categoria/controller/categoria.controller";
import { UsuarioController } from "./features/usuario/controller/usuario.controller";
import { ProductoController } from "./features/producto/controller/producto.controller";

const app = createExpressServer({
  routePrefix: "/api",
  controllers: [ActiveSysController, CategoriaController, UsuarioController, ProductoController],
});

export default app;
