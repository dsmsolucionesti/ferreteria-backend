import "reflect-metadata";
import {
  createExpressServer,
  getMetadataArgsStorage,
} from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import swaggerUi from "swagger-ui-express";

import { ActiveSysController } from "./features/active-sys/active-sys.routes";
import { CategoriaController } from "./features/categoria/controller/categoria.controller";
import { UsuarioController } from "./features/usuario/controller/usuario.controller";
import { ProductoController } from "./features/producto/controller/producto.controller";

const app = createExpressServer({
  routePrefix: "/api",
  controllers: [
    ActiveSysController,
    CategoriaController,
    UsuarioController,
    ProductoController,
  ],
});

const storage = getMetadataArgsStorage();

const spec = routingControllersToSpec(
  storage,
  {},
  {
    info: {
      title: "API Ferretería",
      version: "1.0.0",
      description: "Documentación de la API",
    },
  },
);

// 🔥 SWAGGER UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));

export default app;
