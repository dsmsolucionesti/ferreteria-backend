import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

interface ProductoCotizacion {
  nombre: string;
  cantidad: number;
  precio: number;
}

interface CotizacionPDF {
  numero: string | number;
  fecha: string;
  nombreCliente: string;
  rut: string;
  email: string;
  productos: ProductoCotizacion[];
  total: number;
}

export class PdfService {

  private readonly MARGIN = 50;
  private readonly FOOTER_HEIGHT = 35;
  private readonly SAFE_BOTTOM_MARGIN = 120;

  private sanitize(value: any): string {
    if (value === null || value === undefined) return "";
    return String(value).replace(/\n/g, " ").trim();
  }

  private safeNumber(value: any): number {
    const n = Number(value);
    if (isNaN(n)) return 0;
    return n;
  }

  private formatMoney(value: number): string {
    return `$${value.toLocaleString("es-CL")}`;
  }

  private drawFooter(doc: PDFKit.PDFDocument, pageNumber: number) {

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    const y = pageHeight - this.MARGIN;

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#777")
      .text(
        `Ferretería OTTO - contacto@ferreteriaotto.cl | Página ${pageNumber}`,
        this.MARGIN,
        y - 10,
        { align: "center", width: pageWidth - this.MARGIN * 2 }
      );

  }

  private drawTableHeader(doc: PDFKit.PDFDocument, y: number) {

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor("#000")
      .text("Producto", 50, y)
      .text("Cant.", 310, y, { width: 50, align: "right" })
      .text("Precio", 370, y, { width: 80, align: "right" })
      .text("Total", 460, y, { width: 85, align: "right" });

    y += 15;

    doc
      .moveTo(50, y)
      .lineTo(doc.page.width - 50, y)
      .stroke();

    return y + 10;

  }

  async generarCotizacionPDF(cotizacion: CotizacionPDF): Promise<Buffer> {

    return new Promise((resolve, reject) => {

      const doc = new PDFDocument({
        margin: this.MARGIN,
        size: "A4"
      });

      const buffers: Buffer[] = [];

      const docId = Math.random().toString(36).substring(2, 10);

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      let pageNumber = 1;

      const pageHeight = doc.page.height;

      const bottomLimit = () =>
        pageHeight - this.SAFE_BOTTOM_MARGIN;

      let y = 50;

      // ===== LOGO =====

      try {

        const logoPath = path.join(__dirname, "..", "img", "logo.png");

        if (fs.existsSync(logoPath)) {
          doc.image(logoPath, 50, 40, { width: 80 });
        }

      } catch {}

      // ===== EMPRESA =====

      doc
        .font("Helvetica-Bold")
        .fontSize(18)
        .text("FERRETERÍA OTTO", 200, 50);

      doc
        .font("Helvetica")
        .fontSize(10)
        .text("Materiales de Construcción", 200, 72)
        .text("contacto@ferreteriaotto.cl", 200, 85);

      y = 120;

      // ===== COTIZACION =====

      doc
        .font("Helvetica-Bold")
        .fontSize(13)
        .text(`Cotización N° ${this.sanitize(cotizacion.numero)}`, 50, y);

      doc
        .font("Helvetica")
        .fontSize(11)
        .text(`Fecha: ${this.sanitize(cotizacion.fecha)}`, 400, y);

      y += 25;

      doc.moveTo(50, y).lineTo(doc.page.width - 50, y).stroke();

      y += 15;

      // ===== CLIENTE =====

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("DATOS DEL CLIENTE", 50, y);

      y += 15;

      doc
        .font("Helvetica")
        .fontSize(10)
        .text(`Nombre: ${this.sanitize(cotizacion.nombreCliente)}`, 50, y)
        .text(`RUT: ${this.sanitize(cotizacion.rut)}`, 50, y + 12)
        .text(`Correo: ${this.sanitize(cotizacion.email)}`, 50, y + 24);

      y += 45;

      doc.moveTo(50, y).lineTo(doc.page.width - 50, y).stroke();

      y += 15;

      // ===== TABLA =====

      y = this.drawTableHeader(doc, y);

      let subtotal = 0;

      const productos = Array.isArray(cotizacion.productos)
        ? cotizacion.productos
        : [];

      productos.forEach((producto) => {

        const nombre = this.sanitize(producto.nombre).substring(0, 60);

        const cantidad = this.safeNumber(producto.cantidad);
        const precio = this.safeNumber(producto.precio);

        const totalProducto = cantidad * precio;

        subtotal += totalProducto;

        if (y > bottomLimit()) {

          this.drawFooter(doc, pageNumber);

          doc.addPage();

          pageNumber++;

          y = 50;

          y = this.drawTableHeader(doc, y);

        }

        doc
          .font("Helvetica")
          .fontSize(10)
          .text(nombre, 50, y, { width: 240 })
          .text(String(cantidad), 310, y, { width: 50, align: "right" })
          .text(this.formatMoney(precio), 370, y, { width: 80, align: "right" })
          .text(this.formatMoney(totalProducto), 460, y, { width: 85, align: "right" });

        y += 20;

        doc
          .moveTo(50, y)
          .lineTo(doc.page.width - 50, y)
          .strokeColor("#eeeeee")
          .stroke();

        y += 5;

      });

      // ===== TOTALES =====

      const iva = Math.round(subtotal * 0.19);
      const total = subtotal + iva;

      y += 20;

      doc.font("Helvetica").fontSize(10);

      doc.text("Subtotal:", 370, y, { width: 80, align: "right" });
      doc.text(this.formatMoney(subtotal), 460, y, { width: 85, align: "right" });

      y += 18;

      doc.text("IVA (19%):", 370, y, { width: 80, align: "right" });
      doc.text(this.formatMoney(iva), 460, y, { width: 85, align: "right" });

      y += 20;

      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .text("TOTAL:", 370, y, { width: 80, align: "right" })
        .text(this.formatMoney(total), 460, y, { width: 85, align: "right" });

      y += 35;

      doc
        .font("Helvetica")
        .fontSize(9)
        .text("Esta cotización tiene una validez de 7 días corridos.", 50, y);

      y += 15;

      doc
        .font("Helvetica-Bold")
        .text("Gracias por preferir Ferretería OTTO", 50, y, {
          align: "center",
          width: doc.page.width - 100
        });

      // ===== FOOTER FINAL =====

      this.drawFooter(doc, pageNumber);

      doc.end();

    });

  }

}