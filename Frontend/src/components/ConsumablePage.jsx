// import React, { useState, useEffect } from 'react';
// import StockTable from '../components/StockTable';
// import axios from 'axios';

// const ConsumablePage = () => {
//   const [items, setItems] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6; // Number of items per page
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response = await axios.get('/api/items');

//         // Handle different response structures
//         const responseData = response?.data;
//         let itemsArray = [];

//         if (Array.isArray(responseData)) {
//           itemsArray = responseData; // If response is directly an array
//         } else if (Array.isArray(responseData?.data)) {
//           itemsArray = responseData.data; // If data is nested under data property
//         } else if (responseData?.items) {
//           itemsArray = responseData.items; // If items are under items property
//         }

//         if (!Array.isArray(itemsArray)) {
//           throw new Error('Received invalid data format from server');
//         }

//         // Safe filtering for consumables
//         const consumables = itemsArray.filter(item =>
//           item?.category?.toLowerCase() === 'consumables'
//         );

//         setItems(consumables);
//       } catch (err) {
//         console.error('Error fetching consumables:', err);
//         setError(
//           err.response?.data?.message ||
//             'Failed to fetch consumables. Please try again later.'
//         );
//         setItems([]); // Reset to empty array on error
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchItems();
//   }, []);

//   const totalPages = Math.ceil(items.length / itemsPerPage);

//   // Pagination logic for current items
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

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

//   const handleItemDelete = (itemId) => {
//     setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center py-12">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
//         <p className="text-sm text-red-700">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">Consumables</h1>
//       <StockTable
//         items={currentItems}
//         onItemDelete={handleItemDelete}
//       />
//       {/* Pagination Controls - Prev/Next only */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-2 mt-6">
//           <button
//             className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
//             onClick={() => handlePageChange("prev")}
//             disabled={currentPage === 1}
//           >
//             Prev
//           </button>
//           <span>
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
//             onClick={() => handlePageChange("next")}
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ConsumablePage;

import React, { useState, useEffect } from 'react';
import StockTable from '../components/StockTable';
import axios from 'axios';

const ConsumablePage = () => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of items per page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(""); // Search state

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('/api/items');

        // Handle different response structures
        const responseData = response?.data;
        let itemsArray = [];

        if (Array.isArray(responseData)) {
          itemsArray = responseData; // If response is directly an array
        } else if (Array.isArray(responseData?.data)) {
          itemsArray = responseData.data; // If data is nested under data property
        } else if (responseData?.items) {
          itemsArray = responseData.items; // If items are under items property
        }

        if (!Array.isArray(itemsArray)) {
          throw new Error('Received invalid data format from server');
        }

        // Safe filtering for consumables
        const consumables = itemsArray.filter(item =>
          item?.category?.toLowerCase() === 'consumables'
        );

        setItems(consumables);
      } catch (err) {
        console.error('Error fetching consumables:', err);
        setError(
          err.response?.data?.message ||
            'Failed to fetch consumables. Please try again later.'
        );
        setItems([]); // Reset to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Filter by search
  const filteredItems = items.filter(item =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Pagination logic for current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
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

  const handleItemDelete = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Consumables</h1>
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
      <StockTable
        items={currentItems}
        onItemDelete={handleItemDelete}
      />
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
  );
};

export default ConsumablePage;