import React, { useState, useEffect } from 'react';
import StockTable from './StockTable';
import axios from 'axios';

const MedicationPage = () => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(""); // Search state

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
          itemsArray = responseData;
        } else if (Array.isArray(responseData?.data)) {
          itemsArray = responseData.data;
        } else if (responseData?.items) {
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

  // Filter by search
  const filteredItems = items.filter(item =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate pagination safely
  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

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

  const handleItemDelete = async (itemId) => {
    try {
      await axios.delete(`/api/items/${itemId}`);
      setItems(prevItems => prevItems.filter(item => item._id !== itemId));
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item. Please try again.');
    }
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
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        handlePageChange={handlePageChange}
        totalPages={totalPages}
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

export default MedicationPage;