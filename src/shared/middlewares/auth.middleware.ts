import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { verificarToken } from "../helper/auth.helper";

@Middleware({ type: "before" })
export class AuthMiddleware implements ExpressMiddlewareInterface {
  use(req: any, res: any, next: (err?: any) => any): any {
    const path = req.path;

    if (
      path.startsWith("/auth") ||
      path.startsWith("/docs") ||
      path === "/docs.json"
    ) {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No autorizado" });
    }

    try {
      const token = authHeader.split(" ")[1];

      const decoded = verificarToken(token);

      req.user = decoded;

      next();
    } catch (error: any) {
      return res.status(401).json({
        message: error.message || "Token inválido",
      });
    }
  }
}
