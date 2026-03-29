import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { Attachment } from "nodemailer/lib/mailer";

export class EmailService {

  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  private loadTemplate(templateName: string, variables: Record<string, any>): string {

    const templatePath = path.join(
      __dirname,
      "..",
      "templates",
      templateName
    );

    let template = fs.readFileSync(templatePath, "utf-8");

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, "g");
      template = template.replace(regex, value || "");
    }

    return template;
  }

  async sendEmail(
    to: string,
    subject: string,
    templateName: string,
    variables: Record<string, any>,
    attachments: Attachment[] = []
  ): Promise<void> {

    const htmlContent = this.loadTemplate(templateName, variables);

    const logoPath = path.join(
      __dirname,
      "..",
      "img",
      "logo.png"
    );

    await this.transporter.sendMail({
      from: `"Ferreteria OTTO" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: htmlContent,
      attachments: [
        {
          filename: "logo.png",
          path: logoPath,
          cid: "logo"
        },
        ...attachments
      ]
    });

    console.log("Correo enviado a:", to);

  }

}