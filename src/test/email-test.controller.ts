import { JsonController, Get } from "routing-controllers";
import { EmailService } from "../shared/services/email.service";
import { PdfService } from "../shared/services/pdf.service";

@JsonController("/test/email")
export class EmailTestController {

  @Get("/")
  async testEmail() {

    const emailService = new EmailService();
    const pdfService = new PdfService();

    const cotizacion = {
      numero: 123,
      nombreCliente: "Juan Pérez",
      rut: "12.345.678-9",
      email: "cliente@email.cl",
      fecha: "20-04-2026",
      productos: [
        { nombre: "Martillo", cantidad: 2, precio: 5000 },
        { nombre: "Clavos", cantidad: 1, precio: 3000 },
         
        

      ],
      total: 13000
    };

    const pdfBuffer = await pdfService.generarCotizacionPDF(cotizacion);

    await emailService.sendEmail(
      "dsmsolucionesti@gmail.com",
      "Prueba cotización Ferretería OTTO",
      "cotizacion-email.html",
      {
        nombre: cotizacion.nombreCliente,
        rut: cotizacion.rut,
        numeroCotizacion: cotizacion.numero
      },
      [
        {
          filename: `cotizacion-${cotizacion.numero}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf"
        }
      ]
    );

    return {
      mensaje: "Correo con PDF enviado correctamente"
    };
  }
}