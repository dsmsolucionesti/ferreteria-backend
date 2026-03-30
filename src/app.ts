import "reflect-metadata";

// 🔥 CRON CONTROLADO POR ENV
require("./shared/helper/cron");

import {
  createExpressServer,
  getMetadataArgsStorage,
} from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";

import swaggerUi from "swagger-ui-express";

// Controllers
import { ActiveSysController } from "./features/active-sys/active-sys.routes";
import { CategoriaController } from "./features/categoria/controller/categoria.controller";
import { ClienteController } from "./features/clientes/controller/cliente.controller";
import { CotizacionController } from "./features/cotizacion/controller/cotizacion.controller";
import { ProductoController } from "./features/producto/controller/producto.controller";
import { UsuarioController } from "./features/usuario/controller/usuario.controller";
import { DetalleCotizacionController } from "./features/detalle-cotizacion/controller/detalle-cotizacion.controller";
import { AuthController } from "./features/auth/controller/auth.controller";

// Test controllers
import { EmailTestController } from "./test/email-test.controller";
import { PdfTestController } from "./test/pdf-test.controller";

// Middlewares
import { AuthMiddleware } from "./shared/middlewares/auth.middleware";

const app = createExpressServer({
  routePrefix: "/api",
  controllers: [
    AuthController,
    ActiveSysController,
    CategoriaController,
    ClienteController,
    CotizacionController,
    DetalleCotizacionController,
    ProductoController,
    UsuarioController,
    EmailTestController,
    PdfTestController,
  ],
  middlewares: [AuthMiddleware],
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  },
});

// Swagger
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

app.get("/docs.json", (_req: any, res: any) => {
  res.setHeader("Content-Type", "application/json");
  res.send(spec);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));

export default app;
