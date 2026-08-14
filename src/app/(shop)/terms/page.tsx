export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-2xl font-semibold mb-6">Terms & Conditions</h1>
      <div className="text-sm text-muted flex flex-col gap-4 leading-relaxed">
        <p>By using Duka, you agree to pay for orders at checkout and provide accurate delivery information.</p>
        <p>Duka reserves the right to cancel orders in cases of stock unavailability or payment failure.</p>
      </div>
    </div>
  );
}
