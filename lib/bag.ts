"use client";

import { useSyncExternalStore } from "react";
import type { CartLine } from "@/lib/pricing";
import { MAX_QTY } from "@/lib/pricing";

// The bag lives in localStorage: it holds only product references, never
// prices or credentials, and the server reprices everything at checkout.
const KEY = "jh_bag";
const CHANGE_EVENT = "jh-bag-change";
const EMPTY: CartLine[] = [];

let cachedRaw: string | null = null;
let cachedLines: CartLine[] = EMPTY;

function read(): CartLine[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cachedRaw) return cachedLines;
  cachedRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    cachedLines = Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    cachedLines = EMPTY;
  }
  return cachedLines;
}

function write(lines: CartLine[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    // Storage blocked (private mode etc.): the bag just won't persist.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange); // other tabs
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useBag(): CartLine[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

const sameLine = (a: CartLine, b: Omit<CartLine, "qty">) =>
  a.productId === b.productId && a.size === b.size && a.color === b.color;

export function addToBag(item: Omit<CartLine, "qty">, qty = 1) {
  const lines = read();
  const existing = lines.find((l) => sameLine(l, item));
  write(
    existing
      ? lines.map((l) => (l === existing ? { ...l, qty: Math.min(l.qty + qty, MAX_QTY) } : l))
      : [...lines, { ...item, qty }]
  );
}

export function setQty(item: Omit<CartLine, "qty">, qty: number) {
  write(
    qty <= 0
      ? read().filter((l) => !sameLine(l, item))
      : read().map((l) => (sameLine(l, item) ? { ...l, qty: Math.min(qty, MAX_QTY) } : l))
  );
}

export function clearBag() {
  write([]);
}

export function bagCount(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.qty, 0);
}
