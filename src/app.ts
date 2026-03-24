import "reflect-metadata";
import {
  createExpressServer,
  getMetadataArgsStorage,
} from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
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
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
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
    servers: [
      {
        url: "/api",
      },
    ],
  },
);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));

export default app;
