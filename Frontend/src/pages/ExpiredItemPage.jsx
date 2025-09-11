// import { useEffect, useState } from "react";
// import axios from "axios";
// // For Excel export
// import * as XLSX from "xlsx";
// // For Word export
// import { saveAs } from "file-saver";
// import { FaFileExcel, FaFileWord } from "react-icons/fa";

// const PAGE_SIZE = 6;

// const ExpiredItems = () => {
//   const [expiredItems, setExpiredItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [search, setSearch] = useState(""); // Search state

//   const baseURL =
//     import.meta.env.MODE === "development"
//       ? import.meta.env.VITE_API_URL
//       : import.meta.env.VITE_SOCKET_URL_PROD;

//   // Fetch all expired items for export (not paginated)
//   const fetchAllExpired = async () => {
//     try {
//       const res = await axios.get(`${baseURL}/api/items/expired`);
//       const data = res.data.data || res.data;
//       const today = new Date();
//       // Only pick items that are expired (expiryDate exists and is before today)
//       return (data.items || data).filter(
//         item =>
//           item.expiryDate &&
//           new Date(item.expiryDate).setHours(0,0,0,0) < today.setHours(0,0,0,0)
//       );
//     } catch {
//       return [];
//     }
//   };

//   useEffect(() => {
//     const fetchExpired = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(
//           `${baseURL}/api/items/expired?page=${currentPage}&limit=${PAGE_SIZE}`
//         );
//         const data = res.data.data || res.data;
//         const today = new Date();
//         // Only pick items that are expired (expiryDate exists and is before today)
//         const filtered = (data.items || data).filter(
//           item =>
//             item.expiryDate &&
//             new Date(item.expiryDate).setHours(0,0,0,0) < today.setHours(0,0,0,0)
//         );
//         setExpiredItems(filtered);
//       } catch (err) {
//         setError("Failed to fetch expired items.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchExpired();
//   }, [baseURL, currentPage]);

//   // Filter by search
//   const filteredItems = expiredItems.filter(item =>
//     item.name?.toLowerCase().includes(search.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE);
//   const indexOfLastItem = currentPage * PAGE_SIZE;
//   const indexOfFirstItem = indexOfLastItem - PAGE_SIZE;
//   const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

//   // Reset to page 1 when search changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search]);

//   // Export to Excel
//   const handleExportExcel = async () => {
//     const allItems = await fetchAllExpired();
//     const worksheet = XLSX.utils.json_to_sheet(
//       allItems.map((item, idx) => ({
//         "#": idx + 1,
//         Name: item.name,
//         Category: item.category,
//         Stock: item.openingQty,
//         "Expiry Date": item.expiryDate
//           ? new Date(item.expiryDate).toLocaleDateString()
//           : "N/A",
//         "Item Code": item.itemCode,
//       }))
//     );
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Expired Items");
//     XLSX.writeFile(workbook, "expired_items.xlsx");
//   };

//   // Export to Word
//   const handleExportWord = async () => {
//     const allItems = await fetchAllExpired();
//     let html =
//       `<h2>Expired Products</h2>` +
//       `<table border="1" cellpadding="5" cellspacing="0" style="border-collapse:collapse;">` +
//       `<tr>
//         <th>#</th>
//         <th>Name</th>
//         <th>Category</th>
//         <th>Stock</th>
//         <th>Expiry Date</th>
//         <th>Item Code</th>
//       </tr>`;
//     allItems.forEach((item, idx) => {
//       html += `<tr>
//         <td>${idx + 1}</td>
//         <td>${item.name}</td>
//         <td>${item.category}</td>
//         <td>${item.openingQty}</td>
//         <td>${
//           item.expiryDate
//             ? new Date(item.expiryDate).toLocaleDateString()
//             : "N/A"
//         }</td>
//         <td>${item.itemCode}</td>
//       </tr>`;
//     });
//     html += `</table>`;

//     // Create a Blob with Word MIME type
//     const blob = new Blob(
//       [
//         `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
//         <head><meta charset='utf-8'></head><body>${html}</body></html>`,
//       ],
//       {
//         type: "application/msword;charset=utf-8",
//       }
//     );
//     saveAs(blob, "expired_items.doc");
//   };

//   // Pagination controls
//   const handlePageChange = (direction) => {
//     setCurrentPage((prev) => {
//       if (direction === "prev") {
//         return Math.max(1, prev - 1);
//       } else if (direction === "next") {
//         return Math.min(totalPages, prev + 1);
//       }
//       return prev;
//     });
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Expired Products</h1>
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
//         <div></div>
//         <div className="flex gap-2">
//           <button
//             onClick={handleExportExcel}
//             className="flex items-center justify-center bg-teal-500 text-white p-3 rounded-full shadow-lg hover:bg-teal-600 hover:scale-105 transition-transform"
//           >
//             <FaFileExcel size={18} />
//           </button>
//           <button
//             onClick={handleExportWord}
//             className="flex items-center justify-center bg-teal-500 text-white p-3 rounded-full shadow-lg hover:bg-teal-600 hover:scale-105 transition-transform"
//           >
//             <FaFileWord size={18} />
//           </button>
//         </div>
//       </div>
//       {/* Search Input */}
//       <div className="mb-4 flex justify-end">
//         <input
//           type="text"
//           placeholder="Search item name..."
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
//         />
//       </div>
//       {loading && (
//         <div className="flex justify-center items-center py-12">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       )}
//       {error && (
//         <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
//           <p className="text-sm text-red-700">{error}</p>
//         </div>
//       )}
//       {!loading && !error && currentItems.length === 0 && (
//         <div className="text-center mt-10 text-lg font-medium text-gray-600">
//           No expired items found.
//         </div>
//       )}
//       {!loading && !error && currentItems.length > 0 && (
//         <div className="overflow-x-auto">
//           <table className="table-auto w-full border-collapse border border-gray-200 shadow-md rounded-lg">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">
//                   #
//                 </th>
//                 <th className="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">
//                   Name
//                 </th>
//                 <th className="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">
//                   Category
//                 </th>
//                 <th className="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">
//                   Stock
//                 </th>
//                 <th className="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">
//                   Expiry Date
//                 </th>
//                 <th className="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">
//                   Item Code
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentItems.map((item, idx) => (
//                 <tr
//                   key={item._id}
//                   className={`${
//                     idx % 2 === 0 ? "bg-white" : "bg-gray-50"
//                   } hover:bg-gray-100 transition`}
//                 >
//                   <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800">
//                     {(currentPage - 1) * PAGE_SIZE + idx + 1}
//                   </td>
//                   <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800">
//                     {item.name}
//                   </td>
//                   <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800">
//                     {item.category}
//                   </td>
//                   <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800">
//                     {item.openingQty}
//                   </td>
//                   <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800">
//                     {item.expiryDate
//                       ? new Date(item.expiryDate).toLocaleDateString()
//                       : "N/A"}
//                   </td>
//                   <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800">
//                     {item.itemCode}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           {/* Pagination Controls - Prev/Next only */}
//           {totalPages > 1 && (
//             <div className="flex justify-center items-center gap-2 mt-6">
//               <button
//                 className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
//                 onClick={() => handlePageChange("prev")}
//                 disabled={currentPage === 1}
//               >
//                 Prev
//               </button>
//               <span>
//                 Page {currentPage} of {totalPages}
//               </span>
//               <button
//                 className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
//                 onClick={() => handlePageChange("next")}
//                 disabled={currentPage === totalPages}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ExpiredItems;


import React, { useState, useEffect } from "react";
import StockTable from "../components/StockTable";
import api from "../utils/api"; // ✅ secured axios instance
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaFileExcel, FaFileWord } from "react-icons/fa";

const PAGE_SIZE = 6;

const ExpiredItemsPage = () => {
  const [expiredItems, setExpiredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  // Fetch all expired items
  const fetchExpiredItems = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/items/expired");
      const data = res?.data?.data || res?.data || [];
      const today = new Date();

      const expired = (data.items || data).filter(
        (item) =>
          item.expiryDate &&
          new Date(item.expiryDate).setHours(0, 0, 0, 0) <
            today.setHours(0, 0, 0, 0)
      );

      setExpiredItems(expired);
      setError(null);
    } catch (err) {
      console.error("Error fetching expired items:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch expired items. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpiredItems();
  }, []);

  // Search filter
  const filteredItems = expiredItems.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE);
  const indexOfLastItem = currentPage * PAGE_SIZE;
  const indexOfFirstItem = indexOfLastItem - PAGE_SIZE;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination handler
  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      if (direction === "prev") return Math.max(1, prev - 1);
      if (direction === "next") return Math.min(totalPages, prev + 1);
      return prev;
    });
  };

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Optional: Delete item locally
  const handleItemDelete = (itemId) => {
    setExpiredItems((prev) => prev.filter((item) => item._id !== itemId));
  };

  // Export to Excel
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      expiredItems.map((item, idx) => ({
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
  const handleExportWord = () => {
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

    expiredItems.forEach((item, idx) => {
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

    const blob = new Blob(
      [
        `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'></head><body>${html}</body></html>`,
      ],
      { type: "application/msword;charset=utf-8" }
    );
    saveAs(blob, "expired_items.doc");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Expired Items</h1>

      {/* Export buttons */}
      <div className="flex justify-end gap-2 mb-4">
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

      {/* Search */}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search item name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Table */}
      <StockTable items={currentItems} onItemDelete={handleItemDelete} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpiredItemsPage;

