import { JsonController, Get, Res } from "routing-controllers";
import { PdfService } from "../shared/services/pdf.service";

@JsonController("/test/pdf")
export class PdfTestController {

  @Get("/")
  async generarPDF(@Res() res: any) {

    const pdfService = new PdfService();

    const cotizacion = {
      numero: 123,
      fecha: new Date().toLocaleDateString("es-CL", {
        timeZone: "America/Santiago"
      }),
      nombreCliente: "Juan Pérez",
      rut: "12.345.678-9",
      email: "cliente@email.cl",
      productos: [
        { nombre: "Martillo", cantidad: 2, precio: 5000 },
        { nombre: "Clavos", cantidad: 1, precio: 3000 }
      ],
      total: 13000
    };

    const pdfBuffer = await pdfService.generarCotizacionPDF(cotizacion);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=cotizacion-${cotizacion.numero}.pdf`
    );

    return res.send(pdfBuffer);

  }

}