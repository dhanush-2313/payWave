export function InputBox({ label, placeholder, onChange }) {
  return (
    <div>
      <div className="text-sm font-medium text-left py-2">{label}</div>
      <form>
        <input
          placeholder={placeholder}
          className="w-full px-2 py-1 border rounded border-slate-200"
          required
          onChange={onChange}
        />
      </form>
    </div>
  );
}
