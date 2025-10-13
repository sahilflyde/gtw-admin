// components/Label.jsx
export default function Label({ htmlFor, children, className = "" }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 py-0.5 ${className}`}
    >
      {children}
    </label>
  );
}
