"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

export default function QuickInquiry() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") || "").trim(),
          email: String(data.get("email") || "").trim(),
          phone: String(data.get("phone") || "").trim(),
          subject: "House design enquiry from homepage",
          message: String(data.get("message") || "").trim(),
        }),
      });
      if (!response.ok) throw new Error("Contact request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="cb-inquiry cb-inquiry-success" role="status">
        <span className="cb-index">Message received</span>
        <h3>Thank you for reaching out.</h3>
        <p>Your message has been sent to Concept Builders. We’ll be in touch to discuss your project.</p>
        <Link href="/designs">Explore house plans while you wait <span aria-hidden="true">→</span></Link>
      </div>
    );
  }

  return (
    <form className="cb-inquiry" onSubmit={submit}>
      <h3>Send a quick enquiry</h3>
      <p>Tell us where you’re starting. We’ll take it from there.</p>
      <div className="cb-inquiry-row">
        <label>Full name <input type="text" name="name" autoComplete="name" required placeholder="Your name" /></label>
        <label>Email address <input type="email" name="email" autoComplete="email" required placeholder="you@example.com" /></label>
      </div>
      <label>Phone / WhatsApp <span>(optional)</span>
        <input type="tel" name="phone" autoComplete="tel" placeholder="+254 7xx xxx xxx" />
      </label>
      <label>What are you planning?
        <textarea name="message" rows={3} required placeholder="A 3 bedroom home on a 50 × 100 plot, or just an early idea…" />
      </label>
      {status === "error" && (
        <p className="cb-inquiry-error" role="alert">
          We couldn’t send your message. Please try again or contact us on WhatsApp.
        </p>
      )}
      <button type="submit" className="cb-button cb-button-gold" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send enquiry"} <span aria-hidden="true">→</span>
      </button>
      <small>We’ll use your details to respond to this enquiry.</small>
    </form>
  );
}
