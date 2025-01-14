import nodemailer from "nodemailer";
import NextUser from "@/models/userModel";
import bcrytjs from "bcryptjs";

export const sendMail = async ({ email, emailType, userId }: any) => {
  try {
    const hashToken = await bcrytjs.hash(userId.toString(), 12);
    if (emailType === "verify") {
      await NextUser.findByIdAndUpdate(userId, {
        verifyToken: hashToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "reset") {
      await NextUser.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashToken,
        forgotPasswordTokenExpiye: Date.now() + 3600000,
      });
    }
    // Looking to send emails in production? Check out our Email API/SMTP product!
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "2f5b80f58debd6",
        pass: "95d8e07be8fd66",
      },
    });

    const mailOptions = {
      from: "developer.ritesh1@gmail.com",
      to: email,
      subject:
        emailType === "verify" ? "Verify Your Email" : "Reset Your Password",
      html: `
          <p>
            Click <a href="${
              process.env.DOMAIN
            }/verifyemail?token=${hashToken}" target="_blank" style="color: blue; text-decoration: underline;">
              here
            </a> to ${
              emailType === "verify"
                ? "verify your email"
                : "reset your password"
            }.
          </p>
          <p>
            If the link above doesn't work, copy and paste the following URL into your browser:
          </p>
          <p style="font-weight: bold;">
            ${process.env.DOMAIN}/verifyemail?token=${hashToken}
          </p>
          <p>
            If you did not request this, please ignore this email or contact support if you have concerns.
          </p>
          <p>Thank you, <br> The Team</p>
        `,
    };

    const info = await transport.sendMail(mailOptions);
    return { message: "Email sent successfully", info };
  } catch (error: any) {
    return { error: error.message };
  }
};
