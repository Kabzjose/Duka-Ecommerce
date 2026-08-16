'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Trash2, Plus } from 'lucide-react';
import { useFormValidation } from '@/hooks/useFormValidation';
import { addressSchema } from '@/lib/validation';

interface Address {
  id: string;
  label: string;
  address: string;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);

  const { values, errors, handleChange, handleBlur, validateForm, resetForm } = useFormValidation(
    addressSchema,
    { label: '', address: '' }
  );

  useEffect(() => {
    const stored = localStorage.getItem('duka_addresses');
    if (stored) setAddresses(JSON.parse(stored));
  }, []);

  function save(next: Address[]) {
    setAddresses(next);
    localStorage.setItem('duka_addresses', JSON.stringify(next));
  }

  function addAddress(e: React.FormEvent) {
    e.preventDefault();
    const { isValid, data } = validateForm();
    if (!isValid || !data) return;

    save([...addresses, { id: Math.random().toString(36).slice(2), label: data.label, address: data.address }]);
    resetForm();
    setShowForm(false);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Saved Addresses</h1>
        <Button size="sm" onClick={() => setShowForm((s) => !s)}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {showForm && (
        <form onSubmit={addAddress} className="border border-border rounded p-4 mb-6 flex flex-col gap-3" noValidate>
          <Input
            label="Label"
            placeholder="Home, Office..."
            required
            value={values.label}
            onChange={(e) => handleChange('label', e.target.value)}
            onBlur={() => handleBlur('label')}
            error={errors.label}
          />
          <Input
            label="Address"
            placeholder="Street, building, house number (min 5 characters)"
            required
            value={values.address}
            onChange={(e) => handleChange('address', e.target.value)}
            onBlur={() => handleBlur('address')}
            error={errors.address}
          />
          <Button type="submit" size="sm" className="w-fit">
            Save Address
          </Button>
        </form>
      )}

      {addresses.length === 0 ? (
        <p className="text-sm text-muted">No saved addresses yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {addresses.map((a) => (
            <div key={a.id} className="border border-border rounded p-4 flex justify-between items-start">
              <div>
                <p className="text-sm font-medium">{a.label}</p>
                <p className="text-sm text-muted">{a.address}</p>
              </div>
              <button
                onClick={() => save(addresses.filter((x) => x.id !== a.id))}
                className="text-muted hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
