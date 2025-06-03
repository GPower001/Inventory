import { useEffect, useState } from "react";
import axios from "axios";
// For Excel export
import * as XLSX from "xlsx";
// For Word export
import { saveAs } from "file-saver";
import { FaFileExcel, FaFileWord } from "react-icons/fa";

// ...existing imports...

const PAGE_SIZE = 10;

const ExpiredItems = () => {
  const [expiredItems, setExpiredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const baseURL =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_API_URL
      : import.meta.env.VITE_SOCKET_URL_PROD;

  // Fetch all expired items for export (not paginated)
  const fetchAllExpired = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/items/expired`);
      const data = res.data.data || res.data;
      // Only include items that are actually expired (expiryDate <= today)
      const today = new Date();
      // Only pick items that are expired (not low stock)
      return (data.items || data).filter(
        item =>
          item.expiryDate &&
          new Date(item.expiryDate) <= today
      );
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const fetchExpired = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${baseURL}/api/items/expired?page=${page}&limit=${PAGE_SIZE}`
        );
        const data = res.data.data || res.data;
        const today = new Date();
        // Only pick items that are expired (not low stock)
        const filtered = (data.items || data).filter(
          item =>
            item.expiryDate &&
            new Date(item.expiryDate) <= today
        );
        setExpiredItems(filtered);
        setTotalItems(data.total
          ? filtered.length
          : filtered.length
        );
      } catch (err) {
        setError("Failed to fetch expired items.");
      } finally {
        setLoading(false);
      }
    };
    fetchExpired();
  }, [baseURL, page]);

  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  // ...existing export handlers and render code...
  // (No changes needed below this line)

  // Export to Excel
  const handleExportExcel = async () => {
    const allItems = await fetchAllExpired();
    const worksheet = XLSX.utils.json_to_sheet(
      allItems.map((item, idx) => ({
        "#": idx + 1,
        Name: item.name,
        Category: item.category,
        Stock: item.openingQty,
        "Expiry Date": item.expiryDate
          ? new Date(item.expiryDate).toLocaleDateString()
          : "N/A",
        "Item Code": item.itemCode,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expired Items");
    XLSX.writeFile(workbook, "expired_items.xlsx");
  };

  // Export to Word
  const handleExportWord = async () => {
    const allItems = await fetchAllExpired();
    let html =
      `<h2>Expired Products</h2>` +
      `<table border="1" cellpadding="5" cellspacing="0" style="border-collapse:collapse;">` +
      `<tr>
        <th>#</th>
        <th>Name</th>
        <th>Category</th>
        <th>Stock</th>
        <th>Expiry Date</th>
        <th>Item Code</th>
      </tr>`;
    allItems.forEach((item, idx) => {
      html += `<tr>
        <td>${idx + 1}</td>
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>${item.openingQty}</td>
        <td>${
          item.expiryDate
            ? new Date(item.expiryDate).toLocaleDateString()
            : "N/A"
        }</td>
        <td>${item.itemCode}</td>
      </tr>`;
    });
    html += `</table>`;

    // Create a Blob with Word MIME type
    const blob = new Blob(
      [
        `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'></head><body>${html}</body></html>`,
      ],
      {
        type: "application/msword;charset=utf-8",
      }
    );
    saveAs(blob, "expired_items.doc");
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-semibold">Expired Products</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center justify-center bg-teal-500 text-white p-3 rounded-full shadow-lg hover:bg-teal-600 hover:scale-105 transition-transform"
          >
            <FaFileExcel size={18} />
          </button>
          <button
            onClick={handleExportWord}
            className="flex items-center justify-center bg-teal-500 text-white p-3 rounded-full shadow-lg hover:bg-teal-600 hover:scale-105 transition-transform"
          >
            <FaFileWord size={18} />
          </button>
        </div>
      </div>
      {loading && <div>Loading expired items...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && expiredItems.length === 0 && (
        <div className="text-gray-500">No expired items found.</div>
      )}
      {!loading && !error && expiredItems.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">#</th>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Category</th>
                <th className="px-4 py-2 border-b">Stock</th>
                <th className="px-4 py-2 border-b">Expiry Date</th>
                <th className="px-4 py-2 border-b">Item Code</th>
              </tr>
            </thead>
            <tbody>
              {expiredItems.map((item, idx) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">
                    {(page - 1) * PAGE_SIZE + idx + 1}
                  </td>
                  <td className="px-4 py-2 border-b">{item.name}</td>
                  <td className="px-4 py-2 border-b">{item.category}</td>
                  <td className="px-4 py-2 border-b">{item.openingQty}</td>
                  <td className="px-4 py-2 border-b">
                    {item.expiryDate
                      ? new Date(item.expiryDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 border-b">{item.itemCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpiredItems;