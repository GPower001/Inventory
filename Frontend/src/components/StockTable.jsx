import React from "react";
import api from "../utils/api"; // ✅ use the secured axios instance

const StockTable = ({ items, onItemDelete }) => {
  // Handle delete
  const handleDelete = async (itemId) => {
    try {
      await api.delete(`/api/items/${itemId}`); // ✅ includes Authorization automatically
      onItemDelete(itemId); // update parent state
    } catch (error) {
      console.error("Error deleting item:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to delete item");
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Item Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Current Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                {/* Item name */}
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {item.name || item.itemName}
                </td>

                {/* Stock quantity */}
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {item.openingQty ?? 0}
                </td>

                {/* Status badge */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.openingQty === 0 ||
                  item.openingQty === null ||
                  item.openingQty === undefined ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Out of Stock
                    </span>
                  ) : item.openingQty <= item.minStock ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Low Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      In Stock
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:text-red-800 font-medium transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="px-6 py-4 text-center text-gray-500 italic"
              >
                No items available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
