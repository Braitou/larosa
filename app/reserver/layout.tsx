import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

export default function ReserverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-background-main">
        {children}
      </main>
      <Footer />
    </div>
  );
}



