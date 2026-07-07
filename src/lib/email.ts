import nodemailer from "nodemailer";

type EmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  preview?: string;
};

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendEmail(input: EmailInput) {
  const from = process.env.SMTP_FROM || "Me & Mommy <no-reply@meandmommy.co.ke>";
  const transport = getTransport();
  const html = input.html
    ? brandEmailTemplate({
        title: input.subject,
        preview: input.preview || input.text,
        body: input.html,
      })
    : undefined;

  if (!transport) {
    console.log("Email delivery skipped; SMTP is not configured.", { ...input, html, from });
    return { sent: false };
  }

  await transport.sendMail({ ...input, html, from });
  return { sent: true };
}

export function brandEmailTemplate({
  title,
  preview,
  body,
}: {
  title: string;
  preview: string;
  body: string;
}) {
  return `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;background:#f4faff;font-family:Arial,Helvetica,sans-serif;color:#172033;">
    <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${escapeHtml(preview)}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4faff;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #dbeffc;box-shadow:0 18px 50px rgba(23,32,51,.08);">
            <tr>
              <td style="background:linear-gradient(135deg,#e8f6ff,#ffeaf1);padding:28px 28px 18px;">
                <div style="font-size:34px;line-height:1;font-weight:800;color:#55aee2;">Me &amp; Mommy</div>
                <div style="margin-top:10px;font-size:14px;font-weight:700;color:#1f7fb8;">Breastmilk storage and bottle care essentials</div>
              </td>
            </tr>
            <tr>
              <td style="padding:30px 28px;font-size:16px;line-height:1.65;color:#334155;">
                ${body}
              </td>
            </tr>
            <tr>
              <td style="background:#172033;color:#dbeafe;padding:22px 28px;font-size:13px;line-height:1.6;">
                <strong style="color:#ffffff;">Me &amp; Mommy Customer Care</strong><br />
                Email: info@meandmommy.co.ke<br />
                Phone: +254 724 736495
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
