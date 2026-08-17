import { Check, AlertTriangle } from 'lucide-react';
import type { BookingStatus } from '@/lib/types';

const STAGES: { key: BookingStatus; label: string; desc: string }[] = [
  { key: 'PENDING', label: 'Order Placed', desc: 'Order received & confirmed' },
  { key: 'CONFIRMED', label: 'Rider Assigned', desc: 'Rider assigned to order' },
  { key: 'PICKED_UP', label: 'Package Picked Up', desc: 'Item picked up from hub' },
  { key: 'IN_TRANSIT', label: 'Out for Delivery', desc: 'Rider is on the way' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Successfully handed over' },
];

export function OrderTracker({ currentStatus }: { currentStatus: BookingStatus }) {
  const currentIndex = STAGES.findIndex((s) => s.key === currentStatus);

  if (currentStatus === 'CANCELLED') {
    return (
      <div className="p-4 rounded-xl bg-danger-light border border-danger/20 text-danger flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0" />
        <span className="text-sm font-semibold">This delivery was cancelled.</span>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle space-y-6">
      <h3 className="font-display text-base font-bold text-ink border-b border-border-subtle pb-3">
        Live Delivery Status
      </h3>

      <div className="flex flex-col space-y-0">
        {STAGES.map((stage, i) => {
          const done = i <= currentIndex;
          const isCurrent = i === currentIndex;
          const isLast = i === STAGES.length - 1;

          return (
            <div key={stage.key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    done
                      ? 'bg-brand text-white shadow-sm'
                      : 'border-2 border-border bg-bg text-muted'
                  } ${isCurrent ? 'ring-4 ring-brand/20' : ''}`}
                >
                  {done ? (
                    <Check className="h-4 w-4 stroke-[3]" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-muted/40" />
                  )}
                </div>
                {!isLast && (
                  <div
                    className={`w-0.5 my-1 flex-1 min-h-[32px] transition-colors ${
                      i < currentIndex ? 'bg-brand' : 'bg-border-subtle'
                    }`}
                  />
                )}
              </div>

              <div className="pb-6">
                <p
                  className={`text-sm font-bold leading-none ${
                    done ? 'text-ink' : 'text-muted/60'
                  } ${isCurrent ? 'text-brand' : ''}`}
                >
                  {stage.label}
                </p>
                <p className="text-xs text-muted mt-1 leading-snug">{stage.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
