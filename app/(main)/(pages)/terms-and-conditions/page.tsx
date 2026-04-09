import { Container } from "@/components/container";
import { BRAND_EMAILS, BRAND_NAME, BRAND_WEBSITE } from "@/constants";
import Image from "next/image";
import Link from "next/link";

const LAST_UPDATED = "April 9, 2026";

const sections = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "use-of-site", title: "Use of the Site" },
  { id: "products-orders", title: "Products & Orders" },
  { id: "payments", title: "Payments & Pricing" },
  { id: "returns", title: "Returns & Refunds" },
  { id: "intellectual-property", title: "Intellectual Property" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "governing-law", title: "Governing Law" },
  { id: "contact", title: "Contact Us" },
];

export default function TermsAndConditionsPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative border-b border-gray-100 py-16 md:py-24">
        <Image
          src="/images/bg.png"
          alt="Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-white/80" />
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Legal
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-gray-900 leading-[1.05] mb-6">
              Terms &amp; Conditions
            </h1>
            <p className="text-gray-400 text-sm">
              Last updated:{" "}
              <time dateTime="2026-04-09" className="text-gray-600 font-medium">
                {LAST_UPDATED}
              </time>
            </p>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            {/* Sidebar TOC */}
            <aside className="lg:w-64 shrink-0">
              <div className="lg:sticky lg:top-24">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">
                  Contents
                </p>
                <nav className="flex flex-col gap-1">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="text-sm text-gray-500 hover:text-gray-900 py-1.5 border-l-2 border-transparent hover:border-gray-900 pl-3 transition-all duration-150"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>

                <div className="mt-10 pt-8 border-t border-gray-100">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Questions about these terms?{" "}
                    <Link
                      href="/contact-us"
                      className="text-gray-900 underline underline-offset-2 hover:opacity-60 transition-opacity"
                    >
                      Contact us
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 max-w-2xl">
              <div className="prose-custom">
                <Intro />

                <TermsSection id="acceptance" title="Acceptance of Terms">
                  <p>
                    By accessing or using the {BRAND_NAME} website ({BRAND_WEBSITE}), placing an order, or creating an account, you confirm that you have read, understood, and agree to be bound by these Terms &amp; Conditions and our Privacy Policy.
                  </p>
                  <p>
                    If you do not agree to these terms, please do not use our site. We reserve the right to update these terms at any time. Continued use of the site after changes constitutes your acceptance of the revised terms.
                  </p>
                  <p>
                    These terms apply to all visitors, users, and customers of Oodling. You must be at least 16 years of age to use this site and make purchases.
                  </p>
                </TermsSection>

                <TermsSection id="use-of-site" title="Use of the Site">
                  <p>
                    You agree to use the Oodling site only for lawful purposes and in a manner that does not infringe the rights of others. You must not:
                  </p>
                  <ul>
                    <li>Use the site in any way that is unlawful, harmful, or fraudulent.</li>
                    <li>Attempt to gain unauthorised access to any part of the site or its related systems.</li>
                    <li>Transmit any unsolicited or unauthorised advertising or promotional material.</li>
                    <li>Knowingly introduce viruses, trojans, worms, or other malicious code.</li>
                    <li>Scrape, crawl, or extract data from the site using automated means without our written consent.</li>
                    <li>Impersonate any person or entity, or misrepresent your affiliation with any person or entity.</li>
                  </ul>
                  <p>
                    We reserve the right to suspend or terminate access to the site for any user who violates these terms or engages in conduct we deem harmful to our community or business.
                  </p>
                </TermsSection>

                <TermsSection id="products-orders" title="Products & Orders">
                  <p>
                    All products listed on Oodling are subject to availability. We reserve the right to discontinue any product at any time without notice.
                  </p>
                  <p>
                    When you place an order, you are making an offer to purchase. We reserve the right to accept or decline any order. An order is confirmed only when you receive an order confirmation email from us.
                  </p>
                  <ul>
                    <li>
                      <strong>Product descriptions</strong> — we make every effort to display product colours, sizes, and details accurately, but slight variations may occur due to screen settings or manufacturing.
                    </li>
                    <li>
                      <strong>Stock availability</strong> — in the rare event that an item becomes unavailable after your order, we will notify you promptly and arrange a full refund or suitable alternative.
                    </li>
                    <li>
                      <strong>Order modifications</strong> — once an order is confirmed and processing has begun, we may not be able to modify or cancel it. Contact us immediately if you need to make changes.
                    </li>
                  </ul>
                </TermsSection>

                <TermsSection id="payments" title="Payments & Pricing">
                  <p>
                    All prices on Oodling are displayed in the currency shown and are inclusive of applicable taxes unless otherwise stated. Shipping costs are calculated at checkout.
                  </p>
                  <p>
                    We accept major credit and debit cards, and other payment methods as displayed at checkout. Payment is processed securely through our third-party payment providers. Oodling does not store your full payment card details.
                  </p>
                  <ul>
                    <li>
                      <strong>Price changes</strong> — we reserve the right to change prices at any time. The price you pay is the price displayed at the time of purchase.
                    </li>
                    <li>
                      <strong>Promotional codes</strong> — discount codes must be applied at checkout and cannot be applied retroactively. One code per order unless otherwise specified.
                    </li>
                    <li>
                      <strong>Failed payments</strong> — if a payment fails, your order will not be confirmed. Please contact your bank or try an alternative payment method.
                    </li>
                  </ul>
                </TermsSection>

                <TermsSection id="returns" title="Returns & Refunds">
                  <p>
                    We want you to love your Oodling purchase. If you're not completely satisfied, we offer a straightforward returns process.
                  </p>
                  <ul>
                    <li>
                      <strong>Return window</strong> — items may be returned within 30 days of delivery, provided they are unused, unwashed, and in their original packaging with tags attached.
                    </li>
                    <li>
                      <strong>How to return</strong> — initiate a return through your account or by contacting our support team. We will provide a return shipping label where applicable.
                    </li>
                    <li>
                      <strong>Refunds</strong> — once your return is received and inspected, we will process your refund within 5–10 business days to your original payment method.
                    </li>
                    <li>
                      <strong>Non-returnable items</strong> — certain items such as personalised, final sale, or hygiene-sensitive products cannot be returned unless faulty.
                    </li>
                    <li>
                      <strong>Faulty items</strong> — if you receive a damaged or incorrect item, contact us within 7 days of delivery and we will make it right at no cost to you.
                    </li>
                  </ul>
                </TermsSection>

                <TermsSection id="intellectual-property" title="Intellectual Property">
                  <p>
                    All content on the Oodling website — including but not limited to text, graphics, logos, images, product photography, and software — is the property of Oodling or its content suppliers and is protected by applicable intellectual property laws.
                  </p>
                  <p>
                    You may not reproduce, distribute, modify, display, or create derivative works from any content on this site without our prior written permission. Unauthorised use of Oodling content may violate copyright, trademark, and other laws.
                  </p>
                  <p>
                    If you believe any content on our site infringes your intellectual property rights, please contact us at{" "}
                    <a href={`mailto:${BRAND_EMAILS.legal}`} className="text-gray-900 underline underline-offset-2 hover:opacity-60 transition-opacity">
                      {BRAND_EMAILS.legal}
                    </a>{" "}
                    with the details of your claim.
                  </p>
                </TermsSection>

                <TermsSection id="liability" title="Limitation of Liability">
                  <p>
                    To the fullest extent permitted by law, Oodling and its directors, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of, or inability to use, the site or any products purchased through it.
                  </p>
                  <p>
                    Our total liability to you for any claim arising from your use of the site or a purchase shall not exceed the amount you paid for the relevant order.
                  </p>
                  <p>
                    Nothing in these terms limits or excludes our liability for death or personal injury caused by our negligence, fraud, or any other liability that cannot be excluded under applicable law.
                  </p>
                </TermsSection>

                <TermsSection id="governing-law" title="Governing Law">
                  <p>
                    These Terms &amp; Conditions are governed by and construed in accordance with the laws of the jurisdiction in which Oodling operates. Any disputes arising from these terms or your use of the site will be subject to the exclusive jurisdiction of the courts in that jurisdiction.
                  </p>
                  <p>
                    If any provision of these terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect.
                  </p>
                  <p>
                    These terms constitute the entire agreement between you and Oodling regarding your use of the site and supersede any prior agreements or understandings.
                  </p>
                </TermsSection>

                <TermsSection id="contact" title="Contact Us">
                  <p>
                    If you have any questions about these Terms &amp; Conditions, please contact us:
                  </p>
                  <div className="bg-gray-50 border border-gray-100 p-6 mt-4 not-prose">
                    <p className="text-sm font-semibold text-gray-900 mb-3">{BRAND_NAME} Legal Team</p>
                    <div className="flex flex-col gap-1.5 text-sm text-gray-600">
                      <p>
                        Email:{" "}
                        <a href={`mailto:${BRAND_EMAILS.legal}`} className="text-gray-900 underline underline-offset-2 hover:opacity-60 transition-opacity">
                          {BRAND_EMAILS.legal}
                        </a>
                      </p>
                      <p>
                        Or use our{" "}
                        <Link href="/contact-us" className="text-gray-900 underline underline-offset-2 hover:opacity-60 transition-opacity">
                          contact form
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                </TermsSection>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <style>{`
        .prose-custom p {
          color: rgb(107 114 128);
          line-height: 1.75;
          margin-bottom: 1rem;
          font-size: 0.9375rem;
        }
        .prose-custom ul {
          margin: 1rem 0 1.25rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .prose-custom li {
          color: rgb(107 114 128);
          font-size: 0.9375rem;
          line-height: 1.7;
          padding-left: 1.25rem;
          position: relative;
        }
        .prose-custom li::before {
          content: '—';
          position: absolute;
          left: 0;
          color: rgb(209 213 219);
        }
        .prose-custom strong {
          color: rgb(17 24 39);
          font-weight: 600;
        }
        .prose-custom a {
          color: rgb(17 24 39);
        }
      `}</style>
    </main>
  );
}

function Intro() {
  return (
    <div className="pb-10 mb-10 border-b border-gray-100">
      <p className="text-gray-500 leading-relaxed text-[0.9375rem]">
        Please read these Terms &amp; Conditions carefully before using the Oodling website or placing an order. These terms set out the rules for using our site and the basis on which we sell products to you. By using Oodling, you agree to these terms in full.
      </p>
    </div>
  );
}

function TermsSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-14 scroll-mt-24">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight mb-5 pb-4 border-b border-gray-100">
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}
