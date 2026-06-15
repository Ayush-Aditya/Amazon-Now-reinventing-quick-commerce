/**
 * Tiny shared helpers used across the mock pipeline files. Kept
 * intentionally small and dependency-free so the mock package can be
 * lifted into other contexts without dragging anything along.
 */

/**
 * ULID-ish generator for mock event ids. Real implementation should
 * use the `ulid` npm package — ULIDs are time-sortable and 26 chars.
 */
export function randomULID() {
  const t = Date.now().toString(36).padStart(10, '0').toUpperCase();
  const r = Math.random().toString(36).slice(2, 12).toUpperCase();
  return `01H${t}${r}`.slice(0, 26);
}
