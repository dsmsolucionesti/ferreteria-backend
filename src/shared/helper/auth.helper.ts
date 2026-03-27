import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.SECRET_KEY as string;

interface JwtPayload {
  id: number;
  email: string;
  nombre: string;
  rol: string;
}

export const generarToken = (usuario: JwtPayload): string => {
  return jwt.sign(usuario, SECRET, {
    expiresIn: "2h",
    issuer: "DSM_SOLUCIONES",
  });
};

export const verificarToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, SECRET, {
      issuer: "DSM_SOLUCIONES",
    }) as JwtPayload;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token expirado");
    }
    throw new Error("Token inválido");
  }
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};
