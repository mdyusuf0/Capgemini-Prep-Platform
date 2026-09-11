import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | number) {
  return format(new Date(date), "PPP");
}

export function formatTime(date: Date | string | number) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}
