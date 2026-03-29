import { JsonController, Get } from "routing-controllers";
import { EmailService } from "../shared/services/email.service";

@JsonController("/test/test-email")
export class EmailTestController {

  @Get("/")
  async testEmail() {

    const emailService = new EmailService();

    await emailService.sendEmail(
      "danielsalfatetoledo@gmail.com",
      "Prueba de correo Ferretería OTTO",
      "cotizacion-email.html",
      {
        nombre: "Daniel",
        rut: "12.345.678-9",
        numeroCotizacion: "123"
      }
    );

    return {
      mensaje: "Correo enviado correctamente"
    };
  }
}