import * as nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";

const sendEmail = async (options: {
  email: string;
  subject: string;
  mailgen: any;
}) => {
  console.log(options.mailgen);

  const emailTextual = `Hello ${options.mailgen.username}
  This is to verify your email click on the link 
  ${options.mailgen.verifyEmail}`;

  const filePath = path.join(
    __dirname,
    "../../public/templates/verificationMail.html"
  );
  const source = fs.readFileSync(filePath, "utf-8").toString();
  const template = handlebars.compile(source);

  const replacements = {
    email: options.mailgen.email,
    verifyEmail: options.mailgen?.verifyEmail,
  };

  // Generate an HTML email with the provided contents
  const emailHtml = template(replacements);

  // Create a nodemailer transporter instance which is responsible to send a mail
  const transporter = nodemailer.createTransport({
    host: process.env.GMAIL_SMTP_HOST,
    port: Number(process.env.GMAIL_SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.GMAIL_SMTP_USER,
      pass: process.env.GMAIL_SMTP_PASS,
    },
  });

  const mail = {
    from: process.env.GMAIL_SMTP_USER, // We can name this anything. The mail will go to your Mailtrap inbox
    to: options.email, // receiver's mail
    subject: options.subject, // mail subject
    text: emailTextual, // mailgen content textual variant
    html: emailHtml, // mailgen content html variant
  };

  try {
    console.log("sent")
    await transporter.sendMail(mail);
  } catch (error) {
    console.log(
      "Email service failed silently. Make sure you have provided your MAILTRAP credentials in the .env file"
    );
    console.log("Error: ", error);
  }
};

const emailVerificationMailgenContent = (
  username: string,
  verificationUrl: string
) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our app! We're very excited to have you on board.",
      action: {
        instructions:
          "To verify your email please click on the following button:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

/**
 *
 * @param {string} username
 * @param {string} verificationUrl
 * @returns {Mailgen.Content}
 * @description It designs the forgot password mail
 */
const forgotPasswordMailgenContent = (
  username: string,
  passwordResetUrl: string
) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of our account",
      action: {
        instructions:
          "To reset your password click on the following button or link:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Reset password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export {
  sendEmail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
};
