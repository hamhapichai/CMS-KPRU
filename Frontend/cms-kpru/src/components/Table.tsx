import React from "react";

export interface TableColumn<T = any> {
  key: keyof T | string;
  header: string;
  className?: string;
  render?: (value: any, row: T, idx: number) => React.ReactNode;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
  className?: string;
}

export default function Table<T = any>({ columns, data, loading, emptyText = "ไม่มีข้อมูล", className = "" }: TableProps<T>) {
  return (
    <div className={`bg-white rounded-2xl shadow-xl p-6 mb-6 overflow-x-auto ${className}`}>
      <table className="w-full min-w-[600px] text-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            {columns.map((col, i) => (
              <th
                key={col.key as string}
                className={`p-4 font-bold text-left ${i === 0 ? "rounded-tl-2xl" : ""} ${i === columns.length - 1 ? "rounded-tr-2xl" : ""} ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center p-6 text-gray-500">กำลังโหลด...</td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center p-6 text-gray-500">{emptyText}</td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className={`transition border-t even:bg-gray-50 hover:bg-blue-50`}>
                {columns.map((col, i) => {
                  const value = row[col.key as keyof T];
                  return (
                    <td key={col.key as string} className={`p-4 text-gray-700 ${col.className || ""}`}>{
                      col.render ? col.render(value, row, idx) : String(value ?? "")
                    }</td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
