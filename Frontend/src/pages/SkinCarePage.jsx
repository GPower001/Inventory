import React, { useState, useEffect } from 'react';
import StockTable from '../components/StockTable';
import axios from 'axios';

const SkinCarePage = () => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/items');
        // Filter by category 'Skin Care Products'
        const skincare = Array.isArray(response.data.data)
          ? response.data.data.filter(item => item.category === 'Skin Care Products')
          : [];
        setItems(skincare);
        setError(null);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to fetch items. Please try again later.');
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
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemDelete = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Skin Care Products</h1>
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
    </div>
  );
};

export default SkinCarePage;