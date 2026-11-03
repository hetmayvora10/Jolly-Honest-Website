import StoreHeader from "@/components/store/StoreHeader";
import Footer from "@/components/Footer";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <StoreHeader />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
