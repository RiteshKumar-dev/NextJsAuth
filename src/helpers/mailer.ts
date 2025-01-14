import nodemailer from "nodemailer";
import NextUser from "@/models/userModel";
import bcryptjs from "bcryptjs";

// Define a type for the function parameters
interface SendMailParams {
  email: string;
  emailType: "verify" | "reset";
  userId: string;
}

export const sendMail = async ({
  email,
  emailType,
  userId,
}: SendMailParams) => {
  try {
    const hashToken = await bcryptjs.hash(userId, 12);

    // Update the user based on the email type
    if (emailType === "verify") {
      await NextUser.findByIdAndUpdate(userId, {
        verifyToken: hashToken,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour expiry
      });
    } else if (emailType === "reset") {
      await NextUser.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour expiry
      });
    }

    // Use const for the transporter
    const transport = nodemailer.createTransport({
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
            emailType === "verify" ? "verify your email" : "reset your password"
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

    // Send the email
    const info = await transport.sendMail(mailOptions);
    return { message: "Email sent successfully", info };
  } catch (error: unknown) {
    // Use `unknown` for error and narrow it down
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unknown error occurred" };
  }
};
