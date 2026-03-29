import PDFDocument from "pdfkit";

export class PdfService {

  async generarCotizacionPDF(cotizacion: any): Promise<Buffer> {

    return new Promise((resolve, reject) => {

      const doc = new PDFDocument();

      const buffers: any[] = [];

      doc.on("data", buffers.push.bind(buffers));

      doc.on("end", () => {

        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);

      });

      doc.on("error", reject);

      // ===== CONTENIDO PDF =====

      doc.fontSize(20).text("Ferretería OTTO", { align: "center" });

      doc.moveDown();

      doc.fontSize(16).text(`Cotización N° ${cotizacion.numero}`);

      doc.moveDown();

      doc.fontSize(12).text(`Cliente: ${cotizacion.nombreCliente}`);
      doc.text(`RUT: ${cotizacion.rut}`);
      doc.text(`Correo: ${cotizacion.email}`);
      doc.text(`Fecha: ${cotizacion.fecha}`);

      doc.moveDown();

      doc.text("Detalle de productos:");

      doc.moveDown();

      cotizacion.productos.forEach((producto: any) => {

        doc.text(
          `${producto.nombre} - Cantidad: ${producto.cantidad} - Precio: $${producto.precio}`
        );

      });

      doc.moveDown();

      doc.fontSize(14).text(`TOTAL: $${cotizacion.total}`);

      doc.moveDown();

      doc.text("Gracias por preferir Ferretería OTTO", { align: "center" });

      doc.end();

    });

  }

}