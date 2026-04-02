import { Container } from "@/components/container";
import Features from "@/components/home/features";
import Image from "next/image";
import Link from "next/link";

export default function AboutUsPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] min-h-[400px] md:min-h-[500px] flex items-center">
        <Image 
          src="/images/miscellaneous/oodling_img1.png" 
          alt="About Us Hero"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/20" />
        <Container className="relative z-10 w-full">
          <div className="max-w-2xl text-white">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium leading-tight tracking-tight">
              Our goal is to offer you the exclusive hand-picked products that will make your soul shine.
            </h1>
          </div>
        </Container>
      </section>

      {/* Brands Section */}
      <section className="py-8 md:py-12 border-b border-gray-100">
        <Container>
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-300">
            {/* Using styled text as logo placeholders to match design intent visually */}
            <span className="text-2xl md:text-3xl font-bold font-sans italic">NIKE</span>
            <span className="text-2xl md:text-3xl font-bold tracking-[0.2em] uppercase">Hush</span>
            <span className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Puma</span>
            <div className="border-[3px] border-black rounded-[2rem] px-4 py-1 flex items-center justify-center">
              <span className="text-xl md:text-2xl font-bold uppercase tracking-widest">Shoei</span>
            </div>
            <span className="text-3xl md:text-4xl font-serif italic font-bold">Marc</span>
            <span className="text-3xl md:text-4xl font-serif italic text-red-600 grayscale">Supreme</span>
          </div>
        </Container>
      </section>

      {/* Products Made With Love Section */}
      <section className="py-20 md:py-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left: Images */}
            <div className="flex gap-4 md:gap-8 items-center">
              <div className="w-1/2 aspect-[4/5] relative bg-gray-100 overflow-hidden">
                <Image src="/images/miscellaneous/oodling_img1.png" alt="Product 1" fill className="object-cover" />
              </div>
              <div className="w-1/2 aspect-[3/4] relative bg-gray-100 overflow-hidden">
                <Image src="/images/miscellaneous/oodling_img2.png" alt="Product 2" fill className="object-cover" />
              </div>
            </div>
            
            {/* Right: Text */}
            <div className="flex flex-col gap-4">
              <span className="text-sm font-bold uppercase tracking-wider text-gray-900">Tagline</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 leading-[1.1]">
                Products made<br/>with love.
              </h2>
              <p className="text-gray-500 leading-relaxed text-base md:text-lg mt-2 md:mt-4 max-w-lg">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonial Section */}
      <section className="bg-gray-50/50 py-20 md:py-32 border-y border-gray-100">
        <Container className="max-w-4xl text-center flex flex-col items-center">
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-16 h-16 relative rounded-full overflow-hidden bg-gray-200">
               <Image src="/images/miscellaneous/oodling_img3.png" alt="John F." fill className="object-cover object-top" />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-gray-900 text-sm">John F.</span>
              <div className="flex text-yellow-500 mt-1 space-x-1">
                 {/* 5 stars */}
                 {[...Array(5)].map((_, i) => (
                   <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                     <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                   </svg>
                 ))}
              </div>
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-medium text-gray-900 leading-normal mb-10">
            &ldquo;Very well designed and the quality is superb even after washing it's like new. Very pleased with the purchase.&rdquo;
          </h3>
          <div className="flex gap-4">
            <button aria-label="Previous testimonial" className="w-12 h-12 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <button aria-label="Next testimonial" className="w-12 h-12 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </Container>
      </section>

      {/* Supporting Local Designers Section */}
      <section className="py-20 md:py-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left: Text */}
            <div className="flex flex-col gap-4 order-2 lg:order-1">
              <span className="text-sm font-bold uppercase tracking-wider text-gray-900">TRENDING</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 leading-[1.1]">
                Supporting local<br/>designers.
              </h2>
              <p className="text-gray-500 leading-relaxed text-base md:text-lg mt-2 md:mt-4 max-w-lg">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.
              </p>
            </div>

            {/* Right: Images */}
            <div className="flex gap-4 md:gap-8 items-start order-1 lg:order-2">
              <div className="w-1/2 aspect-[4/5] relative bg-gray-100 overflow-hidden mt-12 md:mt-24">
                <Image src="/images/miscellaneous/oodling_img4.png" alt="Designer 1" fill className="object-cover" />
              </div>
              <div className="w-1/2 aspect-[3/4] relative bg-gray-100 overflow-hidden mb-12 md:mb-24">
                <Image src="/images/miscellaneous/oodling_img5.png" alt="Designer 2" fill className="object-cover" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Feature Video Section */}
      <section className="py-20 md:py-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            {/* Left Text */}
            <div className="lg:col-span-4 flex flex-col gap-4 order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
                Feature Title
              </h2>
              <p className="text-gray-500 leading-relaxed font-medium">
                Predictably engage worldwide with web-enabled process-centric technology.
              </p>
              <Link href="/collections" className="inline-flex items-center gap-2 text-gray-900 font-semibold group mt-4 hover:opacity-80 transition-opacity">
                <span className="underline underline-offset-4 decoration-2">See collection</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>

            {/* Right Video Mock */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              <div className="relative aspect-[16/9] w-full bg-gray-100 cursor-pointer group overflow-hidden">
                <Image 
                  src="/images/miscellaneous/oodling_img2.png" 
                  alt="Feature Video" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-900 translate-x-0.5 w-6 h-6 md:w-8 md:h-8">
                      <path d="M5 3V21L19 12L5 3Z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Global Features Section */}
      <Features />
    </main>
  );
}
