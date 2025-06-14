import React, { useState, useEffect } from 'react';
import StockTable from './StockTable';
import axios from 'axios';

// Popup notification (fade-in-up style)
const Popup = ({ message, type, onClose }) => (
  <div
    className={`fixed z-50 left-1/2 top-10 transform -translate-x-1/2 ${
      type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    } px-6 py-3 rounded shadow-lg animate-fade-in-up`}
    style={{ minWidth: 250, textAlign: "center" }}
  >
    <div className="flex items-center justify-between gap-4">
      <span>{message}</span>
      <button onClick={onClose} className="text-lg font-bold focus:outline-none">&times;</button>
    </div>
  </div>
);

const MedicationPage = () => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(""); // Search state
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Popup state
  const [popup, setPopup] = useState(null);

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

  // Show custom modal for delete confirmation
  const handleItemDelete = (itemId) => {
    setDeleteId(itemId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/items/${deleteId}`);
      setItems(prevItems => prevItems.filter(item => item._id !== deleteId));
      setShowConfirm(false);
      setDeleteId(null);
      showPopup("success", "Medication deleted successfully.");
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item. Please try again.');
      setShowConfirm(false);
      setDeleteId(null);
      showPopup("error", "Failed to delete medication.");
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  // Popup helper
  const showPopup = (type, message) => {
    setPopup({ type, message });
    setTimeout(() => setPopup(null), 3000);
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
      {/* Popup Notification */}
      {popup && (
        <Popup
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup(null)}
        />
      )}
      {/* Animation for popup */}
      <style>
        {`
          .animate-fade-in-up {
            animation: fadeInUp 0.4s;
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
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

      {/* Custom Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full border-t-8 border-red-500 relative">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 bg-red-100 rounded-full p-2 mr-3">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-red-700">Delete Medication</h2>
            </div>
            <p className="mb-6 text-gray-700 text-base">
              Are you sure you want to delete this medication?
              <br />
              <span className="text-red-600 font-medium">This action cannot be undone.</span>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition font-semibold shadow"
              >
                Delete
              </button>
            </div>
            <button
              onClick={cancelDelete}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationPage;