export default function Header({ title, subtitle, onBack }) {
  return (
    <header className="header">
      {onBack && (
        <button className="header-back" onClick={onBack}>
          ←
        </button>
      )}
      <h1>{title}</h1>
      {subtitle && <div className="header-sub">{subtitle}</div>}
    </header>
  );
}
