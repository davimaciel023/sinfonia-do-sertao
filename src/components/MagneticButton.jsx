export default function MagneticButton({ as = "a", variant = "accent", size = "", className = "", children, ...rest }) {
  const Tag = as;
  return (
    <Tag
      className={`btn btn--${variant} ${size ? `btn--${size}` : ""} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  );
}
