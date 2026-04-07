'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface WriteReviewFormProps {
  onClose: () => void;   // called on Cancel — parent sets showForm = false
  onSuccess: () => void; // called on successful submission — parent sets submitted = true, showForm = false
  productId?: string;
}

interface FormErrors {
  rating?: string;
  title?: string;
  name?: string;
  email?: string;
  body?: string;
}

function StarRatingInput({
  rating,
  onChange,
  error,
}: {
  rating: number;
  onChange: (n: number) => void;
  error?: string;
}) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || rating;

  return (
    <div>
      <label className="block text-sm font-medium text-[#141718] mb-1">
        Rating
      </label>
      <div
        role="radiogroup"
        aria-label="Rating"
        className="flex items-center gap-1"
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            aria-pressed={rating >= n}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none"
          >
            <Star
              width={20}
              height={20}
              className={
                n <= active
                  ? 'fill-[#E8722A] text-[#E8722A]'
                  : 'fill-[#E8ECEF] text-[#E8ECEF]'
              }
            />
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}

export function WriteReviewForm({ onClose, onSuccess, productId }: WriteReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (rating === 0) e.rating = 'Please select a rating';
    if (!title.trim()) e.title = 'Title is required';
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim()) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'Enter a valid email address';
    }
    if (!body.trim()) e.body = 'Review is required';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, title, name, email, body }),
      });
      if (!res.ok) throw new Error('Submission failed. Please try again.');
      onSuccess();
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  function clearError(field: keyof FormErrors) {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="border-t border-[#E8ECEF] pt-6 mt-2 space-y-4">
      <StarRatingInput
        rating={rating}
        onChange={(n) => { setRating(n); clearError('rating'); }}
        error={errors.rating}
      />

      <div>
        <label htmlFor="review-title" className="block text-sm font-medium text-[#141718] mb-1">
          Title
        </label>
        <input
          id="review-title"
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); clearError('title'); }}
          className="w-full border border-[#E8ECEF] px-3 py-2 text-sm text-[#141718] outline-none focus:border-[#141718] transition-colors"
        />
        {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="review-name" className="block text-sm font-medium text-[#141718] mb-1">
          Name
        </label>
        <input
          id="review-name"
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); clearError('name'); }}
          className="w-full border border-[#E8ECEF] px-3 py-2 text-sm text-[#141718] outline-none focus:border-[#141718] transition-colors"
        />
        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="review-email" className="block text-sm font-medium text-[#141718] mb-1">
          Email
        </label>
        <input
          id="review-email"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
          className="w-full border border-[#E8ECEF] px-3 py-2 text-sm text-[#141718] outline-none focus:border-[#141718] transition-colors"
        />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="review-body" className="block text-sm font-medium text-[#141718] mb-1">
          Review
        </label>
        <textarea
          id="review-body"
          rows={4}
          value={body}
          onChange={(e) => { setBody(e.target.value); clearError('body'); }}
          className="w-full border border-[#E8ECEF] px-3 py-2 text-sm text-[#141718] outline-none focus:border-[#141718] transition-colors resize-none"
        />
        {errors.body && <p className="text-sm text-red-600 mt-1">{errors.body}</p>}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-[#141718] text-white px-8 py-3 text-sm font-medium hover:bg-[#343839] transition-colors disabled:opacity-50"
        >
          {submitting ? 'Submitting…' : 'Submit review'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="border border-[#141718] text-[#141718] px-5 py-2.5 text-sm font-medium hover:bg-[#141718] hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>

      {apiError && <p className="text-sm text-red-600 mt-2">{apiError}</p>}
    </form>
  );
}
