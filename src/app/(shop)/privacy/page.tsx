export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-2xl font-semibold mb-6">Privacy Policy</h1>
      <div className="text-sm text-muted flex flex-col gap-4 leading-relaxed">
        <p>Last updated: {new Date().toLocaleDateString('en-KE', { dateStyle: 'long' })}</p>
        <p>We collect the information you provide when creating an account and placing orders — your name, email, phone number, and delivery address — solely to process and deliver your orders.</p>
        <p>Payment details are handled directly by our payment processors (Safaricom M-Pesa and Paystack) — we never store your card or M-Pesa PIN.</p>
        <p>We do not sell your personal information to third parties.</p>
      </div>
    </div>
  );
}
