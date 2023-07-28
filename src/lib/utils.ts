import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidCSV(input: string): boolean {
  // Each line must have the same number of fields.
  const lines = input.split(/\r?\n/);

  // Get field count on the first line.
  const numFields = lines[0].split(",").length;

  // Check field count consistency in each line.
  for (const line of lines) {
    // Skip if line is empty.
    if (line.trim() === "") continue;

    // If any line has a different number of fields, return false.
    if (line.split(",").length !== numFields) {
      return false;
    }
  }

  return true;
}
