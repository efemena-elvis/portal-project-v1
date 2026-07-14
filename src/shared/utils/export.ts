import * as XLSX from "xlsx";

export const downloadBlob = (filename: string, blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const toCSV = (rows: Record<string, any>[]) => {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  const escape = (v: any) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return s.includes(",") || s.includes("\n") || s.includes('"')
      ? '"' + s.replace(/"/g, '""') + '"'
      : s;
  };
  return [
    keys.join(","),
    ...rows.map((r) => keys.map((k) => escape(r[k])).join(",")),
  ].join("\n");
};

export const exportXLSX = (
  rows: Record<string, any>[],
  filename: string,
  sheetName = "Sheet1",
) => {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
};

export const exportCSV = (rows: Record<string, any>[], filename: string) => {
  const csv = toCSV(rows);
  if (!csv) return;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(filename, blob);
};

export const safeExport = (
  rows: Record<string, any>[],
  filename: string,
  sheetName = "Sheet1",
) => {
  try {
    exportXLSX(rows, filename, sheetName);
  } catch {
    exportCSV(rows, filename.replace(/\.\w+$/, ".csv"));
  }
};
