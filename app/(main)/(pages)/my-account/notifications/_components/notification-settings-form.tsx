'use client';

import { useState } from 'react';
import { NotificationPreference, NotificationType } from '@/lib/notifications/types';
import { updateCustomerPreferences } from '@/lib/notifications/preferences';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface GroupItem {
  type: NotificationType;
  label: string;
  description: string;
}

interface Group {
  title: string;
  items: GroupItem[];
}

interface NotificationSettingsFormProps {
  customerId: string;
  initialPreferences: NotificationPreference[];
  groups: Group[];
  translations: {
    save: string;
    saving: string;
    success: string;
    error: string;
  };
}

export function NotificationSettingsForm({
  customerId,
  initialPreferences,
  groups,
  translations,
}: NotificationSettingsFormProps) {
  const [preferences, setPreferences] = useState<NotificationPreference[]>(initialPreferences);
  const [isSaving, setIsSaving] = useState(false);

  const togglePreference = (type: NotificationType) => {
    setPreferences((prev) =>
      prev.map((p) => (p.type === type ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await updateCustomerPreferences(customerId, { preferences });
      if (success) {
        toast.success(translations.success);
      } else {
        toast.error(translations.error);
      }
    } catch (error) {
      toast.error('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <div key={group.title} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-bottom border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{group.title}</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {group.items.map((item) => {
              const pref = preferences.find((p) => p.type === item.type);
              const isEnabled = pref ? pref.enabled : true;

              return (
                <div key={item.type} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <h3 className="text-sm font-medium text-gray-900">{item.label}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <button
                    onClick={() => togglePreference(item.type)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                      isEnabled ? 'bg-black' : 'bg-gray-200'
                    }`}
                    role="switch"
                    aria-checked={isEnabled}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex justify-end pt-6">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? translations.saving : translations.save}
        </Button>
      </div>
    </div>
  );
}
