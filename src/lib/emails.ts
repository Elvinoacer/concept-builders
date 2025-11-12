import {
  Order,
  User,
  OrderItem,
  Design,
  Invoice,
  InvoiceItem,
  Project,
} from "@/generated/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderWithDetails extends Order {
  user: User;
  items: (OrderItem & { design: Design })[];
}

interface InvoiceWithDetails extends Invoice {
  project: Project & { user: User };
  invoiceItems: InvoiceItem[];
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetLink: string
) {
  try {
    console.log(`Attempting to send password reset email to ${to}`);
    const { data, error } = await resend.emails.send({
      from: `Concept Builders Accounts <support@conceptbuilders.co.ke>`,
      to: to,
      subject: `Password Reset Request for Concept Builders`,
      html: `<h1>Hello ${name},</h1><p>You have requested to reset your password for your Concept Builders account. Please click the link below to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p><p>If you did not request a password reset, please ignore this email.</p>`,
    });
    if (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
    console.log("Password reset email sent successfully:", data);
  } catch (error) {
    console.error("Error in sendPasswordResetEmail function:", error);
    throw error;
  }
}

export async function sendVerificationEmail(
  to: string,
  name: string,
  verificationLink: string
) {
  try {
    console.log(`Attempting to send verification email to ${to}`);
    const { data, error } = await resend.emails.send({
      from: `Concept Builders <${process.env.ADMIN_EMAIL}>`,
      to: to,
      subject: `Verify Your Email for Concept Builders`,
      html: `<h1>Hello ${name},</h1><p>Thank you for registering with Concept Builders. Please click the link below to verify your email address:</p><p><a href="${verificationLink}">Verify Email</a></p><p>If you did not create an account, please ignore this email.</p>`,
    });
    if (error) {
      console.error("Error sending verification email:", error);
      throw error;
    }
    console.log("Verification email sent successfully:", data);
  } catch (error) {
    console.error("Error in sendVerificationEmail function:", error);
    throw error;
  }
}

export async function sendOrderConfirmationEmail(order: OrderWithDetails) {
  try {
    console.log(
      `Attempting to send order confirmation email to ${order.user.email}`
    );
    const { data, error } = await resend.emails.send({
      from: `Concept Builders <${process.env.ADMIN_EMAIL}>`,
      to: order.user.email!,
      subject: `Your Concept Builders Order Confirmation #${order.id}`,
      html: `<h1>Thank you for your order!</h1><p>Your order #${order.id} has been confirmed.</p>`,
    });
    if (error) {
      console.error("Error sending order confirmation email:", error);
      throw error;
    }
    console.log("Order confirmation email sent successfully:", data);
  } catch (error) {
    console.error("Error in sendOrderConfirmationEmail function:", error);
    throw error;
  }
}

export async function sendCustomDesignRequestEmail(requestData: any) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.error("ADMIN_EMAIL environment variable is not set.");
      return;
    }

    console.log(
      `Attempting to send custom design request email to ${adminEmail}`
    );
    const { data, error } = await resend.emails.send({
      from: `Concept Builders <${process.env.ADMIN_EMAIL}>`,
      to: adminEmail,
      subject: `New Custom Design Request from ${requestData.name}`,
      html: `<h1>New Custom Design Request</h1>
        <p><strong>Name:</strong> ${requestData.name}</p>
        <p><strong>Email:</strong> ${requestData.email}</p>
        <p><strong>Phone:</strong> ${requestData.phone || "N/A"}</p>
        <p><strong>Design Type:</strong> ${requestData.designType}</p>
        <p><strong>Budget:</strong> ${requestData.budget || "N/A"}</p>
        <p><strong>Description:</strong></p>
        <p>${requestData.description}</p>
        <p><strong>Attachments:</strong></p>
        <ul>
          ${requestData.attachments.map((url: string) => `<li><a href="${url}">${url}</a></li>`).join("")}
        </ul>`,
    });

    if (error) {
      console.error("Error sending custom design request email:", error);
      throw error;
    }

    console.log("Custom design request email sent successfully:", data);
  } catch (error) {
    console.error("Error in sendCustomDesignRequestEmail function:", error);
    throw error;
  }
}

export async function sendCustomDesignUpdateRequestEmail(
  requestData: any,
  changes?: string
) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.error("ADMIN_EMAIL environment variable is not set.");
      return;
    }

    console.log(
      `Attempting to send custom design request update email to ${adminEmail}`
    );
    const { data, error } = await resend.emails.send({
      from: `Concept Builders <${process.env.ADMIN_EMAIL}>`,
      to: adminEmail,
      subject: `Custom Design Request Updated: #${requestData.id.substring(0, 8)} by ${requestData.name}`,
      html: `<h1>Custom Design Request Updated</h1>
        <p>Custom design request #${requestData.id.substring(0, 8)} by ${requestData.name} has been updated.</p>
        ${changes ? `<p><strong>Changes:</strong> ${changes}</p>` : ""}
        <p><strong>Name:</strong> ${requestData.name}</p>
        <p><strong>Email:</strong> ${requestData.email}</p>
        <p><strong>Phone:</strong> ${requestData.phone || "N/A"}</p>
        <p><strong>Design Type:</strong> ${requestData.designType}</p>
        <p><strong>Budget:</strong> ${requestData.budget || "N/A"}</p>
        <p><strong>Description:</strong></p>
        <p>${requestData.description}</p>
        <p><strong>Attachments:</strong></p>
        <ul>
          ${requestData.attachments.map((url: string) => `<li><a href="${url}">${url}</a></li>`).join("")}
        </ul>`,
    });

    if (error) {
      console.error("Error sending custom design request update email:", error);
      throw error;
    }

    console.log("Custom design request update email sent successfully:", data);
  } catch (error) {
    console.error(
      "Error in sendCustomDesignUpdateRequestEmail function:",
      error
    );
    throw error;
  }
}

export async function sendCustomDesignRequestStatusUpdateEmail(
  requestData: any,
  toEmail: string
) {
  try {
    console.log(
      `Attempting to send custom design request status update email to ${toEmail}`
    );
    const { data, error } = await resend.emails.send({
      from: `Concept Builders <${process.env.ADMIN_EMAIL}>`,
      to: toEmail,
      subject: `Your Custom Design Request Status Updated: #${requestData.id.substring(0, 8)}`,
      html: `<h1>Custom Design Request Status Update</h1>
        <p>Dear ${requestData.name},</p>
        <p>Your custom design request #${requestData.id.substring(0, 8)} has been updated.</p>
        <p><strong>New Status:</strong> ${requestData.status}</p>
        <p>You can view the details of your request by logging into your dashboard.</p>
        <p>Thank you for choosing Concept Builders!</p>`,
    });

    if (error) {
      console.error(
        "Error sending custom design request status update email:",
        error
      );
      throw error;
    }

    console.log(
      "Custom design request status update email sent successfully:",
      data
    );
  } catch (error) {
    console.error(
      "Error in sendCustomDesignRequestStatusUpdateEmail function:",
      error
    );
    throw error;
  }
}

export async function sendInvoiceEmail(invoice: InvoiceWithDetails) {
  try {
    console.log(
      `Attempting to send invoice email to ${invoice.project.user.email}`
    );
    const { data, error } = await resend.emails.send({
      from: `Concept Builders <${process.env.ADMIN_EMAIL}>`,
      to: invoice.project.user.email!,
      subject: `Your Invoice #${invoice.invoiceNumber} from Concept Builders`,
      html: `<h1>Hello ${invoice.project.user.name},</h1>
        <p>Here is your invoice for Project: <strong>${invoice.project.name}</strong>.</p>
        <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
        <p><strong>Issue Date:</strong> ${invoice.issueDate.toDateString()}</p>
        <p><strong>Due Date:</strong> ${invoice.dueDate.toDateString()}</p>
        <p><strong>Total Amount:</strong> ${invoice.totalAmount.toFixed(2)}</p>
        <p><strong>Status:</strong> ${invoice.status}</p>
        ${invoice.documentUrl ? `<p>You can download your invoice here: <a href="${invoice.documentUrl}">Download Invoice</a></p>` : ""}
        <p>You can view full details by logging into your dashboard.</p>
        <p>Thank you for your business!</p>`,
    });
    if (error) {
      console.error("Error sending invoice email:", error);
      throw error;
    }
    console.log("Invoice email sent successfully:", data);
  } catch (error) {
    console.error("Error in sendInvoiceEmail function:", error);
    throw error;
  }
}
