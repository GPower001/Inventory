import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // For Excel export
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } from "docx"; // For Word export
import { saveAs } from "file-saver"; // For saving files
import { FaFileExcel, FaFileWord } from "react-icons/fa"; // Icons for export buttons

const ItemCategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Medications"); // Default category
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [search, setSearch] = useState(""); // Search state
  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/items"); // Fetch all products
        setProducts(response.data.data); // Assuming the backend returns products in `data`
        setError(null);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  // Filter by search
  const filteredProducts =
    groupedProducts[activeCategory]?.filter((product) =>
      product.name?.toLowerCase().includes(search.toLowerCase())
    ) || [];

  // Pagination logic
  const paginate = (items) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
      if (direction === "prev") {
        return Math.max(1, prev - 1);
      } else if (direction === "next") {
        return Math.min(totalPages, prev + 1);
      }
      return prev;
    });
  };

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeCategory]);

  // Export table data to Excel
  const exportToExcel = () => {
    const dataToExport = filteredProducts.map((product) => ({
      "Item Name": product.name,
      Stock: product.openingQty,
      "Minimum Stock": product.minStock,
      Status:
        product.openingQty === 0
          ? "Out of Stock"
          : product.openingQty <= product.minStock
          ? "Low Stock"
          : "In Stock",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, activeCategory);

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `${activeCategory}_Products.xlsx`);
  };

  // Export table data to Word
  const exportToWord = () => {
    const dataToExport = filteredProducts.map((product) => [
      product.name,
      product.openingQty.toString(), // Ensure stock is included as a string
      product.minStock.toString(),
      product.openingQty === 0
        ? "Out of Stock"
        : product.openingQty <= product.minStock
        ? "Low Stock"
        : "In Stock",
    ]);

    const tableRows = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Item Name")] }),
          new TableCell({ children: [new Paragraph("Stock")] }),
          new TableCell({ children: [new Paragraph("Minimum Stock")] }),
          new TableCell({ children: [new Paragraph("Status")] }),
        ],
      }),
      ...dataToExport.map(
        (row) =>
          new TableRow({
            children: row.map(
              (cell) =>
                new TableCell({
                  children: [new Paragraph(cell)],
                })
            ),
          })
      ),
    ];

    const table = new Table({
      rows: tableRows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
    });

    const doc = new Document({
      sections: [
        {
          children: [new Paragraph(`${activeCategory} Products`), table],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${activeCategory}_Products.docx`);
    });
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

  const categories = Object.keys(groupedProducts);
  const paginatedProducts = paginate(filteredProducts);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Products by Category</h1>

      {/* Category Buttons */}
      <div className="flex space-x-4 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setActiveCategory(category);
              setCurrentPage(1); // Reset to the first page when switching categories
            }}
            className={`px-4 py-2 rounded-md font-medium ${
              activeCategory === category
                ? "bg-teal-500 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-teal-600 hover:text-white`}
          >
            {category}
          </button>
        ))}
      </div>

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

      {/* Export Buttons */}
      <div className="flex justify-end space-x-4 mb-4">
        <button
          onClick={exportToExcel}
          className="flex items-center justify-center bg-teal-500 text-white p-3 rounded-full shadow-lg hover:bg-teal-600 hover:scale-105 transition-transform"
          title="Export to Excel"
        >
          <FaFileExcel size={18} />
        </button>
        <button
          onClick={exportToWord}
          className="flex items-center justify-center bg-teal-500 text-white p-3 rounded-full shadow-lg hover:bg-teal-600 hover:scale-105 transition-transform"
          title="Export to Word"
        >
          <FaFileWord size={18} />
        </button>
      </div>

      {/* Active Category Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">
                Item Name
              </th>
              <th className="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">
                Stock
              </th>
              <th className="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">
                Minimum Stock
              </th>
              <th className="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product, index) => (
              <tr
                key={product._id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition`}
              >
                <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800">
                  {product.name}
                </td>
                <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800">
                  {product.openingQty}
                </td>
                <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800">
                  {product.minStock}
                </td>
                <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800">
                  {product.openingQty === 0 ? (
                    <span className="text-red-500">Out of Stock</span>
                  ) : product.openingQty <= product.minStock ? (
                    <span className="text-orange-500">Low Stock</span>
                  ) : (
                    <span className="text-green-500">In Stock</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls - Prev/Next style */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
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

export default ItemCategoryPage;