interface CodeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Code({ children, className = 'p-5 rounded-xl' }: CodeProps) {
  return (
    <div className={`bg-surface border border-body-text/10 overflow-x-auto ${className}`}>
      {children}
    </div>
  );
}
