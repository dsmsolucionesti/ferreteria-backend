import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { Attachment } from "nodemailer/lib/mailer";
import { PdfService } from "./pdf.service";

export class EmailService {
  private pdfService = new PdfService();

  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  private loadTemplate(
    templateName: string,
    variables: Record<string, any>,
  ): string {
    const templatePath = path.join(__dirname, "..", "templates", templateName);

    let template = fs.readFileSync(templatePath, "utf-8");

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, "g");
      template = template.replace(regex, value || "");
    }

    return template;
  }

  async sendEmail(data: any): Promise<void> {
    const htmlContent = this.loadTemplate("cotizacion-email.html", {
      nombre: data.cliente.nombre,
    });
    const logoPath = path.join(__dirname, "..", "img", "logo.png");

    const pdfBuffer = await this.pdfService.generarCotizacionPDF(data);

    await this.transporter.sendMail({
      from: `"Ferreteria OTTO" <${process.env.SMTP_USER}>`,
      to: data.cliente.email,
      subject: "Tu cotización ha sido generada",
      html: htmlContent,
      attachments: [
        {
          filename: "logo.png",
          path: logoPath,
          cid: "logo",
        },
        {
          filename: `cotizacion-${data.id}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    console.log("Correo enviado a:", data.cliente.email);
  }
}
