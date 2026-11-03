import type { Metadata } from "next";
import BagView from "@/components/store/BagView";

export const metadata: Metadata = { title: "Bag", robots: { index: false } };

export default function BagPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-8">
      <h1 className="mb-10 font-serif text-5xl font-light text-ink">Your Bag</h1>
      <BagView />
    </div>
  );
}
