import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function ShopLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
