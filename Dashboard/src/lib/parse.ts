/**
 * Zod applies a field's `.default()` even when the schema is `.partial()`, so a
 * PATCH carrying only `{ title }` would come back with every other field filled
 * in with its default — silently wiping stored values.
 *
 * This keeps only the keys the caller actually sent, while still using Zod's
 * parsed/coerced value for them.
 */
export function pickProvided(
  parsed: Record<string, unknown>,
  body: unknown,
): Record<string, unknown> {
  if (typeof body !== "object" || body === null) return {};
  const sent = body as Record<string, unknown>;
  return Object.fromEntries(
    Object.entries(parsed).filter(([key]) =>
      Object.prototype.hasOwnProperty.call(sent, key),
    ),
  );
}
