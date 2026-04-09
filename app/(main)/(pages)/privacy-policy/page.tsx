import { Container } from "@/components/container";
import Image from "next/image";
import Link from "next/link";

const LAST_UPDATED = "April 9, 2026";

const sections = [
  { id: "information-collection", title: "Information We Collect" },
  { id: "use-of-information", title: "Use of Information" },
  { id: "cookies", title: "Cookies & Tracking" },
  { id: "third-party", title: "Third-Party Services" },
  { id: "data-security", title: "Data Security" },
  { id: "childrens-privacy", title: "Children's Privacy" },
  { id: "changes", title: "Changes to This Policy" },
  { id: "contact", title: "Contact Us" },
];

export default function PrivacyPolicyPage() {
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
              Privacy Policy
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
                    Questions about our privacy practices?{" "}
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

                <PolicySection id="information-collection" title="Information We Collect">
                  <p>
                    When you visit Oodling or make a purchase, we collect certain information to provide you with a seamless shopping experience. This includes:
                  </p>
                  <ul>
                    <li>
                      <strong>Account information</strong> — name, email address, password (encrypted), and profile preferences when you create an account.
                    </li>
                    <li>
                      <strong>Order information</strong> — billing address, shipping address, payment details (processed securely — we do not store full card numbers), and purchase history.
                    </li>
                    <li>
                      <strong>Device & usage data</strong> — IP address, browser type, operating system, referring URLs, pages viewed, and time spent on pages.
                    </li>
                    <li>
                      <strong>Communications</strong> — messages you send us via email, contact forms, or customer support channels.
                    </li>
                  </ul>
                  <p>
                    We collect this information directly from you, automatically through your use of our site, and occasionally from third-party sources such as payment processors and analytics providers.
                  </p>
                </PolicySection>

                <PolicySection id="use-of-information" title="Use of Information">
                  <p>We use the information we collect to:</p>
                  <ul>
                    <li>Process and fulfill your orders, including sending order confirmations and shipping updates.</li>
                    <li>Manage your account and provide customer support.</li>
                    <li>Personalise your shopping experience and recommend products you may enjoy.</li>
                    <li>Send you promotional communications, newsletters, and special offers — with your consent and with an easy opt-out at any time.</li>
                    <li>Analyse site usage to improve our platform, product offerings, and services.</li>
                    <li>Detect and prevent fraud, abuse, and security incidents.</li>
                    <li>Comply with legal obligations.</li>
                  </ul>
                  <p>
                    We will never sell your personal information to third parties. We share data only as described in this policy.
                  </p>
                </PolicySection>

                <PolicySection id="cookies" title="Cookies & Tracking">
                  <p>
                    Oodling uses cookies and similar tracking technologies to recognise you, remember your preferences, and understand how you interact with our site. We use:
                  </p>
                  <ul>
                    <li>
                      <strong>Essential cookies</strong> — required for the site to function, including your shopping cart and session.
                    </li>
                    <li>
                      <strong>Analytics cookies</strong> — help us understand traffic patterns and improve our site (e.g., Google Analytics).
                    </li>
                    <li>
                      <strong>Marketing cookies</strong> — allow us to show you relevant ads on other platforms based on your browsing behaviour.
                    </li>
                  </ul>
                  <p>
                    You can manage or disable non-essential cookies through your browser settings or our cookie preference centre. Note that disabling certain cookies may affect site functionality.
                  </p>
                </PolicySection>

                <PolicySection id="third-party" title="Third-Party Services">
                  <p>
                    We work with trusted third-party partners to operate our business. These partners may process your data on our behalf, subject to their own privacy practices:
                  </p>
                  <ul>
                    <li><strong>Payment processors</strong> — to handle transactions securely.</li>
                    <li><strong>Shipping & logistics providers</strong> — to deliver your orders.</li>
                    <li><strong>Analytics platforms</strong> — to help us understand site performance.</li>
                    <li><strong>Email marketing tools</strong> — to send communications you've opted into.</li>
                    <li><strong>Social media platforms</strong> — if you interact with our social features or connect social accounts.</li>
                  </ul>
                  <p>
                    Our site may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their policies.
                  </p>
                </PolicySection>

                <PolicySection id="data-security" title="Data Security">
                  <p>
                    We take the security of your personal information seriously. We implement industry-standard measures including SSL/TLS encryption for data in transit, encrypted storage for sensitive data, access controls limiting who can view your information, and regular security assessments.
                  </p>
                  <p>
                    Despite our precautions, no method of transmission over the internet or electronic storage is 100% secure. If you suspect unauthorised access to your account, please contact us immediately at{" "}
                    <a href="mailto:privacy@oodling.com" className="text-gray-900 underline underline-offset-2 hover:opacity-60 transition-opacity">
                      privacy@oodling.com
                    </a>.
                  </p>
                  <p>
                    You have the right to access, correct, or request deletion of your personal data. To exercise these rights, contact us using the details in the Contact section below.
                  </p>
                </PolicySection>

                <PolicySection id="childrens-privacy" title="Children's Privacy">
                  <p>
                    Oodling is not directed to children under the age of 16. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us and we will promptly delete such data.
                  </p>
                </PolicySection>

                <PolicySection id="changes" title="Changes to This Policy">
                  <p>
                    We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we do, we will revise the "Last updated" date at the top of this page.
                  </p>
                  <p>
                    For significant changes, we will notify you via email (if you have an account) or by displaying a prominent notice on our site. We encourage you to review this policy periodically to stay informed about how we protect your information.
                  </p>
                </PolicySection>

                <PolicySection id="contact" title="Contact Us">
                  <p>
                    If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please reach out to us:
                  </p>
                  <div className="bg-gray-50 border border-gray-100 p-6 mt-4 not-prose">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Oodling Privacy Team</p>
                    <div className="flex flex-col gap-1.5 text-sm text-gray-600">
                      <p>
                        Email:{" "}
                        <a href="mailto:privacy@oodling.com" className="text-gray-900 underline underline-offset-2 hover:opacity-60 transition-opacity">
                          privacy@oodling.com
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
                </PolicySection>
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
        At Oodling, your privacy matters deeply to us. This Privacy Policy explains how we collect, use, share, and protect your personal information when you visit our website or make a purchase. By using Oodling, you agree to the practices described in this policy.
      </p>
    </div>
  );
}

function PolicySection({
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
