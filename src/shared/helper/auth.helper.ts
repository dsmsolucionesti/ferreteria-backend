import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = "DSM_SOLUCIONES_TI";

export const generarToken = (usuario: any) => {
  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
    },
    SECRET,
    { expiresIn: "2h" },
  );
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};
