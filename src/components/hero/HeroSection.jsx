// components/sections/HeroSection.jsx
import Link from 'next/link';

/**
 * ─────────────────────────────────────────────────────────────
 * HERO SECTION — OB MOTORS
 * ─────────────────────────────────────────────────────────────
 * Self-contained. Zero config edits. Zero client JS.
 *
 * RESPONSIVE HEIGHT:
 *   Mobile    33.33vh   (min 280, max 460)
 *   md:       55vh      (min 420, max 620)
 *   lg:       65vh      (min 500, max 720)
 *   xl:       70vh      (min 540, max 780)
 *
 * ANIMATION TIMELINE (cinematic reveal):
 *   0ms     video fade-in begins
 *   400ms   text fade-up begins
 *   1200ms  video fully visible
 *   1600ms  text fully visible
 *
 * DESIGN TOKENS (inlined):
 *   bg      #0A0A0B     accent   #E11D2E
 *   line    #26262A     accent-h #C4172A
 *   radius  2px         text     #FFFFFF
 * ─────────────────────────────────────────────────────────────
 */

// Keyframes + reduced-motion + video fade-in.
// Kept inline so this file remains fully self-contained.
const heroStyles = `
  @keyframes obVideoIn {
    0%   { opacity: 0; }
    100% { opacity: 1; }
  }
  @keyframes obTextIn {
    0%   { opacity: 0; transform: translateY(16px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  .ob-hero-video {
    animation: obVideoIn 1200ms cubic-bezier(.4,0,.2,1) forwards;
  }
  .ob-hero-content {
    opacity: 0;
    animation: obTextIn 1000ms cubic-bezier(.2,.7,.2,1) 400ms forwards;
  }

  @media (prefers-reduced-motion: reduce) {
    .ob-hero-video { display: none; }
    .ob-hero-content { opacity: 1; animation: none; }
  }
`;

export default function HeroSection() {
  return (
    <>
      <style>{heroStyles}</style>

      <section
        aria-label="OB Motors introduction"
        className="
          relative isolate w-full overflow-hidden
          bg-[#0A0A0B]

          /* ── Mobile: 1/3 screen ── */
          h-[33.33vh] min-h-[280px] max-h-[460px]

          /* ── Tablet ── */
          md:h-[55vh] md:min-h-[420px] md:max-h-[620px]

          /* ── Laptop ── */
          lg:h-[65vh] lg:min-h-[500px] lg:max-h-[720px]

          /* ── Large desktop ── */
          xl:h-[70vh] xl:min-h-[540px] xl:max-h-[780px]
        "
      >
        {/* ── LAYER 1: Background video (smooth fade-in) ──────── */}
        <video
          className="
            ob-hero-video
            absolute inset-0 h-full w-full object-cover
          "
          src="/assets/bg_video.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/assets/hero-poster.jpg"
          aria-hidden="true"
        />

        {/* ── LAYER 2: Dark scrim (video কে text এর জন্য dim করে) ── */}
        <div
          aria-hidden="true"
          className="
            absolute inset-0
            bg-gradient-to-b
            from-black/60 via-black/50 to-black/75
          "
        />

        {/* ── LAYER 3: Content — সব CENTER ──────────────────── */}
        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="ob-hero-content flex flex-col items-center text-center">

              {/* Tagline */}
              <p
                className="
                  mb-2 sm:mb-3 lg:mb-4
                  text-[0.7rem] sm:text-[0.75rem] lg:text-[0.8rem]
                  font-medium uppercase
                  tracking-[0.35em] sm:tracking-[0.4em]
                  text-white/75
                "
              >
                Premium Car Distributor &amp; Importer
              </p>

              {/* Brand wordmark */}
              <h1
                className="
                  font-extrabold leading-[0.95] tracking-[-0.04em]
                  text-white
                  text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[6rem]
                "
              >
                OB&nbsp;MOTORS
              </h1>

              {/* Accent hairline — centered */}
              <span
                aria-hidden="true"
                className="
                  mt-3 sm:mt-4 lg:mt-5
                  block h-px w-16 sm:w-20
                  bg-[#E11D2E]
                "
              />

              {/* CTAs — centered */}
              <div className="mt-4 sm:mt-6 lg:mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  href="/inventory"
                  className="
                    inline-flex h-10 items-center justify-center
                    rounded-[2px]
                    bg-[#E11D2E] px-5
                    text-[0.875rem] font-semibold tracking-[0.02em] text-white
                    transition-colors duration-200
                    hover:bg-[#C4172A]
                    focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-white/70
                  "
                >
                  Browse Inventory
                </Link>

                <Link
                  href="/contact"
                  className="
                    inline-flex h-10 items-center justify-center
                    rounded-[2px]
                    border border-white/30 px-5
                    text-[0.875rem] font-semibold tracking-[0.02em] text-white
                    transition-colors duration-200
                    hover:border-white/60 hover:bg-white/5
                    focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-white/70
                  "
                >
                  Contact Sales
                </Link>
              </div>

            </div>
          </div>
        </div>

        {/* ── Bottom hairline ───────────────────────────────── */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-[#26262A]/60"
        />
      </section>
    </>
  );
}