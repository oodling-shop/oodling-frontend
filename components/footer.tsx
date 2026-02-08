import { Container } from './container';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Mail, ChevronDown } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-background text-foreground py-12 lg:py-16 border-t border-border">
      <Container>
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-24 mb-16">
          {/* Left Column */}
          <div className="flex flex-col gap-6 max-w-sm">
            <Link href="/" className="inline-block">
              <Image 
                src="/images/logo.png" 
                alt="Nayzak Logo" 
                width={140} 
                height={40} 
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              Phosf luorescently engage worldwide method process shopping.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Mail].map((Icon, i) => (
                <Link 
                  key={i} 
                  href="#" 
                  className="p-2.5 rounded-full border border-border bg-background hover:bg-muted hover:text-foreground text-muted-foreground transition-colors"
                >
                  <Icon size={18} strokeWidth={2} />
                </Link>
              ))}
            </div>
          </div>

          {/* Right Columns Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 w-full lg:w-auto">
            {/* Shop Column */}
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-foreground">Shop</h3>
              <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">My account</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Login</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Wishlist</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Cart</Link></li>
              </ul>
            </div>
            
            {/* Information Column */}
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-foreground">Information</h3>
              <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Shipping Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Returns & Refunds</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Cookies Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Frequently asked</Link></li>
              </ul>
            </div>
            
            {/* Company Column */}
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-foreground">Company</h3>
              <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">About us</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms & Conditions</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2088 Nayzak Design</p>
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 hover:text-foreground transition-colors">
              <span className="text-base">🇺🇸</span>
              <span>English</span>
              <ChevronDown size={14} />
            </button>
            <button className="flex items-center gap-2 hover:text-foreground transition-colors">
              <span>USD</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </Container>
    </footer>
  );
};
