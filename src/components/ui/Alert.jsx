export default function Alert({ type = "error", message }) {
  if (!message) return null;
  const styles = {
    error: "bg-red-50 border-red-200 text-red-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
    warning: "bg-amber-50 border-amber-200 text-amber-700",
  };
  return (
    <div className={`px-4 py-3 rounded-xl border text-sm font-medium ${styles[type] || styles.error}`}>
      {message}
    </div>
  );
}
