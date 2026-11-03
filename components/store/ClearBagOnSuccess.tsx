"use client";

import { useEffect } from "react";
import { clearBag } from "@/lib/bag";

export default function ClearBagOnSuccess() {
  useEffect(() => clearBag(), []);
  return null;
}
