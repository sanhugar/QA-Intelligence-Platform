/** Trim a string; returns empty string for nullish input. */
export function trimToEmpty(value: string | undefined | null): string {
  return (value ?? '').trim();
}

/** True when value is a finite number greater than zero. */
export function isPositiveFiniteNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}
