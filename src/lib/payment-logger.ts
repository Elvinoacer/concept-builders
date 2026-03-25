export function logPaymentEvent(
  event: string,
  data: Record<string, unknown>,
) {
  const entry = {
    timestamp: new Date().toISOString(),
    event,
    ...data,
  };

  console.log(`[PAYMENT] ${JSON.stringify(entry)}`);
}
