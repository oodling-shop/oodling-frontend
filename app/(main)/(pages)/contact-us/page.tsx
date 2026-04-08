"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Container } from "@/components/container";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "How does Nayzak work?",
    answer:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum fuga.",
  },
  {
    question: "Which payment methods are accepted?",
    answer:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum fuga.",
  },
  {
    question: "How to get familiar with Figma?",
    answer:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum fuga.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum fuga.",
  },
  {
    question: "Where is my order?",
    answer:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum fuga.",
  },
  {
    question: "I have a problem",
    answer:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum fuga.",
  },
];

const FaqAccordionItem = ({
  item,
  isOpen,
  onClick,
}: {
  item: FaqItem;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="border-b border-gray-100 py-6 md:py-8">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between text-left group"
      >
        <span
          className={`text-[16px] md:text-[18px] font-medium leading-tight transition-colors duration-200 ${
            isOpen ? "text-black" : "text-gray-900"
          }`}
        >
          {item.question}
        </span>
        <div className="flex-shrink-0 ml-4">
          {isOpen ? (
            <Minus className="h-5 w-5 text-black stroke-[1.5px]" />
          ) : (
            <Plus className="h-5 w-5 text-black stroke-[1.5px]" />
          )}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-2">
              <p className="text-gray-500 text-[14px] md:text-[15px] leading-[1.7] max-w-[90%] font-normal">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ContactUsPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero / Title Section */}
      <section className="pt-16 pb-10 md:pt-20 md:pb-12 text-center">
        <Container>
          <h1 className="text-[40px] md:text-[56px] font-bold tracking-tight text-black leading-none mb-4">
            Contact us
          </h1>
          <p className="text-gray-500 text-[14px] md:text-[15px] leading-relaxed max-w-[440px] mx-auto">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui
            blanditiis voluptatum deleniti.
          </p>
        </Container>
      </section>

      {/* Map Section */}
      <section className="w-full h-[280px] sm:h-[340px] md:h-[420px] relative overflow-hidden bg-gray-100">
        {/* SVG street map pattern */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          style={{ background: "#f0efed" }}
        >
          {/* Major roads - horizontal */}
          <line x1="0" y1="18%" x2="100%" y2="14%" stroke="#dbd9d6" strokeWidth="12" />
          <line x1="0" y1="34%" x2="100%" y2="30%" stroke="#dbd9d6" strokeWidth="18" />
          <line x1="0" y1="52%" x2="100%" y2="56%" stroke="#dbd9d6" strokeWidth="14" />
          <line x1="0" y1="70%" x2="100%" y2="68%" stroke="#dbd9d6" strokeWidth="20" />
          <line x1="0" y1="85%" x2="100%" y2="88%" stroke="#dbd9d6" strokeWidth="10" />

          {/* Major roads - vertical */}
          <line x1="12%" y1="0" x2="14%" y2="100%" stroke="#dbd9d6" strokeWidth="14" />
          <line x1="28%" y1="0" x2="26%" y2="100%" stroke="#dbd9d6" strokeWidth="10" />
          <line x1="45%" y1="0" x2="47%" y2="100%" stroke="#dbd9d6" strokeWidth="22" />
          <line x1="62%" y1="0" x2="60%" y2="100%" stroke="#dbd9d6" strokeWidth="12" />
          <line x1="78%" y1="0" x2="80%" y2="100%" stroke="#dbd9d6" strokeWidth="16" />
          <line x1="92%" y1="0" x2="93%" y2="100%" stroke="#dbd9d6" strokeWidth="10" />

          {/* Diagonal roads */}
          <line x1="0" y1="0" x2="40%" y2="100%" stroke="#dbd9d6" strokeWidth="8" />
          <line x1="20%" y1="0" x2="70%" y2="100%" stroke="#dbd9d6" strokeWidth="6" />
          <line x1="55%" y1="0" x2="100%" y2="80%" stroke="#dbd9d6" strokeWidth="8" />
          <line x1="75%" y1="0" x2="100%" y2="50%" stroke="#dbd9d6" strokeWidth="6" />
          <line x1="0" y1="40%" x2="30%" y2="100%" stroke="#dbd9d6" strokeWidth="6" />

          {/* City blocks - rectangles */}
          <rect x="15%" y="20%" width="10%" height="8%" fill="#e8e6e3" rx="1" />
          <rect x="30%" y="10%" width="12%" height="18%" fill="#e8e6e3" rx="1" />
          <rect x="50%" y="20%" width="8%" height="9%" fill="#e8e6e3" rx="1" />
          <rect x="65%" y="8%" width="12%" height="20%" fill="#e8e6e3" rx="1" />
          <rect x="82%" y="15%" width="7%" height="12%" fill="#e8e6e3" rx="1" />
          <rect x="3%" y="38%" width="8%" height="15%" fill="#e8e6e3" rx="1" />
          <rect x="15%" y="42%" width="9%" height="10%" fill="#e8e6e3" rx="1" />
          <rect x="30%" y="38%" width="12%" height="16%" fill="#e8e6e3" rx="1" />
          <rect x="50%" y="62%" width="8%" height="5%" fill="#e8e6e3" rx="1" />
          <rect x="65%" y="58%" width="12%" height="8%" fill="#e8e6e3" rx="1" />
          <rect x="82%" y="55%" width="7%" height="10%" fill="#e8e6e3" rx="1" />
          <rect x="3%" y="72%" width="8%" height="12%" fill="#e8e6e3" rx="1" />
          <rect x="15%" y="75%" width="9%" height="10%" fill="#e8e6e3" rx="1" />
          <rect x="30%" y="72%" width="12%" height="12%" fill="#e8e6e3" rx="1" />
          <rect x="50%" y="78%" width="8%" height="10%" fill="#e8e6e3" rx="1" />
          <rect x="65%" y="75%" width="12%" height="8%" fill="#e8e6e3" rx="1" />

          {/* Minor roads */}
          <line x1="0" y1="25%" x2="100%" y2="22%" stroke="#e2e0dd" strokeWidth="5" />
          <line x1="0" y1="44%" x2="100%" y2="46%" stroke="#e2e0dd" strokeWidth="5" />
          <line x1="0" y1="60%" x2="100%" y2="62%" stroke="#e2e0dd" strokeWidth="4" />
          <line x1="20%" y1="0" x2="22%" y2="100%" stroke="#e2e0dd" strokeWidth="5" />
          <line x1="36%" y1="0" x2="38%" y2="100%" stroke="#e2e0dd" strokeWidth="4" />
          <line x1="54%" y1="0" x2="55%" y2="100%" stroke="#e2e0dd" strokeWidth="5" />
          <line x1="70%" y1="0" x2="71%" y2="100%" stroke="#e2e0dd" strokeWidth="4" />
          <line x1="88%" y1="0" x2="87%" y2="100%" stroke="#e2e0dd" strokeWidth="5" />
        </svg>

        {/* Pin marker centered */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full z-10">
          <div className="relative flex flex-col items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-full flex items-center justify-center shadow-lg">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                  fill="white"
                />
              </svg>
            </div>
            {/* Pin tail */}
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-black -mt-[1px]" />
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-14 md:py-20">
        <Container className="max-w-[800px] mx-auto">
          <h2 className="text-[28px] md:text-[36px] font-semibold text-black mb-10 md:mb-12 tracking-tight">
            Get in touch
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First name + Last name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="firstName"
                  className="text-[13px] font-medium text-gray-700"
                >
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="h-12 w-full border border-gray-200 rounded-none px-4 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-black transition-colors duration-200 bg-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="lastName"
                  className="text-[13px] font-medium text-gray-700"
                >
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="h-12 w-full border border-gray-200 rounded-none px-4 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-black transition-colors duration-200 bg-white"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-[13px] font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Last name"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="h-12 w-full border border-gray-200 rounded-none px-4 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-black transition-colors duration-200 bg-white"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="message"
                className="text-[13px] font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                id="message"
                placeholder="Your message"
                rows={7}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full border border-gray-200 rounded-none px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-black transition-colors duration-200 bg-white resize-none"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full h-13 bg-black text-white text-[14px] font-medium tracking-wide py-4 hover:bg-gray-900 transition-colors duration-200"
            >
              Send message
            </button>
          </form>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="pb-20 md:pb-28">
        <Container className="max-w-[800px] mx-auto">
          <h2 className="text-[28px] md:text-[36px] font-semibold text-black mb-10 md:mb-12 tracking-tight">
            Frequently asked
          </h2>
          <div className="border-t border-gray-100">
            {faqs.map((faq, idx) => (
              <FaqAccordionItem
                key={idx}
                item={faq}
                isOpen={openIdx === idx}
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              />
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
