import React, { useState, useEffect } from "react";
import StockTable from "./StockTable";
import EditNameModal from "../components/EditNameModal";
import api from "../utils/api";
import { useAuthStore } from "../store/useAuthStore";

// ✅ Popup notification
const Popup = ({ message, type, onClose }) => (
  <div
    className={`fixed z-50 left-1/2 top-10 transform -translate-x-1/2 ${
      type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    } px-6 py-3 rounded shadow-lg animate-fade-in-up`}
    style={{ minWidth: 250, textAlign: "center" }}
  >
    <div className="flex items-center justify-between gap-4">
      <span>{message}</span>
      <button
        onClick={onClose}
        className="text-lg font-bold focus:outline-none"
      >
        &times;
      </button>
    </div>
  </div>
);

const MedicationPage = () => {
  const { token, branchId, isLoggedIn } = useAuthStore();
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null); // item to edit name
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [popup, setPopup] = useState(null);

  // ✅ Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get("/api/items");
        const responseData = response?.data;

        let itemsArray = [];
        if (Array.isArray(responseData)) itemsArray = responseData;
        else if (Array.isArray(responseData?.data)) itemsArray = responseData.data;
        else if (responseData?.items) itemsArray = responseData.items;

        if (!Array.isArray(itemsArray)) {
          throw new Error("Invalid items data format received from server");
        }

        // ✅ Only medications
        const medications = itemsArray.filter((item) =>
          item?.category?.toLowerCase().includes("medication")
        );

        setItems(medications);
      } catch (err) {
        console.error("Error fetching items:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch medications. Please try again later."
        );
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn && token && branchId) {
      fetchItems();
    }
  }, [isLoggedIn, token, branchId]);

  // ✅ Search filter
  const filteredItems = items.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Pagination
  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      if (direction === "prev") return Math.max(1, prev - 1);
      if (direction === "next") return Math.min(totalPages, prev + 1);
      return prev;
    });
  };

  // ✅ Delete handler (show modal first)
  const handleItemDelete = (item) => {
    setDeleteItem(item);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;

    try {
      await api.delete(`/api/items/${deleteItem._id}`);
      setItems((prev) => prev.filter((item) => item._id !== deleteItem._id));
      setShowConfirm(false);
      setDeleteItem(null);
      showPopup("success", "Medication deleted successfully.");
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete item. Please try again.");
      setShowConfirm(false);
      setDeleteItem(null);
      showPopup("error", "Failed to delete medication.");
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteItem(null);
  };

  // ✅ Popup
  const showPopup = (type, message) => {
    setPopup({ type, message });
    setTimeout(() => setPopup(null), 3000);
  };

  // Called from StockTable when user selects Edit Name
    const handleEditName = (item) => {
      setEditItem(item);
    };

    // When EditNameModal saves, update local list
    const handleNameSaved = (updatedItem) => {
      setItems((prev) => prev.map((it) => (it._id === updatedItem._id ? updatedItem : it)));
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
      {popup && (
        <Popup
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup(null)}
        />
      )}
      <style>
        {`
          .animate-fade-in-up {
            animation: fadeInUp 0.4s;
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Medications</h1>

      {/* ✅ Search */}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search item name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* ✅ Stock Table */}
      <StockTable
        items={currentItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        handlePageChange={handlePageChange}
        totalPages={totalPages}
        onEditName={handleEditName}
        onDeleteRequest={(item) => {
          setDeleteItem(item);
          setShowConfirm(true);
        }}
      />

      {/* ✅ Pagination */}
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

      {/* Delete Confirmation Modal */}
        {showConfirm && deleteItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 relative animate-fadeIn">
              
              {/* Close button */}
              <button
                onClick={cancelDelete}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
                aria-label="Close"
              >
                &times;
              </button>

              {/* Header */}
              <div className="text-center mb-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Delete Item</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Are you sure you want to delete{" "}
                  <span className="font-medium text-gray-900">{deleteItem.name}</span>?
                  This action cannot be undone.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 shadow-sm transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}


      {/* Edit Name Modal */}
      {editItem && (
        <EditNameModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onSaved={handleNameSaved}
          showPopup={showPopup}
        />
      )}
    </div>
  );
};

export default MedicationPage;
