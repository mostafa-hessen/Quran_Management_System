export default function maskEmail(email: string): string {
  if (!email) return '';
  const [localPart, domain] = email.split('@');
  if (!domain) return email; // not a valid email, return as is
  const visible = localPart.slice(0, 2);
  const masked = '*'.repeat(Math.max(0, localPart.length - 2));
  return `${visible}${masked}@${domain}`;
}
