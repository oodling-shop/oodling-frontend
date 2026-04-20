'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronDown, ChevronUp, Star, CheckCircle } from 'lucide-react';
import { WriteReviewForm } from './write-review-form';
import { AskQuestionForm } from './ask-question-form';

interface Review {
  id: string;
  name: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
}

interface Answer {
  id: string;
  body: string;
  by: string;
  createdAt: string;
}

interface Question {
  id: string;
  question: string;
  name: string;
  createdAt: string;
  answers: Answer[];
}

interface ProductTabsProps {
  descriptionHtml: string;
  options?: { name: string; values: string[] }[];
  productId: string;
  reviewsData?: string; // JSON string of reviews from metafield
}

/**
 * Expands options where values are combined with " / " (e.g. "30cm / Red")
 * into separate option rows per segment, inferring names from patterns.
 */
function expandOptions(opts: { name: string; values: string[] }[]): { name: string; values: string[] }[] {
  const result: { name: string; values: string[] }[] = [];
  for (const opt of opts) {
    const allCombined = opt.values.length > 0 && opt.values.every((v) => v.includes(' / '));
    if (!allCombined) {
      result.push(opt);
      continue;
    }
    const parts = opt.values.map((v) => v.split(' / '));
    const numSegments = Math.max(...parts.map((p) => p.length));
    for (let i = 0; i < numSegments; i++) {
      const uniqueVals = [...new Set(parts.map((p) => p[i]).filter(Boolean))];
      // Last segment keeps the original option name; earlier segments get "Size" if numeric-like, else "Option N"
      const isLast = i === numSegments - 1;
      const looksLikeSize = uniqueVals.every((v) => /^\d/.test(v));
      const name = isLast ? opt.name : looksLikeSize ? 'Size' : `${opt.name} ${i + 1}`;
      result.push({ name, values: uniqueVals });
    }
  }
  return result;
}

const TABS = ['Description', 'Additional Info', 'Reviews', 'Questions'] as const;
type Tab = (typeof TABS)[number];

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={i <= rating ? 'fill-[#E8722A] text-[#E8722A]' : 'fill-[#E8ECEF] text-[#E8ECEF]'}
        />
      ))}
    </div>
  );
}

function QuestionItem({ q }: { q: Question }) {
  const [expanded, setExpanded] = useState(false);
  const firstAnswer = q.answers[0];
  const extraAnswers = q.answers.slice(1);
  const hasAnswers = q.answers.length > 0;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const answerBlock = (answer: Answer) => (
    <div key={answer.id} className="mb-2">
      <p className="text-sm text-[#141718] mb-1">{answer.body}</p>
      <p className="text-xs text-[#6C7275]">By {answer.by} on {formatDate(answer.createdAt)}</p>
    </div>
  );

  return (
    <div className="py-6">
      {/* Desktop: two-column label + content */}
      <div className="hidden lg:grid grid-cols-[100px_1fr] gap-y-3">
        <span className="text-sm text-[#6C7275] pt-0.5">Question</span>
        <div>
          <p className="text-sm font-bold text-[#141718] mb-1">{q.question}</p>
          <p className="text-xs text-[#6C7275]">By {q.name} on {formatDate(q.createdAt)}</p>
        </div>
        <span className="text-sm text-[#6C7275] pt-0.5">Answer</span>
        <div>
          {hasAnswers ? (
            <>
              {answerBlock(firstAnswer)}
              {expanded && extraAnswers.map((a) => answerBlock(a))}
              {extraAnswers.length > 0 && (
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="text-sm text-[#141718] underline underline-offset-2 hover:text-[#6C7275] transition-colors mt-1"
                >
                  {expanded ? 'Hide answers' : `See more answers (${extraAnswers.length})`}
                </button>
              )}
            </>
          ) : (
            <p className="text-sm text-[#6C7275] italic">No answers yet.</p>
          )}
        </div>
      </div>

      {/* Mobile: stacked */}
      <div className="lg:hidden space-y-1">
        <span className="text-sm text-[#6C7275]">Question</span>
        <p className="text-sm font-bold text-[#141718] mb-1">{q.question}</p>
        <p className="text-xs text-[#6C7275] mb-3">By {q.name} on {formatDate(q.createdAt)}</p>
        <span className="text-sm text-[#6C7275]">Answer</span>
        {hasAnswers ? (
          <>
            {answerBlock(firstAnswer)}
            {expanded && extraAnswers.map((a) => answerBlock(a))}
            {extraAnswers.length > 0 && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="text-sm text-[#141718] underline underline-offset-2 hover:text-[#6C7275] transition-colors"
              >
                {expanded ? 'Hide answers' : `See more answers (${extraAnswers.length})`}
              </button>
            )}
          </>
        ) : (
          <p className="text-sm text-[#6C7275] italic">No answers yet.</p>
        )}
      </div>
    </div>
  );
}

function QuestionsContent({ productId }: { productId: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchQuestions = useCallback(async () => {
    try {
      const res = await fetch(`/api/questions?productId=${encodeURIComponent(productId)}`);
      const data = await res.json();
      if (data.success) setQuestions(data.data as Question[]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return (
    <div>
      {/* Header */}
      <h2 className="text-2xl font-semibold text-[#141718] mb-4">Customers questions</h2>

      {/* Trigger button area — hidden when form is open */}
      {!showForm && !submitted && (
        <>
          {/* Count + button row */}
          <div className="flex items-center justify-between mb-6">
            {!loading && (
              <span className="text-sm text-[#6C7275]">
                {questions.length} {questions.length === 1 ? 'question' : 'questions'}
              </span>
            )}
            {/* Desktop button */}
            <button
              onClick={() => setShowForm(true)}
              className="hidden lg:block border border-[#141718] text-[#141718] text-sm font-medium px-5 py-2.5 hover:bg-[#141718] hover:text-white transition-colors"
            >
              Ask a question
            </button>
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setShowForm(true)}
            className="lg:hidden border border-[#141718] text-[#141718] text-sm font-medium px-5 py-2.5 mb-6 hover:bg-[#141718] hover:text-white transition-colors"
          >
            Ask question
          </button>
        </>
      )}

      {/* Inline form */}
      {showForm && (
        <AskQuestionForm
          productId={productId}
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); setSubmitted(true); fetchQuestions(); }}
        />
      )}

      {/* Success message */}
      {submitted && (
        <div className="flex items-center gap-2 text-sm font-medium text-[#141718] py-4">
          <CheckCircle width={16} height={16} />
          Thank you! Your question has been submitted.
        </div>
      )}

      {/* Empty state */}
      {!loading && questions.length === 0 && !showForm && (
        <p className="text-sm text-[#6C7275] mb-6">No questions yet. Be the first to ask!</p>
      )}

      {/* Question list */}
      {questions.length > 0 && (
        <div className="divide-y divide-[#E8ECEF]">
          {questions.map((q) => (
            <QuestionItem key={q.id} q={q} />
          ))}
        </div>
      )}

    </div>
  );
}

function ReviewsContent({ productId, reviewsData }: { productId: string; reviewsData?: string }) {
  const initialReviews = useMemo(() => {
    if (!reviewsData) return [];
    try {
      return JSON.parse(reviewsData) as Review[];
    } catch {
      return [];
    }
  }, [reviewsData]);

  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [loading, setLoading] = useState(!reviewsData);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data as Review[]);
      } else {
        console.error('Failed to fetch reviews:', data.error);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (reviewsData) {
      setLoading(false);
      return;
    }
    fetchReviews();
  }, [fetchReviews, reviewsData]);

  const hasReviews = reviews.length > 0;
  const avgRating = hasReviews
    ? Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
    : 0;

  return (
    <div>
      {/* Header */}
      <h2 className="text-2xl font-semibold text-[#141718] mb-4">Customer reviews</h2>

      {/* Trigger button area — hidden when form is open */}
      {!showForm && !submitted && (
        <>
          {hasReviews ? (
            <>
              {/* Overall rating row — has reviews */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <StarRating rating={avgRating} size={20} />
                  <span className="text-sm text-[#6C7275]">{reviews.length} total {reviews.length === 1 ? 'Review' : 'Reviews'}</span>
                </div>
                {/* Desktop button */}
                <button
                  onClick={() => setShowForm(true)}
                  className="hidden lg:block border border-[#141718] text-[#141718] text-sm font-medium px-5 py-2.5 hover:bg-[#141718] hover:text-white transition-colors"
                >
                  Write review
                </button>
              </div>
              {/* Mobile button */}
              <button
                onClick={() => setShowForm(true)}
                className="lg:hidden border border-[#141718] text-[#141718] text-sm font-medium px-5 py-2.5 mb-6 hover:bg-[#141718] hover:text-white transition-colors"
              >
                Write review
              </button>
            </>
          ) : (
            <>
              {/* Empty state rating row */}
              <div className="flex items-center justify-between mb-4">
                <StarRating rating={0} size={20} />
                <button
                  onClick={() => setShowForm(true)}
                  className="hidden lg:block border border-[#141718] text-[#141718] text-sm font-medium px-5 py-2.5 hover:bg-[#141718] hover:text-white transition-colors"
                >
                  Write review
                </button>
              </div>
              {!loading && <p className="text-sm text-[#6C7275] mb-6">There are no reviews yet.</p>}
              {/* Mobile button */}
              <button
                onClick={() => setShowForm(true)}
                className="lg:hidden border border-[#141718] text-[#141718] text-sm font-medium px-5 py-2.5 hover:bg-[#141718] hover:text-white transition-colors"
              >
                Write review
              </button>
            </>
          )}
        </>
      )}

      {/* Inline form */}
      {showForm && (
        <WriteReviewForm
          productId={productId}
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); setSubmitted(true); fetchReviews(); }}
        />
      )}

      {/* Success message */}
      {submitted && (
        <div className="flex items-center gap-2 text-sm font-medium text-[#141718] py-4">
          <CheckCircle width={16} height={16} />
          Thank you! Your review has been submitted.
        </div>
      )}

      {hasReviews && (
        <>
          {/* Review list */}
          <div className="divide-y divide-[#E8ECEF]">
            {reviews.map((review) => (
              <div key={review.id} className="py-6">
                {/* Reviewer info */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-[#E8ECEF] flex items-center justify-center shrink-0">
                    <span className="text-lg font-semibold text-[#6C7275]">
                      {review.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#141718]">{review.name}</span>
                      <span className="text-sm text-[#6C7275]">
                        {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <StarRating rating={review.rating} size={14} />
                  </div>
                </div>
                {/* Review title + body */}
                {review.title && <p className="text-sm font-semibold text-[#141718] mb-1">{review.title}</p>}
                <p className="text-sm text-[#6C7275] leading-relaxed">{review.body}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function ProductTabs({ descriptionHtml, options = [], productId, reviewsData }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Description');
  const [openAccordion, setOpenAccordion] = useState<Tab | null>(null);

  const tabContent = (tab: Tab) => {
    if (tab === 'Description') {
      return (
        <div
          className="text-[#6C7275] leading-relaxed [&_p]:mb-4 [&_h2]:font-bold [&_h2]:text-[#141718] [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2 [&_strong]:font-semibold [&_strong]:text-[#141718]"
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
      );
    }
    if (tab === 'Additional Info') {
      const displayOptions = expandOptions(
        (options ?? []).filter(
          (opt) => !(opt.name === 'Title' && opt.values.length === 1 && opt.values[0] === 'Default Title')
        )
      );
      if (displayOptions.length > 0) {
        return (
          <div className="space-y-6">
            {displayOptions.map((opt) => (
              <div key={opt.name}>
                {/* Desktop: two-column row */}
                <div className="hidden lg:grid grid-cols-[160px_1fr] items-start">
                  <span className="text-sm font-bold text-[#232D3F] uppercase">{opt.name}</span>
                  <span className="text-sm text-[#6C7275]">{opt.values.join(', ')}</span>
                </div>
                {/* Mobile: stacked */}
                <div className="lg:hidden">
                  <p className="text-sm font-bold text-[#232D3F] mb-1">{opt.name}</p>
                  <p className="text-sm text-[#6C7275]">{opt.values.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        );
      }
    }
    if (tab === 'Reviews') {
      return <ReviewsContent productId={productId} reviewsData={reviewsData} />;
    }
    if (tab === 'Questions') {
      return <QuestionsContent productId={productId} />;
    }
    return <p className="text-[#6C7275]">Coming soon.</p>;
  };

  return (
    <>
      {/* Mobile: Accordion */}
      <div className="lg:hidden border-t border-[#E8ECEF]">
        {TABS.map((tab) => (
          <div key={tab} className="border-b border-[#E8ECEF]">
            <button
              onClick={() => setOpenAccordion(openAccordion === tab ? null : tab)}
              className="flex items-center justify-between w-full py-5 text-left"
            >
              <span className="text-lg font-semibold text-[#141718]">{tab}</span>
              {openAccordion === tab ? (
                <ChevronUp className="w-5 h-5 text-[#141718]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#141718]" />
              )}
            </button>
            {openAccordion === tab && (
              <div className="pb-6">{tabContent(tab)}</div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop: Tabs */}
      <div className="hidden lg:block border-t border-[#E8ECEF]">
        <div className="flex gap-8 border-b border-[#E8ECEF]">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                'py-4 text-sm font-medium transition-colors whitespace-nowrap',
                activeTab === tab
                  ? 'text-[#141718] border-b-2 border-[#141718] -mb-px'
                  : 'text-[#6C7275]',
              ].join(' ')}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="py-8">{tabContent(activeTab)}</div>
      </div>
    </>
  );
}
