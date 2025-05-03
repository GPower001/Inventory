// import React, { useState, useEffect } from 'react';
// import StockTable from './StockTable';
// import axios from 'axios';

// const MedicationPage = () => {
//   const [items, setItems] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6; // Number of items per page
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get('/api/items'); // Fetch items from the backend
//         const medications = response.data.data.filter(
//           (item) => item.category === 'Medication'
//         ); // Filter by category
//         setItems(medications);
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching items:', err);
//         setError('Failed to fetch items. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchItems();
//   }, []);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const handleItemDelete = (itemId) => {
//     // Remove the deleted item from the state
//     setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
//   };

//   const totalPages = Math.ceil(items.length / itemsPerPage);

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
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">Medications</h1>
//       <StockTable
//         items={items}
//         currentPage={currentPage}
//         itemsPerPage={itemsPerPage}
//         handlePageChange={handlePageChange}
//         totalPages={totalPages}
//         onItemDelete={handleItemDelete} // Pass delete handler
//       />
//     </div>
//   );
// };

// export default MedicationPage;

import React, { useState, useEffect } from 'react';
import StockTable from './StockTable';
import axios from 'axios';

const MedicationPage = () => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get('/api/items');
        
        // Handle multiple possible response structures
        const responseData = response?.data;
        let itemsArray = [];

        if (Array.isArray(responseData)) {
          // Case 1: Response is already an array
          itemsArray = responseData;
        } else if (Array.isArray(responseData?.data)) {
          // Case 2: Response has data array
          itemsArray = responseData.data;
        } else if (responseData?.items) {
          // Case 3: Response has items property
          itemsArray = responseData.items;
        }

        if (!Array.isArray(itemsArray)) {
          throw new Error('Invalid items data format received from server');
        }

        // Safe filtering
        const medications = itemsArray.filter(item => 
          item?.category === 'Medication'
        );
        
        setItems(medications);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError(err.response?.data?.message || 
                err.message || 
                'Failed to fetch medications. Please try again later.');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemDelete = async (itemId) => {
    try {
      await axios.delete(`/api/items/${itemId}`);
      setItems(prevItems => prevItems.filter(item => item._id !== itemId));
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item. Please try again.');
    }
  };

  // Calculate pagination safely
  const totalItems = items?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Medications</h1>
          <StockTable
            items={items}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            handlePageChange={handlePageChange}
            totalPages={totalPages}
            onItemDelete={handleItemDelete} // Pass delete handler
          />
        </div>
      );
};

export default MedicationPage;