'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { adminApi } from '@/lib/admin';
import type { AdminOverview } from '@/lib/types';

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-border rounded p-5 bg-white/40">
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className="text-2xl font-mono font-semibold">{value}</p>
    </div>
  );
}

export default function AdminOverviewPage() {
  const { accessToken } = useAuth();
  const [stats, setStats] = useState<AdminOverview | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    adminApi.getOverview(accessToken).then(setStats);
  }, [accessToken]);

  if (!stats) return <div className="p-8 text-muted">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-semibold mb-6">Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Bookings" value={stats.totalBookings} />
        <StatCard label="Total Revenue" value={`KES ${stats.totalRevenue.toLocaleString('en-KE')}`} />
        <StatCard label="Active Riders" value={stats.activeRiders} />
        <StatCard label="Today" value={stats.bookingsToday} />
        <StatCard label="This Week" value={stats.bookingsThisWeek} />
        <StatCard label="Delivered" value={stats.deliveredCount} />
        <StatCard label="Cancelled" value={stats.cancelledCount} />
      </div>

      <div className="border border-border rounded p-5 bg-white/40">
        <h2 className="text-sm font-medium mb-4">Bookings by Status</h2>
        <div className="flex flex-col gap-2">
          {stats.bookingsByStatus.map((s) => (
            <div key={s.status} className="flex justify-between text-sm">
              <span className="text-muted">{s.status}</span>
              <span className="font-mono">{s.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
