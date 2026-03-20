import "reflect-metadata";
import { createExpressServer } from "routing-controllers";

import { ActiveSysController } from "./features/active-sys/active-sys.routes";
import { CategoriaController } from "./features/categoria/controller/categoria.controller";
import { UsuarioController } from "./features/usuario/controller/usuario.controller";

const app = createExpressServer({
  routePrefix: "/api",
  controllers: [ActiveSysController, CategoriaController, UsuarioController],
});

export default app;
