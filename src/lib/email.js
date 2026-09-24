import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Format date: 2026-09-30 → Wed, 30 Sep 2026
 */
function formatDateHuman(dateStr) {
  if (!dateStr) return dateStr;
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Send appointment confirmation email
 */
export async function sendAppointmentConfirmation(appointment) {
  const {
    name,
    email,
    phone,
    date,
    time,
    location,
    customLocation,
    note,
  } = appointment;

  const locationText = customLocation
    ? customLocation
    : [location?.area, location?.district].filter(Boolean).join(', ');

  const dateHuman = formatDateHuman(date);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="dark light" />
        <meta name="supported-color-schemes" content="dark light" />
        <title>Appointment Confirmed</title>
      </head>
      <body style="margin:0;padding:0;background:#0A0A0B;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#ffffff;-webkit-font-smoothing:antialiased;">
        
        <!-- Outer wrapper -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0A0A0B;padding:48px 16px;">
          <tr>
            <td align="center">
              
              <!-- Main card -->
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#0E0E0F;border:1px solid rgba(255,255,255,0.08);">
                
                <!-- TOP GOLD LINE -->
                <tr>
                  <td style="height:3px;background:#C9A961;line-height:3px;font-size:0;">&nbsp;</td>
                </tr>

                <!-- HEADER / BRANDING -->
                <tr>
                  <td style="padding:40px 48px 32px;border-bottom:1px solid rgba(255,255,255,0.08);">
                    <p style="margin:0;font-size:10px;letter-spacing:0.4em;color:#C9A961;text-transform:uppercase;font-weight:600;">
                      OB MOTORS
                    </p>
                    <h1 style="margin:16px 0 0;font-size:30px;font-weight:300;color:#ffffff;letter-spacing:-0.01em;line-height:1.2;">
                      Appointment&nbsp;Confirmed
                    </h1>
                    <p style="margin:14px 0 0;font-size:12px;color:rgba(255,255,255,0.4);letter-spacing:0.15em;text-transform:uppercase;">
                      Thank you for choosing OB Motors
                    </p>
                  </td>
                </tr>

                <!-- BODY -->
                <tr>
                  <td style="padding:40px 48px;">

                    <!-- Greeting -->
                    <p style="margin:0 0 24px;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.8;">
                      Dear <strong style="color:#ffffff;font-weight:600;">${name}</strong>,
                    </p>

                    <p style="margin:0 0 32px;font-size:15px;color:rgba(255,255,255,0.7);line-height:1.8;">
                      Your appointment with OB Motors has been successfully confirmed. Our team will reach out shortly to ensure everything is prepared for your visit.
                    </p>

                    <!-- DETAILS BOX -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(201,169,97,0.04);border:1px solid rgba(201,169,97,0.2);margin-bottom:32px;">
                      <tr>
                        <td style="padding:28px 28px 24px;">
                          
                          <p style="margin:0 0 20px;font-size:10px;letter-spacing:0.4em;color:#C9A961;text-transform:uppercase;font-weight:600;">
                            Your Appointment
                          </p>

                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            
                            <tr>
                              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:12px;color:rgba(255,255,255,0.45);letter-spacing:0.05em;text-transform:uppercase;width:40%;">
                                Date
                              </td>
                              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#ffffff;text-align:right;font-weight:500;">
                                ${dateHuman}
                              </td>
                            </tr>

                            <tr>
                              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:12px;color:rgba(255,255,255,0.45);letter-spacing:0.05em;text-transform:uppercase;">
                                Time
                              </td>
                              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#C9A961;text-align:right;font-weight:600;">
                                ${time}
                              </td>
                            </tr>

                            <tr>
                              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:12px;color:rgba(255,255,255,0.45);letter-spacing:0.05em;text-transform:uppercase;">
                                Phone
                              </td>
                              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#ffffff;text-align:right;">
                                ${phone}
                              </td>
                            </tr>

                            ${locationText ? `
                            <tr>
                              <td style="padding:10px 0;font-size:12px;color:rgba(255,255,255,0.45);letter-spacing:0.05em;text-transform:uppercase;">
                                Location
                              </td>
                              <td style="padding:10px 0;font-size:14px;color:#ffffff;text-align:right;">
                                ${locationText}
                              </td>
                            </tr>
                            ` : ''}

                          </table>
                        </td>
                      </tr>
                    </table>

                    ${note ? `
                    <!-- NOTE -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-left:2px solid rgba(201,169,97,0.4);margin-bottom:32px;">
                      <tr>
                        <td style="padding:4px 0 4px 20px;">
                          <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.3em;color:rgba(255,255,255,0.4);text-transform:uppercase;font-weight:600;">
                            Your Note
                          </p>
                          <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.75);line-height:1.7;font-style:italic;">
                            "${note}"
                          </p>
                        </td>
                      </tr>
                    </table>
                    ` : ''}

                    <!-- CTA BUTTON -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 32px;">
                      <tr>
                        <td align="center" style="background:#C9A961;">
                          <a href="https://maps.google.com/?q=Baridhara+Dhaka" target="_blank" style="display:inline-block;padding:14px 32px;font-size:11px;font-weight:600;color:#0A0A0B;text-decoration:none;letter-spacing:0.3em;text-transform:uppercase;">
                            View Location
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- CLOSING -->
                    <p style="margin:0 0 16px;font-size:14px;color:rgba(255,255,255,0.7);line-height:1.8;">
                      If you need to reschedule, simply reply to this email or call us at <a href="tel:+8801620885976" style="color:#C9A961;text-decoration:none;">+880 1620-885976</a>.
                    </p>
                    <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.7);line-height:1.8;">
                      We look forward to welcoming you.
                    </p>

                  </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                  <td style="padding:32px 48px;background:#0A0A0B;border-top:1px solid rgba(255,255,255,0.08);">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="vertical-align:top;">
                          <p style="margin:0 0 4px;font-size:11px;color:#C9A961;letter-spacing:0.3em;text-transform:uppercase;font-weight:600;">
                            OB Motors
                          </p>
                          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.4);line-height:1.7;">
                            KA-61/6A Pragati Sarani<br />
                            Baridhara, Dhaka-1212<br />
                            Bangladesh
                          </p>
                        </td>
                        <td align="right" style="vertical-align:top;">
                          <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:0.05em;">
                            Follow Us
                          </p>
                          <p style="margin:0;font-size:12px;line-height:1.7;">
                            <a href="https://www.facebook.com/opuifnwhy" style="color:#C9A961;text-decoration:none;">Facebook</a><br />
                            <a href="https://www.instagram.com/visualsbyopu/" style="color:#C9A961;text-decoration:none;">Instagram</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- COPYRIGHT -->
                <tr>
                  <td style="padding:20px 48px;background:#0A0A0B;border-top:1px solid rgba(255,255,255,0.05);">
                    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.3);text-align:center;letter-spacing:0.05em;">
                      © ${new Date().getFullYear()} OB Motors — All rights reserved
                    </p>
                  </td>
                </tr>

              </table>
              <!-- /Main card -->

            </td>
          </tr>
        </table>

      </body>
    </html>
  `;

  const text = `
OB MOTORS
Appointment Confirmed

Dear ${name},

Your appointment with OB Motors has been successfully confirmed.

Date: ${dateHuman}
Time: ${time}
Phone: ${phone}
${locationText ? `Location: ${locationText}` : ''}
${note ? `\nYour Note: "${note}"` : ''}

If you need to reschedule, reply to this email or call us at +880 1620-885976.

OB Motors
KA-61/6A Pragati Sarani, Baridhara, Dhaka-1212
https://www.facebook.com/opuifnwhy
https://www.instagram.com/visualsbyopu/
  `.trim();

  try {
    const info = await transporter.sendMail({
      from: `"OB Motors" <${process.env.GMAIL_USER}>`,
      to: email,
      replyTo: process.env.GMAIL_USER,
      subject: `✓ Appointment Confirmed — ${dateHuman} at ${time}`,
      text,
      html,
      headers: {
        'X-Entity-Ref-ID': appointment._id?.toString() || '',
        'List-Unsubscribe': `<mailto:${process.env.GMAIL_USER}?subject=unsubscribe>`,
      },
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send failed:', error);
    return { success: false, error: error.message };
  }
}


// send emil to seller when a user submits a sell form
/**
 * Send sell-deal confirmation email
 */
export async function sendSellConfirmation(deal) {
  const {
    name,
    email,
    phone,
    carName,
    model,
    regYear,
    mileage,
    offeredPrice,
    images = [],
  } = deal;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sell Request Received</title>
      </head>
      <body style="margin:0;padding:0;background:#0A0A0B;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#ffffff;-webkit-font-smoothing:antialiased;">
        
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0A0A0B;padding:48px 16px;">
          <tr>
            <td align="center">
              
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#0E0E0F;border:1px solid rgba(255,255,255,0.08);">
                
                <!-- TOP WHITE LINE -->
                <tr>
                  <td style="height:3px;background:#ffffff;line-height:3px;font-size:0;">&nbsp;</td>
                </tr>

                <!-- HEADER -->
                <tr>
                  <td style="padding:40px 48px 32px;border-bottom:1px solid rgba(255,255,255,0.08);">
                    <p style="margin:0;font-size:10px;letter-spacing:0.4em;color:#ffffff;text-transform:uppercase;font-weight:600;">
                      OB MOTORS
                    </p>
                    <h1 style="margin:16px 0 0;font-size:30px;font-weight:300;color:#ffffff;letter-spacing:-0.01em;line-height:1.2;">
                      We've received your request
                    </h1>
                    <p style="margin:14px 0 0;font-size:12px;color:rgba(255,255,255,0.4);letter-spacing:0.15em;text-transform:uppercase;">
                      Vehicle Appraisal — In Progress
                    </p>
                  </td>
                </tr>

                <!-- BODY -->
                <tr>
                  <td style="padding:40px 48px;">

                    <p style="margin:0 0 24px;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.8;">
                      Dear <strong style="color:#ffffff;font-weight:600;">${name}</strong>,
                    </p>

                    <p style="margin:0 0 32px;font-size:15px;color:rgba(255,255,255,0.7);line-height:1.8;">
                      Thank you for choosing OB Motors to help sell your vehicle. Our team has received your submission and will contact you within 24 hours to schedule a professional inspection.
                    </p>

                    <!-- DETAILS BOX -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.15);margin-bottom:32px;">
                      <tr>
                        <td style="padding:28px;">
                          
                          <p style="margin:0 0 20px;font-size:10px;letter-spacing:0.4em;color:rgba(255,255,255,0.6);text-transform:uppercase;font-weight:600;">
                            Your Submission
                          </p>

                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            
                            <tr>
                              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:12px;color:rgba(255,255,255,0.45);letter-spacing:0.05em;text-transform:uppercase;">
                                Vehicle
                              </td>
                              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#ffffff;text-align:right;font-weight:500;">
                                ${carName} ${model ? `· ${model}` : ''}
                              </td>
                            </tr>

                            <tr>
                              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:12px;color:rgba(255,255,255,0.45);letter-spacing:0.05em;text-transform:uppercase;">
                                Reg. Year
                              </td>
                              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#ffffff;text-align:right;">
                                ${regYear}
                              </td>
                            </tr>

                            ${mileage ? `
                            <tr>
                              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:12px;color:rgba(255,255,255,0.45);letter-spacing:0.05em;text-transform:uppercase;">
                                Mileage
                              </td>
                              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#ffffff;text-align:right;">
                                ${mileage}
                              </td>
                            </tr>
                            ` : ''}

                            ${offeredPrice ? `
                            <tr>
                              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:12px;color:rgba(255,255,255,0.45);letter-spacing:0.05em;text-transform:uppercase;">
                                Offered Price
                              </td>
                              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#ffffff;text-align:right;font-weight:600;">
                                $${Number(offeredPrice).toLocaleString()}
                              </td>
                            </tr>
                            ` : ''}

                            <tr>
                              <td style="padding:10px 0;font-size:12px;color:rgba(255,255,255,0.45);letter-spacing:0.05em;text-transform:uppercase;">
                                Contact
                              </td>
                              <td style="padding:10px 0;font-size:14px;color:#ffffff;text-align:right;">
                                ${phone}
                              </td>
                            </tr>

                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- WHAT'S NEXT -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-left:2px solid rgba(255,255,255,0.3);margin-bottom:32px;">
                      <tr>
                        <td style="padding:4px 0 4px 20px;">
                          <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.3em;color:rgba(255,255,255,0.5);text-transform:uppercase;font-weight:600;">
                            What Happens Next
                          </p>
                          <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.7);line-height:1.8;">
                            1. Our team reviews your submission<br />
                            2. We contact you within 24 hours<br />
                            3. Professional inspection at your location<br />
                            4. Final offer — you decide
                          </p>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0 0 16px;font-size:14px;color:rgba(255,255,255,0.7);line-height:1.8;">
                      Need to talk sooner? Call us at <a href="tel:+8801620885976" style="color:#ffffff;text-decoration:underline;">+880 1620-885976</a> or reply to this email.
                    </p>
                    <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.7);line-height:1.8;">
                      We look forward to working with you.
                    </p>

                  </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                  <td style="padding:32px 48px;background:#0A0A0B;border-top:1px solid rgba(255,255,255,0.08);">
                    <p style="margin:0 0 4px;font-size:11px;color:#ffffff;letter-spacing:0.3em;text-transform:uppercase;font-weight:600;">
                      OB Motors
                    </p>
                    <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.4);line-height:1.7;">
                      KA-61/6A Pragati Sarani<br />
                      Baridhara, Dhaka-1212<br />
                      Bangladesh
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:20px 48px;background:#0A0A0B;border-top:1px solid rgba(255,255,255,0.05);">
                    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.3);text-align:center;letter-spacing:0.05em;">
                      © ${new Date().getFullYear()} OB Motors — All rights reserved
                    </p>
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"OB Motors" <${process.env.GMAIL_USER}>`,
      to: email,
      replyTo: process.env.GMAIL_USER,
      subject: `✓ We've received your request — ${carName}`,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Sell email send failed:', error);
    return { success: false, error: error.message };
  }
}