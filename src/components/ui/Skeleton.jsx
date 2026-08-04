/**
 * Reusable Skeleton loading component
 */
export default function Skeleton({ className = '', variant = 'rectangular', ...props }) {
  const variants = {
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
    text: 'rounded',
  };

  return (
    <div
      className={`skeleton ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
