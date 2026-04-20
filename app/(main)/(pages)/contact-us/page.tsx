"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Container } from "@/components/container";
import { toast } from "sonner";

const LeafletMap = dynamic(() => import("@/components/leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#f0efed] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
    </div>
  ),
});

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/send-contact-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Message sent! We'll get back to you soon.");
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
      } else {
        toast.error(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero / Title Section */}
      <section className="pt-16 pb-10 md:pt-20 md:pb-12 text-center">
        <Container>
          <h1 className="text-[40px] md:text-[56px] font-bold tracking-tight text-black leading-none mb-4">
            Contact us
          </h1>
          <p className="text-gray-500 text-[14px] md:text-[15px] leading-relaxed max-w-110 mx-auto">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui
            blanditiis voluptatum deleniti.
          </p>
        </Container>
      </section>

      {/* Map Section */}
      <section className="w-full h-70 sm:h-85 md:h-105 relative overflow-hidden z-0">
        <LeafletMap
          lat={8.652542}
          lng={76.927855}
          zoom={25}
          popupText="Our Location"
        />
      </section>

      {/* Contact Form Section */}
      <section className="py-14 md:py-20">
        <Container className="max-w-200 mx-auto">
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
                placeholder="your@email.com"
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
              disabled={isSubmitting}
              className="w-full h-13 bg-black text-white text-[14px] font-medium tracking-wide py-4 hover:bg-gray-900 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send message"}
            </button>
          </form>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="pb-20 md:pb-28">
        <Container className="max-w-200 mx-auto">
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
