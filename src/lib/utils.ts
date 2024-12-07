// src/lib/utils.ts

// Example implementation of the `cn` function
export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}