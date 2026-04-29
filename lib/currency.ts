export function formatRupiah(value: number): string {
  if (!Number.isFinite(value)) return "Rp 0";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs < 1_000_000) {
    return `${sign}Rp ${Math.round(abs).toLocaleString("id-ID")}`;
  }
  if (abs < 1_000_000_000) {
    const juta = abs / 1_000_000;
    return `${sign}Rp ${juta.toLocaleString("id-ID", { maximumFractionDigits: 1 })} Juta`;
  }
  if (abs < 1_000_000_000_000) {
    const miliar = abs / 1_000_000_000;
    return `${sign}Rp ${miliar.toLocaleString("id-ID", { maximumFractionDigits: 2 })} Miliar`;
  }
  const triliun = abs / 1_000_000_000_000;
  return `${sign}Rp ${triliun.toLocaleString("id-ID", { maximumFractionDigits: 2 })} Triliun`;
}
