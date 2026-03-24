'use client';

import React, { useTransition } from 'react';
import { deleteAddress, setDefaultAddress } from '@/lib/shopify/customer';
import { useRouter } from 'next/navigation';
import type { ShopifyAddress } from '@/lib/shopify/types';

interface AddressListProps {
  addresses: ShopifyAddress[];
  defaultAddressId: string | null;
  token: string;
}

export function AddressList({ addresses, defaultAddressId, token }: AddressListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = (addressId: string) => {
    startTransition(async () => {
      await deleteAddress(token, addressId);
      router.refresh();
    });
  };

  const handleSetDefault = (addressId: string) => {
    startTransition(async () => {
      await setDefaultAddress(token, addressId);
      router.refresh();
    });
  };

  if (addresses.length === 0) {
    return (
      <p className="text-[#6C7275]">No saved addresses yet.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {addresses.map((address) => {
        const isDefault = address.id === defaultAddressId;
        return (
          <div key={address.id} className="border border-[#E8ECEF] rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">
                  {address.firstName} {address.lastName}
                </h3>
                {isDefault && (
                  <span className="text-xs bg-[#141718] text-white px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </div>
            </div>
            <div className="text-[#141718] space-y-1 text-sm">
              {address.phone && <p>{address.phone}</p>}
              <p>{address.address1}</p>
              {address.address2 && <p>{address.address2}</p>}
              <p>{address.city}, {address.province} {address.zip}</p>
              <p>{address.country}</p>
            </div>
            <div className="flex gap-3 pt-2">
              {!isDefault && (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  disabled={isPending}
                  className="text-sm text-[#6C7275] hover:text-black transition-colors font-medium disabled:opacity-50"
                >
                  Set as default
                </button>
              )}
              <button
                onClick={() => handleDelete(address.id)}
                disabled={isPending}
                className="text-sm text-red-500 hover:text-red-700 transition-colors font-medium disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
