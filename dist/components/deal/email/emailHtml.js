"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmailHTML = void 0;
const getEmailHTML = (email, firstName, lastName) => {
    return {
        from: `"Divideals" <${process.env.EMAIL}>`,
        to: email,
        subject: 'Purchase Successful',
        text: '',
        html: `
        <html>
          <head>
          <title></title>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <style type="text/css">
            /* FONTS */
              @media screen {
              @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
              }
              
              @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 700;
                src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
              }
              
              @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 400;
                src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
              }
              
              @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 700;
                src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
              }
              }
              /* CLIENT-SPECIFIC STYLES */
              body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
              table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
              img { -ms-interpolation-mode: bicubic; }
              /* RESET STYLES */
              img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
              table { border-collapse: collapse !important; }
              body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
              /* iOS BLUE LINKS */
              a[x-apple-data-detectors] {
                  color: inherit !important;
                  text-decoration: none !important;
                  font-size: inherit !important;
                  font-family: inherit !important;
                  font-weight: inherit !important;
                  line-height: inherit !important;
              }
              /* ANDROID CENTER FIX */
              div[style*="margin: 16px 0;"] { margin: 0 !important; }
          </style>
          </head>
          <body style="background-color: #0081E9; margin: 0 !important; padding: 0 !important;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <!-- LOGO -->
              <tr>
                  <td bgcolor="#0081E9" align="center">
                      <table border="0" cellpadding="0" cellspacing="0" width="480" >
                          <tr>
                              <td align="center" valign="top" style="padding: 40px 10px 40px 10px;">
                                <div style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #FFFFFF; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                  <h6 style="margin:0px"> DIVIDEALS</h6>
                                </div>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
              <!-- HERO -->
              <tr>
                  <td bgcolor="#0081E9" align="center" style="padding: 0px 10px 0px 10px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="480" >
                          <tr>
                              <td bgcolor="#FFFFFF" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                <h6 style="margin:0px"> Dear</h6>
                                <h1 style="font-size: 32px; font-weight: 400; margin: 0;">${firstName} ${lastName}</h1>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
              <!-- COPY BLOCK -->
              <tr>
                  <td bgcolor="#F4F4F4" align="center" style="padding: 0px 10px 0px 10px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="480" >
                        <!-- COPY -->
                        <tr>
                          <td bgcolor="#FFFFFF" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                            <p style="margin: 0;">You have successfully purchased voucher in DIVIDEALS. Thank you for your purchase. Hope we meet your expectations. </p>
                          </td>
                        </tr>
                        <!-- BULLETPROOF BUTTON -->
                        <tr>
                          <td bgcolor="#FFFFFF" align="left">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                             
                            </table>
                          </td>
                        </tr>
                      </table>
                  </td>
              </tr>
              <!-- COPY CALLOUT -->
              <tr>
                  <td bgcolor="#F4F4F4" align="center" style="padding: 0px 10px 0px 10px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="480" >
                      </table>
                  </td>
              </tr>
              <!-- SUPPORT CALLOUT -->
              <tr>
                  <td bgcolor="#F4F4F4" align="center" style="padding: 30px 10px 0px 10px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="480" >
                          <!-- HEADLINE -->
                          <tr>
                            <td bgcolor="#0081E9" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                              <h2 style="font-size: 20px; font-weight: 400; color: #FFFFFF; margin: 0;">Need more help?</h2>
                              <p style="margin: 0;"><a style="color: #FFFFFF;">We&rsquo;re here, ready to talk</a></p>
                            </td>
                          </tr>
                      </table>
                  </td>
              </tr>
              <!-- FOOTER -->
              <tr>
                  <td bgcolor="#F4F4F4" align="center" style="padding: 0px 10px 0px 10px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="480" >
                        <!-- PERMISSION REMINDER -->
                        <tr>
                          <td bgcolor="#F4F4F4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;" >
                            <p style="margin: 0;">You received this email because you requested for a password. If you did not, <a  style="color: #111111; font-weight: 700;">please contact us.</a>.</p>
                          </td>
                        </tr>
                      </table>
                  </td>
              </tr>
          </table>
          </body>
          </html>
        `,
    };
};
exports.getEmailHTML = getEmailHTML;
//# sourceMappingURL=emailHtml.js.map