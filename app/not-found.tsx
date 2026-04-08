import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/providers/cart-provider";

export default function NotFound() {
  return (
    <CartProvider>
      <Navbar />
      <main className="pt-16 min-h-screen flex flex-col">
        <div className="flex-grow flex flex-col items-center justify-center px-4 text-center py-20">
          {/* 404 Icon Graphic */}
          <div className="mb-12 relative flex flex-col items-center">
            <div className="flex gap-6 mb-2">
              {/* Left Eye X */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6L26 26M26 6L6 26"
                  stroke="#141718"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
              {/* Right Eye X */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6L26 26M26 6L6 26"
                  stroke="#141718"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            {/* Mouth/Tilted Line */}
            <div className="mt-2 text-[#141718]">
              <svg
                width="48"
                height="12"
                viewBox="0 0 48 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 8L44 4"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-[32px] md:text-[54px] font-medium tracking-tight text-[#141718] mb-4">
            404 - Page not found
          </h1>
          <p className="text-[#6C7275] text-base md:text-[20px] max-w-[480px] mb-10 leading-relaxed font-normal">
            The page you&apos;re looking for isn&apos;t available. Try to search again
            or use the go back button below.
          </p>
          
          <Button 
            asChild 
            className="px-8 py-3 h-auto bg-[#141718] hover:bg-[#141718]/90 text-white rounded-lg transition-all duration-300 text-base font-medium"
          >
            <Link href="/">Go back home</Link>
          </Button>
        </div>
        {/* <Footer /> */}
      </main>
    </CartProvider>
  );
}
