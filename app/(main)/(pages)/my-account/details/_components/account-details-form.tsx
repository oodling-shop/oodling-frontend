'use client';

import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateCustomer } from '@/lib/shopify/customer';
import { useRouter } from 'next/navigation';

interface AccountDetailsFormProps {
  token: string;
  defaultValues: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export function AccountDetailsForm({ token, defaultValues }: AccountDetailsFormProps) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const fd = new FormData(e.currentTarget);
    const input: Record<string, string> = {};

    const firstName = fd.get('firstName') as string;
    const lastName = fd.get('lastName') as string;
    const email = fd.get('email') as string;
    const newPassword = fd.get('newPassword') as string;

    if (firstName) input.firstName = firstName;
    if (lastName) input.lastName = lastName;
    if (email) input.email = email;
    if (newPassword) input.password = newPassword;

    startTransition(async () => {
      const result = await updateCustomer(token, input);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        router.refresh();
      }
    });
  };

  return (
    <div className="max-w-[720px]">
      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{error}</p>}
      {success && <p className="mb-4 text-sm text-green-600 bg-green-50 px-4 py-3 rounded-lg">Changes saved successfully.</p>}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-base font-semibold text-[#141718]">First name *</label>
            <Input name="firstName" placeholder="First name" defaultValue={defaultValues.firstName}
              className="h-12 border-[#E8ECEF] bg-white text-[#141718] placeholder:text-[#6C7275] focus-visible:ring-black/5 rounded-[6px] px-4" />
          </div>
          <div className="space-y-2">
            <label className="text-base font-semibold text-[#141718]">Last name *</label>
            <Input name="lastName" placeholder="Last name" defaultValue={defaultValues.lastName}
              className="h-12 border-[#E8ECEF] bg-white text-[#141718] placeholder:text-[#6C7275] focus-visible:ring-black/5 rounded-[6px] px-4" />
          </div>
          <div className="space-y-2">
            <label className="text-base font-semibold text-[#141718]">Email address *</label>
            <Input name="email" type="email" placeholder="Email address" defaultValue={defaultValues.email}
              className="h-12 border-[#E8ECEF] bg-white text-[#141718] placeholder:text-[#6C7275] focus-visible:ring-black/5 rounded-[6px] px-4" />
          </div>
        </div>

        <div className="pt-10 space-y-6">
          <h3 className="text-xl font-semibold text-[#141718]">Password change</h3>
          <div className="space-y-2">
            <label className="text-base font-semibold text-[#141718]">New password</label>
            <Input name="newPassword" placeholder="New password" type="password"
              className="h-12 border-[#E8ECEF] bg-white text-[#141718] placeholder:text-[#6C7275] focus-visible:ring-black/5 rounded-[6px] px-4" />
          </div>
          <div className="space-y-2">
            <label className="text-base font-semibold text-[#141718]">Repeat new password</label>
            <Input name="confirmPassword" placeholder="Repeat new password" type="password"
              className="h-12 border-[#E8ECEF] bg-white text-[#141718] placeholder:text-[#6C7275] focus-visible:ring-black/5 rounded-[6px] px-4" />
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-[#141718] text-white hover:bg-[#141718]/90 px-10 py-3 h-auto text-base font-semibold rounded-[6px] transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
