"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Container } from "@/components/container";

interface FaqItem {
  question: string;
  answer: string;
}

const shoppingFaqs: FaqItem[] = [
  {
    question: "How does Nayzak work?",
    answer: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum fuga."
  },
  {
    question: "Which payment methods are accepted?",
    answer: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum fuga."
  },
  {
    question: "How to get familiar with Figma?",
    answer: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum fuga."
  },
  {
    question: "Can I get a refund?",
    answer: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum fuga."
  }
];

const paymentFaqs: FaqItem[] = [
  {
    question: "How does Nayzak work?",
    answer: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum fuga."
  },
  {
    question: "Which payment methods are accepted?",
    answer: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum fuga."
  },
  {
    question: "How to get familiar with Figma?",
    answer: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum fuga."
  },
  {
    question: "Can I get a refund?",
    answer: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum fuga."
  }
];

const FaqAccordionItem = ({ item, isOpen, onClick }: { item: FaqItem; isOpen: boolean; onClick: () => void }) => {
  return (
    <div className="border-b border-gray-100 py-8">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between text-left group"
      >
        <span className={`text-[18px] md:text-[20px] font-medium leading-tight transition-colors duration-200 ${isOpen ? 'text-black' : 'text-gray-900'}`}>
          {item.question}
        </span>
        <div className="flex-shrink-0 ml-4">
          <motion.div
            animate={{ rotate: isOpen ? 0 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? (
              <Minus className="h-6 w-6 text-black stroke-[1.5px]" />
            ) : (
              <Plus className="h-6 w-6 text-black stroke-[1.5px]" />
            )}
          </motion.div>
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
            <div className="pt-6 pb-2">
              <p className="text-gray-500 text-[15px] md:text-base leading-[1.6] max-w-[90%] font-normal">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FaqPage() {
  const [openShoppingIdx, setOpenShoppingIdx] = useState<number | null>(0);
  const [openPaymentIdx, setOpenPaymentIdx] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Header Section */}
      <section className="relative w-full aspect-[21/9] min-h-[400px] flex items-center justify-center text-center overflow-hidden">
        <Image
          src="/images/bg.png"
          alt="Background"
          fill
          priority
          className="object-cover"
        />
        <Container className="relative z-10 py-12">
          <nav className="mb-4 flex items-center justify-center space-x-2 text-[13px] font-medium text-gray-500 uppercase tracking-widest">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span className="text-gray-300">
              <ChevronRight className="h-3 w-3" />
            </span>
            <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
          </nav>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-black mb-8 font-serif italic">
            FAQ
          </h1>
          <p className="mx-auto max-w-[600px] text-[15px] md:text-base text-gray-500 leading-relaxed font-normal">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui
            blanditiis voluptatum deleniti.
          </p>
        </Container>
      </section>

      {/* FAQ Content Section */}
      <section className="pt-24 md:pt-32">
        <Container className="max-w-[800px] mx-auto px-4">
          {/* Shopping Section */}
          <div className="mb-24">
            <h2 className="text-[32px] md:text-[40px] font-medium mb-12 text-black leading-tight tracking-tight">Shopping</h2>
            <div className="border-t border-gray-100">
              {shoppingFaqs.map((faq, idx) => (
                <FaqAccordionItem
                  key={`shopping-${idx}`}
                  item={faq}
                  isOpen={openShoppingIdx === idx}
                  onClick={() => setOpenShoppingIdx(openShoppingIdx === idx ? null : idx)}
                />
              ))}
            </div>
          </div>

          {/* Payment Section */}
          <div>
            <h2 className="text-[32px] md:text-[40px] font-medium mb-12 text-black leading-tight tracking-tight">Payment</h2>
            <div className="border-t border-gray-100">
              {paymentFaqs.map((faq, idx) => (
                <FaqAccordionItem
                  key={`payment-${idx}`}
                  item={faq}
                  isOpen={openPaymentIdx === idx}
                  onClick={() => setOpenPaymentIdx(openPaymentIdx === idx ? null : idx)}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
