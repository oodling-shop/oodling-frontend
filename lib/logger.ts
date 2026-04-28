/**
 * Audit logging for security-sensitive operations.
 * In production, these should be sent to a centralized logging service
 * like Datadog, Axiom, or CloudWatch.
 */
export function logSecurityEvent(event: string, details: Record<string, any>) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    ...details,
  };
  
  // For now, log to console. In production, use a proper logger.
  console.log(`[SECURITY AUDIT] ${JSON.stringify(logEntry)}`);
}
