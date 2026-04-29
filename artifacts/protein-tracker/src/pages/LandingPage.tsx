import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Activity,
  Search,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Zap,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const features = [
  {
    icon: Search,
    title: "Search millions of foods",
    description:
      "Instantly find nutritional data from the OpenFoodFacts database. From branded products to whole foods — it's all there.",
  },
  {
    icon: Target,
    title: "Hit your daily goal",
    description:
      "Set your personal protein target and watch the progress ring fill up as you log each meal throughout the day.",
  },
  {
    icon: BarChart3,
    title: "Weekly insights",
    description:
      "See how consistent you've been over the past 7 days with a clear bar chart that shows the days you nailed it.",
  },
];

const bullets = [
  "No subscriptions, no paywalls",
  "Private — your data stays yours",
  "Works on any device",
  "Free food database, no API key needed",
];

function ProgressRingDemo() {
  const pct = 68;
  const r = 44;
  const circ = 2 * Math.PI * r;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-56 h-56 flex items-center justify-center"
      role="img"
      aria-label="Progress ring showing 102g of 150g protein goal, 68% complete"
    >
      <svg
        className="w-full h-full -rotate-90"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <circle
          stroke="hsl(160 20% 90%)"
          strokeWidth="7"
          cx="50"
          cy="50"
          r={r}
          fill="transparent"
        />
        <motion.circle
          stroke="hsl(160 70% 30%)"
          strokeWidth="7"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r={r}
          fill="transparent"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - pct / 100) }}
          transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center" aria-hidden="true">
        <span className="text-4xl font-bold" style={{ color: "hsl(160 30% 15%)" }}>
          102g
        </span>
        <span className="text-sm mt-1" style={{ color: "hsl(160 20% 45%)" }}>
          of 150g goal
        </span>
        <span
          className="mt-2 text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: "hsl(160 70% 30% / 0.12)",
            color: "hsl(160 70% 28%)",
          }}
        >
          {pct}% complete
        </span>
      </div>
    </motion.div>
  );
}

function MockFoodEntry({
  name,
  brand,
  protein,
  delay,
}: {
  name: string;
  brand: string;
  protein: number;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-between px-4 py-3 rounded-xl border"
      style={{
        background: "hsl(0 0% 100%)",
        borderColor: "hsl(160 15% 90%)",
      }}
    >
      <div>
        <p className="text-sm font-semibold" style={{ color: "hsl(160 30% 15%)" }}>
          {name}
        </p>
        <p className="text-xs" style={{ color: "hsl(160 20% 45%)" }}>
          {brand}
        </p>
      </div>
      <span className="text-base font-bold" style={{ color: "hsl(160 70% 30%)" }}>
        +{protein}g
      </span>
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "hsl(160 20% 98%)", color: "hsl(160 30% 15%)" }}
    >
      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded focus:bg-white focus:text-sm focus:font-semibold focus:underline"
        style={{ color: "hsl(160 70% 28%)" }}
      >
        Skip to main content
      </a>

      {/* Nav */}
      <header role="banner">
        <nav
          className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto"
          aria-label="Main navigation"
        >
          <Link href="/" aria-label="ProTracker home">
            <span className="flex items-center gap-2">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "hsl(160 70% 30%)" }}
                aria-hidden="true"
              >
                <Activity className="w-4 h-4 text-white" aria-hidden="true" />
              </span>
              <span className="font-bold text-lg tracking-tight">ProTracker</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-sm font-medium"
                data-testid="link-nav-login"
                aria-label="Log in to your account"
              >
                Log in
              </Button>
            </Link>
            <Link href="/login">
              <Button
                className="text-sm font-medium"
                style={{
                  background: "hsl(160 70% 30%)",
                  color: "white",
                }}
                data-testid="link-nav-signup"
                aria-label="Create a free account"
              >
                Get started free
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main */}
      <main id="main-content">
        {/* Hero */}
        <section
          aria-labelledby="hero-heading"
          className="max-w-5xl mx-auto px-6 pt-16 pb-24 flex flex-col lg:flex-row items-center gap-14"
        >
          {/* Left copy */}
          <div className="flex-1 space-y-7 text-center lg:text-left">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{
                background: "hsl(160 70% 30% / 0.10)",
                color: "hsl(160 70% 28%)",
              }}
            >
              <Zap className="w-3.5 h-3.5" aria-hidden="true" />
              Free forever. No account required to browse.
            </motion.div>

            <motion.h1
              id="hero-heading"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
            >
              Hit your protein
              <br />
              <span style={{ color: "hsl(160 70% 30%)" }}>goal every day.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="text-lg leading-relaxed max-w-lg mx-auto lg:mx-0"
              style={{ color: "hsl(160 20% 40%)" }}
            >
              ProTracker is a clean, focused tool for tracking your daily protein
              intake. Search millions of foods, log in seconds, and see your
              weekly progress at a glance.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start"
            >
              <Link href="/login">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base font-semibold shadow-lg"
                  style={{ background: "hsl(160 70% 30%)", color: "white" }}
                  data-testid="button-hero-signup"
                  aria-label="Start tracking protein for free — create an account"
                >
                  Start tracking for free
                  <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-base font-semibold"
                  data-testid="button-hero-login"
                  aria-label="Log in to your existing account"
                >
                  Already have an account
                </Button>
              </Link>
            </motion.div>

            <motion.ul
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={4}
              className="space-y-2 text-sm pt-2"
              style={{ color: "hsl(160 20% 40%)" }}
              aria-label="Key benefits"
            >
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle2
                    className="w-4 h-4 shrink-0"
                    style={{ color: "hsl(160 70% 30%)" }}
                    aria-hidden="true"
                  />
                  {b}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Right visual — decorative mockup */}
          <div
            className="flex-1 flex justify-center lg:justify-end"
            aria-hidden="true"
          >
            <div
              className="w-full max-w-xs rounded-3xl shadow-2xl p-6 space-y-5 border"
              style={{
                background: "hsl(0 0% 100%)",
                borderColor: "hsl(160 15% 90%)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-base">Today</p>
                  <p className="text-xs" style={{ color: "hsl(160 20% 45%)" }}>
                    Wednesday, April 29
                  </p>
                </div>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "hsl(160 70% 30%)" }}
                >
                  <Activity className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
              </div>

              <div className="flex justify-center">
                <ProgressRingDemo />
              </div>

              <div className="space-y-2">
                <p
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "hsl(160 20% 50%)" }}
                >
                  Logged today
                </p>
                <MockFoodEntry name="Greek Yoghurt" brand="Fage 0%" protein={17} delay={0.9} />
                <MockFoodEntry name="Chicken Breast" brand="Generic" protein={53} delay={1.0} />
                <MockFoodEntry name="Whey Protein" brand="Optimum Nutrition" protein={25} delay={1.1} />
                <MockFoodEntry name="Cottage Cheese" brand="Longley Farm" protein={14} delay={1.2} />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          aria-labelledby="features-heading"
          className="py-20 px-6"
          style={{ background: "hsl(160 20% 96%)" }}
        >
          <div className="max-w-5xl mx-auto space-y-12">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center space-y-3"
            >
              <h2
                id="features-heading"
                className="text-3xl lg:text-4xl font-bold tracking-tight"
              >
                Everything you need, nothing you don't
              </h2>
              <p
                className="text-base max-w-xl mx-auto"
                style={{ color: "hsl(160 20% 40%)" }}
              >
                Built for people who want a simple, honest way to stay on top of
                their protein — without the bloat of a full macro-tracking app.
              </p>
            </motion.div>

            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 list-none p-0">
              {features.map((f, i) => (
                <motion.li
                  key={f.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={i}
                  className="rounded-2xl p-6 border space-y-4"
                  style={{
                    background: "hsl(0 0% 100%)",
                    borderColor: "hsl(160 15% 90%)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "hsl(160 70% 30% / 0.10)" }}
                    aria-hidden="true"
                  >
                    <f.icon
                      className="w-5 h-5"
                      style={{ color: "hsl(160 70% 30%)" }}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="font-semibold text-base">{f.title}</h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "hsl(160 20% 42%)" }}
                  >
                    {f.description}
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section aria-labelledby="cta-heading" className="py-24 px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="max-w-2xl mx-auto rounded-3xl p-10 text-center space-y-6 text-white"
            style={{ background: "hsl(160 70% 28%)" }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto"
              style={{ background: "hsl(160 70% 38%)" }}
              aria-hidden="true"
            >
              <Activity className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <h2
              id="cta-heading"
              className="text-3xl font-bold tracking-tight"
            >
              Ready to start hitting your goals?
            </h2>
            <p className="text-base opacity-80 max-w-md mx-auto">
              Sign up in seconds. No credit card. No limits on how many foods you
              can log.
            </p>
            <Link href="/login">
              <Button
                size="lg"
                className="text-base font-semibold mt-2"
                style={{ background: "white", color: "hsl(160 70% 28%)" }}
                data-testid="button-cta-signup"
                aria-label="Create your free ProTracker account"
              >
                Create your free account
                <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer
        role="contentinfo"
        className="py-8 px-6 text-center text-sm border-t"
        style={{
          borderColor: "hsl(160 15% 90%)",
          color: "hsl(160 20% 50%)",
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <span
            className="w-5 h-5 rounded flex items-center justify-center"
            style={{ background: "hsl(160 70% 30%)" }}
            aria-hidden="true"
          >
            <Activity className="w-3 h-3 text-white" aria-hidden="true" />
          </span>
          <span className="font-semibold" style={{ color: "hsl(160 30% 20%)" }}>
            ProTracker
          </span>
        </div>
        <p>
          Created by <strong>Allison Krier</strong>. Food data from{" "}
          <a
            href="https://world.openfoodfacts.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "hsl(160 70% 28%)", textDecoration: "underline" }}
            aria-label="OpenFoodFacts — opens in a new tab"
          >
            OpenFoodFacts
          </a>
          . Free and open source.
        </p>
      </footer>
    </div>
  );
}
