import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/providers/cart-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { getTokenFromCookie } from "@/lib/shopify/customer";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getTokenFromCookie();
  const isLoggedIn = !!token;

  return (
    <AuthProvider isLoggedIn={isLoggedIn}>
      <CartProvider>
        <Navbar />
        <div className="pt-20 min-h-screen flex flex-col">
          <div className="grow">
            {children}
          </div>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
