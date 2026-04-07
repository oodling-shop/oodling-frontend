'use client';

import { useState } from 'react';

interface AskQuestionFormProps {
  onClose: () => void;   // called on Cancel — parent sets showForm = false
  onSuccess: () => void; // called on successful submission — parent sets submitted = true, showForm = false
  productId?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  question?: string;
}

export function AskQuestionForm({ onClose, onSuccess, productId }: AskQuestionFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim()) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'Enter a valid email address';
    }
    if (!question.trim()) e.question = 'Question is required';
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
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, name, email, question }),
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
      <div>
        <label htmlFor="question-name" className="block text-sm font-medium text-[#141718] mb-1">
          Name
        </label>
        <input
          id="question-name"
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); clearError('name'); }}
          className="w-full border border-[#E8ECEF] px-3 py-2 text-sm text-[#141718] outline-none focus:border-[#141718] transition-colors"
        />
        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="question-email" className="block text-sm font-medium text-[#141718] mb-1">
          Email
        </label>
        <input
          id="question-email"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
          className="w-full border border-[#E8ECEF] px-3 py-2 text-sm text-[#141718] outline-none focus:border-[#141718] transition-colors"
        />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="question-text" className="block text-sm font-medium text-[#141718] mb-1">
          Question
        </label>
        <textarea
          id="question-text"
          rows={4}
          value={question}
          onChange={(e) => { setQuestion(e.target.value); clearError('question'); }}
          className="w-full border border-[#E8ECEF] px-3 py-2 text-sm text-[#141718] outline-none focus:border-[#141718] transition-colors resize-none"
        />
        {errors.question && <p className="text-sm text-red-600 mt-1">{errors.question}</p>}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-[#141718] text-white px-8 py-3 text-sm font-medium hover:bg-[#343839] transition-colors disabled:opacity-50"
        >
          {submitting ? 'Submitting…' : 'Submit question'}
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
