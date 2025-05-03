// import React, {useState, useEffect} from 'react'
// import './Topselling.css'
// import './main.css'
// import Consumables from './Consumables';

// function ConsumablePage() {
//     const [consumables, setConsumables] = useState([]);
//       const [loading, setLoading] = useState(true);
//       const [error, setError] = useState(null);
    
//       useEffect(() => {
//         const fetchConsumables = async () => {
//           try {
//             const response = await fetch('/api/items/Consumable');
//             if (!response.ok) {
//               throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             const data = await response.json();
//             setConsumables(Array.isArray(data.data) ? data.data : []);
//           } catch (err) {
//             setError(err.message);
//             console.error('Fetch error:', err);
//           } finally {
//             setLoading(false);
//           }
//         };
      
//         fetchConsumables();
//       }, []);
//       if (loading) return (
//         <div className="d-flex justify-content-center py-5">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//         </div>
//       );
    
//       if (error) return (
//         <div className="alert alert-danger mx-3 mt-3">
//           Error loading medications: {error}
//           <button 
//             className="btn btn-sm btn-outline-danger ms-2"
//             onClick={() => window.location.reload()}
//           >
//             Retry
//           </button>
//         </div>
//       );

//   return (
//     <div className='card top-selling overflow-auto' id='main'>
//         <div className='card-body pb-0'>
//             <h5 className='card-title'>
//                 Consumables
//             </h5>
//             <table className='table table-borderless'>
//                 <thead className='table-light'>
//                     <tr>
//                         <th scope='col'>Name</th>
//                         <th scope="col">Category</th>
//                         <th scope='col'>Quantity in stock</th>
//                         <th scope='col'>status</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//               {consumables
//                 .filter(item => item.category === "Consumables") // Filter items by category
//                 .map(item => (
//                   <Consumables 
//                     key={item._id || item.id}  // Use _id for MongoDB
//                     item={item} 
//                   />
//                 ))}
//             </tbody>
//             </table>
//         </div>
//     </div>
//   )
// }

// export default ConsumablePage

import React, { useState, useEffect } from 'react';
import StockTable from '../components/StockTable';
import axios from 'axios';

const ConsumablePage = () => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of items per page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError(err.response?.data?.message || 
                'Failed to fetch consumables. Please try again later.');
        setItems([]); // Reset to empty array on error
      } finally {
        setLoading(false);
      }
    };
  
    fetchItems();
  }, []);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemDelete = (itemId) => {
    // Remove the deleted item from the state
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
      <StockTable
        items={items}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        handlePageChange={handlePageChange}
        totalPages={totalPages}
        onItemDelete={handleItemDelete} // Pass the delete handler to StockTable
      />
    </div>
  );
};

export default ConsumablePage;
