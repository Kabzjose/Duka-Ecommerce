import { Check } from 'lucide-react';
import type { BookingStatus } from '@/lib/types';

const STAGES: { key: BookingStatus; label: string }[] = [
  { key: 'PENDING', label: 'Order Placed' },
  { key: 'CONFIRMED', label: 'Rider Assigned' },
  { key: 'PICKED_UP', label: 'Picked Up' },
  { key: 'IN_TRANSIT', label: 'Out for Delivery' },
  { key: 'DELIVERED', label: 'Delivered' },
];

export function OrderTracker({ currentStatus }: { currentStatus: BookingStatus }) {
  const currentIndex = STAGES.findIndex((s) => s.key === currentStatus);

  if (currentStatus === 'CANCELLED') {
    return <p className="text-sm text-danger">This delivery was cancelled.</p>;
  }

  return (
    <div className="flex flex-col">
      {STAGES.map((stage, i) => {
        const done = i <= currentIndex;
        const isLast = i === STAGES.length - 1;
        return (
          <div key={stage.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-brand text-white' : 'border border-border text-muted'}`}>
                {done ? <Check className="h-3.5 w-3.5" /> : <span className="h-1.5 w-1.5 rounded-full bg-border" />}
              </div>
              {!isLast && <div className={`w-px flex-1 min-h-6 ${i < currentIndex ? 'bg-brand' : 'bg-border'}`} />}
            </div>
            <p className={`text-sm pb-6 ${done ? 'font-medium' : 'text-muted'}`}>{stage.label}</p>
          </div>
        );
      })}
    </div>
  );
}
