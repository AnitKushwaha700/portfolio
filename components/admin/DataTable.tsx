"use client";

import { Edit, Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onAdd?: () => void;
  addLabel?: string;
  title: string;
  description?: string;
}

export default function DataTable<T extends { _id?: string; id?: string }>({
  data,
  columns,
  onEdit,
  onDelete,
  onAdd,
  addLabel = "Add New",
  title,
  description,
}: DataTableProps<T>) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-2xl border border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          )}
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            {addLabel}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-card border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800/30 border-b border-gray-800">
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap ${col.className || ""}`}
                  >
                    {col.header}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right whitespace-nowrap">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No data available.
                  </td>
                </tr>
              ) : (
                data.map((item, rowIdx) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: rowIdx * 0.05 }}
                    key={item._id || item.id || rowIdx}
                    className="hover:bg-gray-800/20 transition-colors group"
                  >
                    {columns.map((col, colIdx) => (
                      <td
                        key={colIdx}
                        className={`px-6 py-4 text-sm text-gray-300 whitespace-nowrap ${col.className || ""}`}
                      >
                        {typeof col.accessor === "function"
                          ? col.accessor(item)
                          : (item[col.accessor] as any)}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    )}
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
