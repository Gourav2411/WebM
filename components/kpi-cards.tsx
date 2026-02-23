export function KpiCards({ items }: { items: Array<{ label: string; value: number | string }> }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="text-2xl font-semibold">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
