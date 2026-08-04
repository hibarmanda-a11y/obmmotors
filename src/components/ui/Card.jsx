/**
 * Reusable Card components
 */

export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`bg-surface border border-gray-100 rounded-2xl ${
        hover ? 'card-hover' : 'shadow-soft'
      } overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '', ...props }) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={`px-6 py-4 bg-gray-50/50 border-t border-gray-100 ${className}`} {...props}>
      {children}
    </div>
  );
}
