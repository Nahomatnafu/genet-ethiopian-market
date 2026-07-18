// Tibeb diamond monogram: a serif "G" set in a double-diamond frame with
// corner and edge beads, echoing the woven tibeb borders on habesha dresses.
// Inherits color via currentColor (gold in the nav/footer). A standalone copy
// of this mark lives in app/icon.svg for the favicon.
export default function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      {/* Outer and inner diamond frame */}
      <path d="M24 4 L44 24 L24 44 L4 24 Z" strokeWidth="1.5" />
      <path d="M24 10 L38 24 L24 38 L10 24 Z" strokeWidth="0.9" />

      {/* Corner beads */}
      <path d="M24 1.5 l2.5 2.5 -2.5 2.5 -2.5 -2.5 Z" fill="currentColor" stroke="none" />
      <path d="M46.5 24 l-2.5 2.5 -2.5 -2.5 2.5 -2.5 Z" fill="currentColor" stroke="none" />
      <path d="M24 46.5 l-2.5 -2.5 2.5 -2.5 2.5 2.5 Z" fill="currentColor" stroke="none" />
      <path d="M1.5 24 l2.5 -2.5 2.5 2.5 -2.5 2.5 Z" fill="currentColor" stroke="none" />

      {/* Edge beads at the midpoints of the outer diamond */}
      <path d="M14 12.4 l1.6 1.6 -1.6 1.6 -1.6 -1.6 Z" fill="currentColor" stroke="none" />
      <path d="M34 12.4 l1.6 1.6 -1.6 1.6 -1.6 -1.6 Z" fill="currentColor" stroke="none" />
      <path d="M34 32.4 l1.6 1.6 -1.6 1.6 -1.6 -1.6 Z" fill="currentColor" stroke="none" />
      <path d="M14 32.4 l1.6 1.6 -1.6 1.6 -1.6 -1.6 Z" fill="currentColor" stroke="none" />

      {/* Serif monogram */}
      <text
        x="24"
        y="24.5"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="15"
        style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
        fill="currentColor"
        stroke="none"
      >
        G
      </text>
    </svg>
  );
}
