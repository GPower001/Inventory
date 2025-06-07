// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ITEMS_PER_PAGE = 5; // 5 items per page

// const LowStockItems = () => {
//   const [lowStockItems, setLowStockItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     const fetchLowStockItems = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get("/api/items/lowstock");
//         setLowStockItems(response.data.data); // Assuming the backend returns items in `data`
//         setError(null);
//       } catch (err) {
//         setError("Failed to fetch low stock items.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLowStockItems();
//   }, []);

//   const totalPages = Math.ceil(lowStockItems.length / ITEMS_PER_PAGE);
//   const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
//   const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
//   const currentItems = lowStockItems.slice(indexOfFirstItem, indexOfLastItem);

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

//   // Render loading state
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center py-12">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   // Render error state
//   if (error) {
//     return (
//       <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
//         <p className="text-sm text-red-700">{error}</p>
//       </div>
//     );
//   }

//   // Render the main content
//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Low Stock Items</h1>
//       {currentItems.length > 0 ? (
//         <div className="overflow-x-auto">
//           <table className="table-auto w-full border-collapse border border-gray-200 shadow-md rounded-lg">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">
//                   Item Name
//                 </th>
//                 <th className="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">
//                   Category
//                 </th>
//                 <th className="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">
//                   Stock
//                 </th>
//                 <th className="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">
//                   Minimum Stock
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentItems.map((item, index) => (
//                 <tr
//                   key={item._id}
//                   className={`${
//                     index % 2 === 0 ? "bg-white" : "bg-gray-50"
//                   } hover:bg-gray-100 transition`}
//                 >
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
//                     {item.minStock}
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
//       ) : (
//         <div className="text-center mt-10 text-lg font-medium text-gray-600">
//           No items are low in stock.
//         </div>
//       )}
//     </div>
//   );
// };

// export default LowStockItems;

import React, { useEffect, useState } from "react";
import axios from "axios";

const ITEMS_PER_PAGE = 5; // 5 items per page

const LowStockItems = () => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState(""); // Search state

  useEffect(() => {
    const fetchLowStockItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/items/lowstock");
        setLowStockItems(response.data.data); // Assuming the backend returns items in `data`
        setError(null);
      } catch (err) {
        setError("Failed to fetch low stock items.");
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockItems();
  }, []);

  // Filter items by search
  const filteredItems = lowStockItems.filter(item =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      if (direction === "prev") {
        return Math.max(1, prev - 1);
      } else if (direction === "next") {
        return Math.min(totalPages, prev + 1);
      }
      return prev;
    });
  };

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  // Render the main content
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Low Stock Items</h1>
      {/* Search Input */}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search item name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      {currentItems.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200 shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Item Name
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Category
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Stock
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Minimum Stock
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr
                  key={item._id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800">
                    {item.name}
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800">
                    {item.category}
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800">
                    {item.openingQty}
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800">
                    {item.minStock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Controls - Prev/Next only */}
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
      ) : (
        <div className="text-center mt-10 text-lg font-medium text-gray-600">
          No items are low in stock.
        </div>
      )}
    </div>
  );
};

export default LowStockItems;