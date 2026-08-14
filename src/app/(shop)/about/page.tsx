export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-2xl font-semibold mb-6">About Duka</h1>
      <div className="prose-sm text-sm text-muted flex flex-col gap-4 leading-relaxed">
        <p>Duka is an online store built to make shopping simple: browse real products, pay securely, and get your order delivered — all in one place.</p>
        <p>We started Duka to solve a common frustration: ordering something online in Kenya often means juggling separate apps for shopping and delivery. Duka combines both, so once you check out, your order is automatically handed to our delivery network and tracked from pickup to your door.</p>
        <p>Every order is paid for upfront through M-Pesa or card, so you can shop with confidence. We handle sourcing, packing, and delivery — you just place the order.</p>
      </div>
    </div>
  );
}
