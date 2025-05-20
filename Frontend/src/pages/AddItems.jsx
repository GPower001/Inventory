import React, { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import axios from "axios";

const AddItems = ({ onClose, onItemAdded }) => {
  const [enabled, setEnabled] = useState(false);
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [openingQty, setOpeningQty] = useState("");
  const [minStock, setMinStock] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [expiryDate, setExpiryDate] = useState(""); // <-- Expiry date state
  const [itemCode, setItemCode] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // State for success message

  const generateItemCode = () => {
    const code = `ITEM-${Math.floor(1000 + Math.random() * 9000)}`;
    setItemCode(code);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null); // Clear previous success message

    // Validate required fields
    if (!itemName || !category) {
      setError("Please fill in required fields.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      // Append all fields (required and optional)
      formData.append("name", itemName);
      formData.append("category", category);
      formData.append("openingQty", openingQty || 0);
      formData.append("minStock", minStock || 0);
      formData.append("itemCode", itemCode || `ITEM-${Date.now()}`);
      formData.append("dateAdded", date);
      if (expiryDate) formData.append("expiryDate", expiryDate); // <-- Add expiry date
      if (image) formData.append("image", image);

      const response = await axios.post("/api/items", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Clear form on success
      setItemName("");
      setCategory("");
      setOpeningQty("");
      setMinStock("");
      setItemCode("");
      setImage(null);
      setImagePreview("");
      setExpiryDate(""); // Clear expiry date

      // Set success message
      setSuccess("Item added successfully!");

      // Notify parent component
      if (onItemAdded) {
        onItemAdded(response.data);
      }

      // Close modal if needed
      if (onClose) {
        setTimeout(() => onClose(), 2000); // Close after 2 seconds
      }
    } catch (error) {
      console.error("Error adding item:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to add item. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
          <p>{success}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-teal-800 text-white p-4">
          <div className="flex gap-6 items-center">
            <h2 className="text-xl md:text-2xl font-semibold">Add Item</h2>
            <div className="flex items-center space-x-4">
              <span>Product</span>
              <div
                className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  enabled ? "bg-teal-500" : "bg-gray-300"
                }`}
                onClick={() => setEnabled(!enabled)}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                    enabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
              <span>Service</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-teal-700 transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Item Name */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-teal-600"
                  required
                />
              </div>

              {/* Category */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-teal-600"
                  required
                >
                  <option value="">Select</option>
                  <option value="Medication">Medications</option>
                  <option value="Consumables">Consumables</option>
                  <option value="Generals">Generals</option>
                </select>
              </div>

              {/* Units Button */}
              <div className="flex items-end">
                <button
                  type="button"
                  className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Select Units
                </button>
              </div>

              {/* Image Upload */}
              <div className="relative">
                <label className="flex items-center space-x-2 text-gray-700 cursor-pointer">
                  <ImagePlus size={18} />
                  <span className="text-sm font-medium">Add Image</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-16 w-16 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Stock Section */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Stock Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Opening Quantity
                  </label>
                  <input
                    type="number"
                    value={openingQty}
                    onChange={(e) => setOpeningQty(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Stock To Maintain
                  </label>
                  <input
                    type="number"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    As Of Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-teal-600"
                  />
                </div>
                {/* Expiry Date Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-teal-600"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                className={`w-full sm:w-auto px-6 py-2 rounded-md text-white font-medium ${
                  loading
                    ? "bg-teal-400 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700"
                } transition-colors`}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Item"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItems;









// import React, { useState } from "react";
// import { ImagePlus, X } from "lucide-react";
// import axios from "axios";

// const AddItems = ({ onClose, onItemAdded }) => {
//   const [enabled, setEnabled] = useState(false);
//   const [itemName, setItemName] = useState("");
//   const [category, setCategory] = useState("");
//   const [openingQty, setOpeningQty] = useState("");
//   const [minStock, setMinStock] = useState("");
//   const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
//   const [itemCode, setItemCode] = useState("");
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null); // State for success message

//   const generateItemCode = () => {
//     const code = `ITEM-${Math.floor(1000 + Math.random() * 9000)}`;
//     setItemCode(code);
//   };

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setImage(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(null); // Clear previous success message

//     // Validate required fields
//     if (!itemName || !category) {
//       setError("Please fill in required fields.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const formData = new FormData();
//       // Append all fields (required and optional)
//       formData.append("name", itemName);
//       formData.append("category", category);
//       formData.append("openingQty", openingQty || 0);
//       formData.append("minStock", minStock || 0);
//       formData.append("itemCode", itemCode || `ITEM-${Date.now()}`);
//       formData.append("dateAdded", date);
//       if (image) formData.append("image", image);

//       const response = await axios.post("/api/items", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       // Clear form on success
//       setItemName("");
//       setCategory("");
//       setOpeningQty("");
//       setMinStock("");
//       setItemCode("");
//       setImage(null);
//       setImagePreview("");

//       // Set success message
//       setSuccess("Item added successfully!");

//       // Notify parent component
//       if (onItemAdded) {
//         onItemAdded(response.data);
//       }

//       // Close modal if needed
//       if (onClose) {
//         setTimeout(() => onClose(), 2000); // Close after 2 seconds
//       }
//     } catch (error) {
//       console.error("Error adding item:", {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//         config: error.config,
//       });

//       setError(
//         error.response?.data?.message ||
//           error.response?.data?.error ||
//           "Failed to add item. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 sm:p-6 md:p-8 lg:p-10">
//       {/* Error message */}
//       {error && (
//         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
//           <p>{error}</p>
//         </div>
//       )}

//       {/* Success message */}
//       {success && (
//         <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
//           <p>{success}</p>
//         </div>
//       )}

//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         {/* Header */}
//         <div className="flex items-center justify-between bg-teal-800 text-white p-4">
//           <div className="flex gap-6 items-center">
//             <h2 className="text-xl md:text-2xl font-semibold">Add Item</h2>
//             <div className="flex items-center space-x-4">
//               <span>Product</span>
//               <div
//                 className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
//                   enabled ? "bg-teal-500" : "bg-gray-300"
//                 }`}
//                 onClick={() => setEnabled(!enabled)}
//               >
//                 <div
//                   className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
//                     enabled ? "translate-x-5" : "translate-x-0"
//                   }`}
//                 />
//               </div>
//               <span>Service</span>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-1 rounded-full hover:bg-teal-700 transition-colors"
//             disabled={loading}
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Form Fields */}
//         <div className="p-4 sm:p-6">
//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//               {/* Item Name */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Item Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={itemName}
//                   onChange={(e) => setItemName(e.target.value)}
//                   className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-teal-600"
//                   required
//                 />
//               </div>

//               {/* Category */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Category <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={category}
//                   onChange={(e) => setCategory(e.target.value)}
//                   className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-teal-600"
//                   required
//                 >
//                   <option value="">Select</option>
//                   <option value="Medication">Medications</option>
//                   <option value="Consumables">Consumables</option>
//                   <option value="Generals">Generals</option>
//                 </select>
//               </div>

//               {/* Units Button */}
//               <div className="flex items-end">
//                 <button
//                   type="button"
//                   className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded transition-colors"
//                 >
//                   Select Units
//                 </button>
//               </div>

//               {/* Image Upload */}
//               <div className="relative">
//                 <label className="flex items-center space-x-2 text-gray-700 cursor-pointer">
//                   <ImagePlus size={18} />
//                   <span className="text-sm font-medium">Add Image</span>
//                   <input
//                     type="file"
//                     className="hidden"
//                     onChange={handleImageUpload}
//                   />
//                 </label>
//                 {imagePreview && (
//                   <div className="mt-2">
//                     <img
//                       src={imagePreview}
//                       alt="Preview"
//                       className="h-16 w-16 object-cover rounded-md"
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Stock Section */}
//             <div className="mt-6">
//               <h2 className="text-lg font-semibold text-gray-700 mb-4">
//                 Stock Information
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Opening Quantity
//                   </label>
//                   <input
//                     type="number"
//                     value={openingQty}
//                     onChange={(e) => setOpeningQty(e.target.value)}
//                     className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-teal-600"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Min Stock To Maintain
//                   </label>
//                   <input
//                     type="number"
//                     value={minStock}
//                     onChange={(e) => setMinStock(e.target.value)}
//                     className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-teal-600"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     As Of Date
//                   </label>
//                   <input
//                     type="date"
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                     className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-teal-600"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="mt-6">
//               <button
//                 type="submit"
//                 className={`w-full sm:w-auto px-6 py-2 rounded-md text-white font-medium ${
//                   loading
//                     ? "bg-teal-400 cursor-not-allowed"
//                     : "bg-teal-600 hover:bg-teal-700"
//                 } transition-colors`}
//                 disabled={loading}
//               >
//                 {loading ? "Saving..." : "Save Item"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddItems;




// import React, { useState } from "react";
// import { ImagePlus, X } from "lucide-react";
// import axios from "axios";

// const AddItems = ({ onClose, onItemAdded }) => {
//   const [enabled, setEnabled] = useState(false);
//   const [itemName, setItemName] = useState("");
//   const [category, setCategory] = useState("");
//   const [openingQty, setOpeningQty] = useState("");
//   const [minStock, setMinStock] = useState("");
//   const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
//   const [itemCode, setItemCode] = useState("");
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null); // State for success message

//   const generateItemCode = () => {
//     const code = `ITEM-${Math.floor(1000 + Math.random() * 9000)}`;
//     setItemCode(code);
//   };

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setImage(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(null); // Clear previous success message

//     // Validate required fields
//     if (!itemName || !category) {
//       setError("Please fill in required fields.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const formData = new FormData();
//       // Append all fields (required and optional)
//       formData.append("name", itemName);
//       formData.append("category", category);
//       formData.append("openingQty", openingQty || 0);
//       formData.append("minStock", minStock || 0);
//       formData.append("itemCode", itemCode || `ITEM-${Date.now()}`);
//       formData.append("dateAdded", date);
//       if (image) formData.append("image", image);

//       const response = await axios.post("/api/items", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       // Clear form on success
//       setItemName("");
//       setCategory("");
//       setOpeningQty("");
//       setMinStock("");
//       setItemCode("");
//       setImage(null);
//       setImagePreview("");

//       // Set success message
//       setSuccess("Item added successfully!");

//       // Notify parent component
//       if (onItemAdded) {
//         onItemAdded(response.data);
//       }

//       // Close modal if needed
//       if (onClose) {
//         setTimeout(() => onClose(), 2000); // Close after 2 seconds
//       }
//     } catch (error) {
//       console.error("Error adding item:", {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//         config: error.config,
//       });

//       setError(
//         error.response?.data?.message ||
//           error.response?.data?.error ||
//           "Failed to add item. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       {/* Error message */}
//       {error && (
//         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
//           <p>{error}</p>
//         </div>
//       )}

//       {/* Success message */}
//       {success && (
//         <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
//           <p>{success}</p>
//         </div>
//       )}

//       {/* Rest of your component remains the same */}
//       <div className="bg-white h-[80vh] rounded-lg shadow-lg">
//         {/* Header */}
//         <div className="flex items-center justify-between bg-teal-800 text-white p-4 rounded-t-lg">
//           <div className="flex gap-6 items-center">
//             <h2 className="text-2xl font-semibold">Add Item</h2>
//             {/* Toggle: Product / Service */}
//             <div className="flex items-center space-x-4 bg-teal-800 text-white">
//               <span>Product</span>
//               <div
//                 className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
//                   enabled ? "bg-teal-500" : ""
//                 }`}
//                 onClick={() => setEnabled(!enabled)}
//               >
//                 <div
//                   className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
//                     enabled ? "translate-x-5" : "translate-x-0"
//                   }`}
//                 ></div>
//               </div>
//               <span>Service</span>
//             </div>
//           </div>
//           <button className="text-white" onClick={onClose}>
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Form Fields */}
//         <div className="p-6">
//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-4 gap-4 items-center">
//               <div className="relative w-full">
//                 <label className="absolute -top-3 left-2 bg-white px-1 text-teal-700 font-medium">
//                   Item Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={itemName}
//                   onChange={(e) => setItemName(e.target.value)}
//                   className="w-full border border-gray-500 rounded-md py-2 px-3 outline-none focus:ring-0 focus:border-teal-600"
//                   required
//                 />
//               </div>

//               <div className="relative w-full">
//                 <label className="absolute -top-3 left-2 bg-white px-1 text-teal-700 font-medium">
//                   Category <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={category}
//                   onChange={(e) => setCategory(e.target.value)}
//                   className="w-full border border-gray-500 rounded-md py-2 px-3 outline-none focus:ring-0 focus:border-teal-600"
//                   required
//                 >
//                   <option value="">Select</option>
//                   <option value="Medication">Medications</option>
//                   <option value="Consumables">Consumables</option>
//                   <option value="Generals">Generals</option>
//                 </select>
//               </div>

//               <button type="button" className="bg-teal-500 text-white px-4 py-2 rounded">
//                 Select Units
//               </button>

//               {/* Image Upload */}
//               <label className="flex items-center space-x-1 text-gray-700 cursor-pointer">
//                 <ImagePlus size={18} />
//                 <span>Add Image</span>
//                 <input type="file" className="hidden" onChange={handleImageUpload} />
//               </label>
//             </div>

//             {imagePreview && (
//               <div className="mt-2">
//                 <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-md" />
//               </div>
//             )}

//             {/* Buttons Section */}
//             <div className="flex items-center mt-4 space-x-4">
//               <div className="flex border border-gray-600 rounded px-3 py-1 items-center">
//                 <span className="text-gray-700 mr-2">Item Code</span>
//                 <button type="button" className="bg-teal-500 text-white px-3 py-1 rounded" onClick={generateItemCode}>
//                   Generate
//                 </button>
//               </div>
//               {itemCode && <span className="text-teal-700 font-medium">{itemCode}</span>}
//             </div>

//             {/* Stock Section */}
//             <div className="w-full p-4">
//               <div className="flex items-center border-b border-gray-400 pb-1">
//                 <h2 className="text-lg font-semibold text-gray-700">Stock</h2>
//               </div>

//               <div className="grid grid-cols-2 gap-6 mt-4">
//                 <div className="space-y-4">
//                   <div className="flex items-center space-x-4">
//                     <label className="w-48 text-gray-600 font-medium">Opening Quantity</label>
//                     <input
//                       type="number"
//                       value={openingQty}
//                       onChange={(e) => setOpeningQty(e.target.value)}
//                       className="border border-gray-400 rounded-md px-3 py-2 w-40 focus:border-teal-500 outline-none"
//                     />
//                   </div>

//                   <div className="flex items-center space-x-4">
//                     <label className="w-48 text-gray-600 font-medium">Min Stock To Maintain</label>
//                     <input
//                       type="number"
//                       value={minStock}
//                       onChange={(e) => setMinStock(e.target.value)}
//                       className="border border-gray-400 rounded-md px-3 py-2 w-40 focus:border-teal-500 outline-none"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex items-center space-x-4">
//                   <label className="text-gray-600 font-medium">As Of Date</label>
//                   <input
//                     type="date"
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                     className="border border-gray-400 rounded-md px-3 py-2 w-40 focus:border-teal-500 outline-none"
//                   />
//                 </div>
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="bg-teal-600 text-white px-6 py-2 rounded-md mt-4"
//               disabled={loading}
//             >
//               {loading ? "Saving..." : "Save Item"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddItems;


// import React, { useState, useRef } from "react";
// import { ImagePlus, X } from "lucide-react";
// import axios from "axios";

// const AddItems = ({ onClose, onItemAdded }) => {
//   // Form state
//   const [formData, setFormData] = useState({
//     itemName: "",
//     category: "",
//     openingQty: "",
//     minStock: "",
//     date: new Date().toISOString().split("T")[0],
//     itemCode: "",
//   });
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState("");
  
//   // UI state
//   const [enabled, setEnabled] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [validationErrors, setValidationErrors] = useState({});
  
//   // Refs
//   const fileInputRef = useRef(null);

//   // Generate random item code
//   const generateItemCode = () => {
//     const code = `ITEM-${Math.floor(1000 + Math.random() * 9000)}`;
//     setFormData(prev => ({ ...prev, itemCode: code }));
//   };

//   // Handle image upload
//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       // Validate image type and size
//       if (!file.type.match('image.*')) {
//         setError("Please select an image file");
//         return;
//       }
//       if (file.size > 2 * 1024 * 1024) { // 2MB limit
//         setError("Image size should be less than 2MB");
//         return;
//       }
      
//       setImage(file);
//       setImagePreview(URL.createObjectURL(file));
//       setError(null);
//     }
//   };

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Clear validation error when field is edited
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({ ...prev, [name]: null }));
//     }
//   };

//   // Validate form
//   const validateForm = () => {
//     const errors = {};
    
//     if (!formData.itemName.trim()) {
//       errors.itemName = "Item name is required";
//     }
    
//     if (!formData.category) {
//       errors.category = "Category is required";
//     }
    
//     if (formData.openingQty && isNaN(formData.openingQty)) {
//       errors.openingQty = "Must be a valid number";
//     }
    
//     if (formData.minStock && isNaN(formData.minStock)) {
//       errors.minStock = "Must be a valid number";
//     }
    
//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate form
//     if (!validateForm()) {
//       return;
//     }
    
//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       const formDataToSend = new FormData();
      
//       // Append all form data
//       Object.entries(formData).forEach(([key, value]) => {
//         if (value) formDataToSend.append(key, value);
//       });
      
//       // Set default values
//       if (!formData.openingQty) formDataToSend.append("openingQty", "0");
//       if (!formData.minStock) formDataToSend.append("minStock", "0");
//       if (!formData.itemCode) formDataToSend.append("itemCode", `ITEM-${Date.now()}`);
      
//       if (image) formDataToSend.append("image", image);

//       const response = await axios.post("/api/items", formDataToSend, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         timeout: 10000, // 10 second timeout
//       });

//       // Handle success
//       setSuccess("Item added successfully!");
      
//       // Reset form
//       setFormData({
//         itemName: "",
//         category: "",
//         openingQty: "",
//         minStock: "",
//         date: new Date().toISOString().split("T")[0],
//         itemCode: "",
//       });
//       setImage(null);
//       setImagePreview("");
//       if (fileInputRef.current) fileInputRef.current.value = "";

//       // Notify parent
//       if (onItemAdded) {
//         onItemAdded(response.data);
//       }

//       // Auto-close after delay if needed
//       if (onClose) {
//         setTimeout(onClose, 2000);
//       }

//     } catch (error) {
//       console.error("API Error:", {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//       });

//       // Set appropriate error message
//       const errorMessage = error.response?.data?.message || 
//                          error.response?.data?.error || 
//                          error.message || 
//                          "Failed to add item. Please try again.";
      
//       setError(errorMessage);
      
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative">
//       {/* Error message */}
//       {error && (
//         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
//           <p>{error}</p>
//         </div>
//       )}

//       {/* Success message */}
//       {success && (
//         <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
//           <p>{success}</p>
//         </div>
//       )}

//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         {/* Header */}
//         <div className="flex items-center justify-between bg-teal-800 text-white p-4">
//           <div className="flex gap-6 items-center">
//             <h2 className="text-2xl font-semibold">Add Item</h2>
//             <div className="flex items-center space-x-4">
//               <span>Product</span>
//               <button
//                 type="button"
//                 className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
//                   enabled ? "bg-teal-500" : "bg-gray-300"
//                 }`}
//                 onClick={() => setEnabled(!enabled)}
//               >
//                 <div
//                   className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
//                     enabled ? "translate-x-5" : "translate-x-0"
//                   }`}
//                 />
//               </button>
//               <span>Service</span>
//             </div>
//           </div>
//           <button 
//             onClick={onClose}
//             className="p-1 rounded-full hover:bg-teal-700 transition-colors"
//             disabled={loading}
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Form Fields */}
//         <div className="p-6">
//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
//               {/* Item Name */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Item Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="itemName"
//                   value={formData.itemName}
//                   onChange={handleChange}
//                   className={`w-full border rounded-md py-2 px-3 outline-none ${
//                     validationErrors.itemName ? "border-red-500" : "border-gray-300 focus:border-teal-600"
//                   }`}
//                 />
//                 {validationErrors.itemName && (
//                   <p className="mt-1 text-sm text-red-600">{validationErrors.itemName}</p>
//                 )}
//               </div>

//               {/* Category */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Category <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   className={`w-full border rounded-md py-2 px-3 outline-none ${
//                     validationErrors.category ? "border-red-500" : "border-gray-300 focus:border-teal-600"
//                   }`}
//                 >
//                   <option value="">Select Category</option>
//                   <option value="Medication">Medications</option>
//                   <option value="Consumables">Consumables</option>
//                   <option value="Generals">Generals</option>
//                 </select>
//                 {validationErrors.category && (
//                   <p className="mt-1 text-sm text-red-600">{validationErrors.category}</p>
//                 )}
//               </div>

//               {/* Units Button */}
//               <div className="flex items-end">
//                 <button 
//                   type="button" 
//                   className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded transition-colors"
//                 >
//                   Select Units
//                 </button>
//               </div>

//               {/* Image Upload */}
//               <div className="relative">
//                 <label className="flex items-center space-x-2 text-gray-700 cursor-pointer">
//                   <ImagePlus size={18} />
//                   <span className="text-sm font-medium">Add Image</span>
//                   <input 
//                     type="file" 
//                     ref={fileInputRef}
//                     className="hidden" 
//                     onChange={handleImageUpload}
//                     accept="image/*"
//                   />
//                 </label>
//                 {imagePreview && (
//                   <div className="mt-2 flex items-center space-x-2">
//                     <img 
//                       src={imagePreview} 
//                       alt="Preview" 
//                       className="h-16 w-16 object-cover rounded-md border border-gray-300"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setImage(null);
//                         setImagePreview("");
//                         if (fileInputRef.current) fileInputRef.current.value = "";
//                       }}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       <X size={16} />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Item Code Section */}
//             <div className="flex items-center mt-6 space-x-4">
//               <div className="flex border border-gray-300 rounded px-3 py-1.5 items-center">
//                 <span className="text-gray-700 mr-2 text-sm">Item Code</span>
//                 <button 
//                   type="button" 
//                   onClick={generateItemCode}
//                   className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded text-sm transition-colors"
//                 >
//                   Generate
//                 </button>
//               </div>
//               {formData.itemCode && (
//                 <span className="text-teal-700 font-medium">{formData.itemCode}</span>
//               )}
//             </div>

//             {/* Stock Section */}
//             <div className="mt-6 border-t border-gray-200 pt-4">
//               <h2 className="text-lg font-semibold text-gray-700 mb-4">Stock Information</h2>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Opening Quantity */}
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Opening Quantity
//                   </label>
//                   <input
//                     type="number"
//                     name="openingQty"
//                     value={formData.openingQty}
//                     onChange={handleChange}
//                     min="0"
//                     className={`w-full border rounded-md py-2 px-3 outline-none ${
//                       validationErrors.openingQty ? "border-red-500" : "border-gray-300 focus:border-teal-600"
//                     }`}
//                   />
//                   {validationErrors.openingQty && (
//                     <p className="mt-1 text-sm text-red-600">{validationErrors.openingQty}</p>
//                   )}
//                 </div>

//                 {/* Min Stock */}
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Min Stock To Maintain
//                   </label>
//                   <input
//                     type="number"
//                     name="minStock"
//                     value={formData.minStock}
//                     onChange={handleChange}
//                     min="0"
//                     className={`w-full border rounded-md py-2 px-3 outline-none ${
//                       validationErrors.minStock ? "border-red-500" : "border-gray-300 focus:border-teal-600"
//                     }`}
//                   />
//                   {validationErrors.minStock && (
//                     <p className="mt-1 text-sm text-red-600">{validationErrors.minStock}</p>
//                   )}
//                 </div>

//                 {/* Date */}
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     As Of Date
//                   </label>
//                   <input
//                     type="date"
//                     name="date"
//                     value={formData.date}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-teal-600"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="mt-8">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`w-full md:w-auto px-6 py-2 rounded-md text-white font-medium ${
//                   loading ? "bg-teal-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"
//                 } transition-colors`}
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center">
//                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Saving...
//                   </span>
//                 ) : "Save Item"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddItems;
