import { Order, User, OrderItem, Design } from "@/generated/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderWithDetails extends Order {
  user: User;
  items: (OrderItem & { design: Design })[];
}

export async function sendOrderConfirmationEmail(order: OrderWithDetails) {
  try {
    await resend.emails.send({
      from: "Concept Builders <noreply@concept-builders.com>",
      to: order.user.email!,
      subject: `Your Concept Builders Order Confirmation #${order.id}`,
      html: `<h1>Thank you for your order!</h1><p>Your order #${order.id} has been confirmed.</p>`,
    });
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw error;
  }
}
