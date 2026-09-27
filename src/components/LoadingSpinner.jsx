export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="loading-container" role="status" aria-label={text}>
      <div className="spinner" />
      <span className="loading-text">{text}</span>
    </div>
  );
}
