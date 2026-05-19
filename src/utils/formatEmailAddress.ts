// A simple formatter for email addresses in "name <email>" or just "email" format
export function formatEmailAddress(address: string): string {
  // Handles comma-separated emails as well
  return address
    .split(",")
    .map((item) => {
      const match = item.trim().match(/(.*)<(.*)>/);
      if (match) {
        const name = match[1].trim();
        const email = match[2].trim();
        return `${name} <${email}>`;
      }
      return item.trim();
    })
    .join(", ");
}