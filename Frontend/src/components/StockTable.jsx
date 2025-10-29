// // import React, { useState } from "react";
// // import { MoreVertical } from "lucide-react";

// // const StockTable = ({
// //   items,
// //   onItemDelete, // expects item object, parent handles confirm
// //   onEditName, // expects item object, parent will open EditNameModal
// // }) => {
// //   const [openDropdownId, setOpenDropdownId] = useState(null);

// //   const toggleDropdown = (id) => {
// //     setOpenDropdownId((prev) => (prev === id ? null : id));
// //   };

// //   return (
// //     <div className="bg-white shadow-sm rounded-lg overflow-hidden">
// //       <table className="min-w-full divide-y divide-gray-200">
// //         <thead className="bg-gray-50">
// //           <tr>
// //             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
// //               Item Name
// //             </th>
// //             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
// //               Current Stock
// //             </th>
// //             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
// //               Status
// //             </th>
// //             <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
// //               Actions
// //             </th>
// //           </tr>
// //         </thead>
// //         <tbody className="bg-white divide-y divide-gray-200">
// //           {items.length > 0 ? (
// //             items.map((item) => {
// //               const isOutOfStock =
// //                 item.openingQty === 0 || item.openingQty === null || item.openingQty === undefined;
// //               const isLowStock = !isOutOfStock && item.openingQty <= (item.minStock ?? 0);

// //               return (
// //                 <tr key={item._id} className="hover:bg-gray-50">
// //                   <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
// //                     {item.name || item.itemName}
// //                   </td>

// //                   <td className="px-6 py-4 whitespace-nowrap text-gray-700">
// //                     {item.openingQty ?? 0}
// //                   </td>

// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     {isOutOfStock ? (
// //                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
// //                         Out of Stock
// //                       </span>
// //                     ) : isLowStock ? (
// //                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
// //                         Low Stock
// //                       </span>
// //                     ) : (
// //                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
// //                         In Stock
// //                       </span>
// //                     )}
// //                   </td>

// //                   <td className="px-6 py-4 whitespace-nowrap text-center relative">
// //                     {/* Three-dot trigger */}
// //                     <button
// //                       onClick={() => toggleDropdown(item._id)}
// //                       className="inline-flex items-center p-2 rounded hover:bg-gray-100 focus:outline-none"
// //                     >
// //                       <MoreVertical size={18} />
// //                     </button>

// //                     {/* Dropdown */}
// //                     {openDropdownId === item._id && (
// //                       <div
// //                         className="absolute right-4 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-50"
// //                         onMouseLeave={() => setOpenDropdownId(null)}
// //                       >
// //                         <button
// //                           onClick={() => {
// //                             setOpenDropdownId(null);
// //                             onEditName(item);
// //                           }}
// //                           className="w-full text-left px-4 py-2 hover:bg-gray-50"
// //                         >
// //                           Edit Name
// //                         </button>

// //                         <button
// //                           onClick={() => {
// //                             setOpenDropdownId(null);
// //                             onItemDelete(item);
// //                           }}
// //                           className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
// //                         >
// //                           Delete Item
// //                         </button>
// //                       </div>
// //                     )}
// //                   </td>
// //                 </tr>
// //               );
// //             })
// //           ) : (
// //             <tr>
// //               <td colSpan="4" className="px-6 py-4 text-center text-gray-500 italic">
// //                 No items available
// //               </td>
// //             </tr>
// //           )}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export default StockTable;


// import React, { useState } from "react";
// import { MoreVertical } from "lucide-react";

// export default function StockTable({ items, onItemDelete, onEditName }) {
//   const [open, setOpen] = useState(null);

//   return (
//     <div className="bg-white shadow-sm rounded-lg overflow-hidden">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//               Item Name
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//               Current Stock
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//               Status
//             </th>
//             <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {items.length ? (
//             items.map((it) => {
//               const out = it.openingQty == null || it.openingQty === 0;
//               const low = !out && it.openingQty <= (it.minStock ?? 0);
//               return (
//                 <tr key={it._id} className="hover:bg-gray-50 relative">
//                   <td className="px-6 py-4">{it.name || it.itemName}</td>
//                   <td className="px-6 py-4">{it.openingQty ?? 0}</td>
//                   <td className="px-6 py-4">
//                     {out ? (
//                       <span className="text-red-600 font-medium text-sm">Out of Stock</span>
//                     ) : low ? (
//                       <span className="text-yellow-600 font-medium text-sm">Low Stock</span>
//                     ) : (
//                       <span className="text-green-600 font-medium text-sm">In Stock</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 text-center">
//                     <button
//                       onClick={() => setOpen(open === it._id ? null : it._id)}
//                       className="p-2 hover:bg-gray-100 rounded"
//                     >
//                       <MoreVertical size={18} />
//                     </button>
//                     {open === it._id && (
//                       <div className="absolute right-6 bg-white border rounded shadow-md mt-1 z-10">
//                         <button
//                           onClick={() => {
//                             setOpen(null);
//                             onEditName(it);
//                           }}
//                           className="block w-full text-left px-4 py-2 hover:bg-gray-50"
//                         >
//                           Edit Name
//                         </button>
//                         <button
//                           onClick={() => {
//                             setOpen(null);
//                             onItemDelete(it);
//                           }}
//                           className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
//                         >
//                           Delete Item
//                         </button>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })
//           ) : (
//             <tr>
//               <td colSpan="4" className="px-6 py-4 text-center text-gray-500 italic">
//                 No items available
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }


// import React, { useState } from "react";
// import { MoreVertical } from "lucide-react";

// export default function StockTable({ items, onItemDelete, onEditName }) {
//   const [open, setOpen] = useState(null);

//   return (
//     <div className="bg-white shadow-sm rounded-lg overflow-hidden">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//               Item Name
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//               Current Stock
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//               Status
//             </th>
//             <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {items.length ? (
//             items.map((it, index) => {
//               const out = it.openingQty == null || it.openingQty === 0;
//               const low = !out && it.openingQty <= (it.minStock ?? 0);
//               const isLast = index === items.length - 1;

//               return (
//                 <tr key={it._id} className="hover:bg-gray-50 relative">
//                   <td className="px-6 py-4">{it.name || it.itemName}</td>
//                   <td className="px-6 py-4">{it.openingQty ?? 0}</td>
//                   <td className="px-6 py-4">
//                     {out ? (
//                       <span className="text-red-600 font-medium text-sm">Out of Stock</span>
//                     ) : low ? (
//                       <span className="text-yellow-600 font-medium text-sm">Low Stock</span>
//                     ) : (
//                       <span className="text-green-600 font-medium text-sm">In Stock</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 text-center">
//                     <button
//                       onClick={() => setOpen(open === it._id ? null : it._id)}
//                       className="p-2 hover:bg-gray-100 rounded"
//                     >
//                       <MoreVertical size={18} />
//                     </button>
//                     {open === it._id && (
//                       <div
//                         className={`absolute right-6 ${
//                           isLast ? "bottom-full mb-1" : "mt-1"
//                         } bg-white border rounded shadow-md z-10`}
//                       >
//                         <button
//                           onClick={() => {
//                             setOpen(null);
//                             onEditName(it);
//                           }}
//                           className="block w-full text-left px-4 py-2 hover:bg-gray-50"
//                         >
//                           Edit Name
//                         </button>
//                         <button
//                           onClick={() => {
//                             setOpen(null);
//                             onItemDelete(it);
//                           }}
//                           className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
//                         >
//                           Delete Item
//                         </button>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })
//           ) : (
//             <tr>
//               <td colSpan="4" className="px-6 py-4 text-center text-gray-500 italic">
//                 No items available
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }


// import React, { useState,RefObject, useEffect, useRef } from "react";
// import { MoreVertical } from "lucide-react";

// /**
//  * StockTable.jsx
//  * - Compact three-dot action per row
//  * - Dropdown is FIXED (escapes container), always opens upward above the button
//  * - Fade + slide animation
//  * - Click outside / ESC closes the menu
//  * - Never clipped (positions within viewport horizontally)
//  */

// export default function StockTable({ items = [], onItemDelete, onEditName }) {
//   const [openId, setOpenId] = useState(null);
//   const [coords, setCoords] = useState({ top: 0, left: 0 }); // fixed-position coords for dropdown
//   const dropdownRef = useRef(null);
//   const buttonRectsRef = useRef({}); // cache last button rect per id

//   // open menu: compute coords and show
//   const handleOpen = (e, itemId) => {
//     e.stopPropagation();
//     const btn = e.currentTarget;
//     const rect = btn.getBoundingClientRect();
//     buttonRectsRef.current[itemId] = rect;

//     // initial guess for dropdown width/height
//     const DROPDOWN_WIDTH = 160;
//     const DROPDOWN_HEIGHT_EST = 96; // initial estimate; adjusted after mount

//     // compute left inside viewport
//     let left = rect.right - DROPDOWN_WIDTH;
//     // ensure left >= 8 and dropdown fits
//     left = Math.max(8, Math.min(left, window.innerWidth - DROPDOWN_WIDTH - 8));

//     // compute top to place *above* button (always upward)
//     let top = rect.top - DROPDOWN_HEIGHT_EST - 8;
//     // ensure top at least 8 (if very near top, clamp so it's visible)
//     top = Math.max(8, top);

//     setCoords({ top, left });
//     setOpenId(openId === itemId ? null : itemId);
//   };

//   // adjust position after dropdown mounts so we can use real height
//   useEffect(() => {
//     if (!openId) return;
//     const rect = buttonRectsRef.current[openId];
//     if (!rect) return;

//     const dd = dropdownRef.current;
//     if (!dd) return;

//     const ddRect = dd.getBoundingClientRect();
//     const DROPDOWN_WIDTH = ddRect.width;
//     const DROPDOWN_HEIGHT = ddRect.height;

//     // recompute left (fit within viewport)
//     let left = rect.right - DROPDOWN_WIDTH;
//     left = Math.max(8, Math.min(left, window.innerWidth - DROPDOWN_WIDTH - 8));

//     // always above: top = rect.top - ddHeight - 8
//     let top = rect.top - DROPDOWN_HEIGHT - 8;
//     top = Math.max(8, top);

//     // If top would overlap the top of viewport and there's no space above whatsoever,
//     // as a last resort place it just below the button but keep it fixed so not clipped.
//     if (top < 8 && rect.bottom + DROPDOWN_HEIGHT + 8 < window.innerHeight) {
//       top = rect.bottom + 8;
//     }

//     setCoords({ top, left });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [openId]);

//   // close on outside click or ESC
//   useEffect(() => {
//     const handleDocClick = () => setOpenId(null);
//     const handleEsc = (ev) => {
//       if (ev.key === "Escape") setOpenId(null);
//     };
//     document.addEventListener("click", handleDocClick);
//     document.addEventListener("keydown", handleEsc);
//     return () => {
//       document.removeEventListener("click", handleDocClick);
//       document.removeEventListener("keydown", handleEsc);
//     };
//   }, []);

//   // stop propagation so clicking inside dropdown doesn't close it
//   const stopProp = (e) => {
//     e.stopPropagation();
//   };

//   return (
//     <div className="bg-white shadow-sm rounded-lg overflow-hidden">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//               Item Name
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//               Current Stock
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//               Status
//             </th>
//             <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
//               Actions
//             </th>
//           </tr>
//         </thead>

//         <tbody className="bg-white divide-y divide-gray-200">
//           {items.length ? (
//             items.map((it, index) => {
//               const out = it.openingQty == null || it.openingQty === 0;
//               const low = !out && it.openingQty <= (it.minStock ?? 0);

//               return (
//                 <tr key={it._id} className="hover:bg-gray-50 relative">
//                   <td className="px-6 py-4">{it.name || it.itemName}</td>
//                   <td className="px-6 py-4">{it.openingQty ?? 0}</td>
//                   <td className="px-6 py-4">
//                     {out ? (
//                       <span className="text-red-600 font-medium text-sm">Out of Stock</span>
//                     ) : low ? (
//                       <span className="text-yellow-600 font-medium text-sm">Low Stock</span>
//                     ) : (
//                       <span className="text-green-600 font-medium text-sm">In Stock</span>
//                     )}
//                   </td>

//                   <td className="px-6 py-4 text-center">
//                     {/* three-dot button */}
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleOpen(e, it._id);
//                       }}
//                       className="p-2 hover:bg-gray-100 rounded"
//                       aria-haspopup="true"
//                       aria-expanded={openId === it._id}
//                     >
//                       <MoreVertical size={18} />
//                     </button>

//                     {/* floating fixed-position dropdown (escapes container) */}
//                     {openId === it._id && (
//                       <div
//                         ref={dropdownRef}
//                         onClick={stopProp}
//                         style={{
//                           position: "fixed",
//                           top: coords.top,
//                           left: coords.left,
//                           width: 160,
//                           zIndex: 9999,
//                           // animation: fade + slide up (we slide slightly from +6px -> 0)
//                           transition: "transform 160ms cubic-bezier(.2,.9,.2,1), opacity 160ms",
//                           transform: "translateY(0)",
//                           opacity: 1,
//                         }}
//                         className="bg-white border rounded-md shadow-lg overflow-hidden"
//                       >
//                         <div className="flex flex-col">
//                           <button
//                             onClick={() => {
//                               setOpenId(null);
//                               onEditName(it);
//                             }}
//                             className="w-full text-left px-4 py-2 hover:bg-gray-50"
//                           >
//                             Edit Name
//                           </button>

//                           <button
//                             onClick={() => {
//                               setOpenId(null);
//                               onItemDelete(it);
//                             }}
//                             className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
//                           >
//                             Delete Item
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })
//           ) : (
//             <tr>
//               <td colSpan="4" className="px-6 py-4 text-center text-gray-500 italic">
//                 No items available
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";

/**
 * ✅ StockTable.jsx (Updated)
 * - Uses `onDeleteRequest(item)` to trigger confirmation modal
 * - Keeps same animation & positioning logic
 * - Clean, stable, and fully synced with GeneralPage
 */

export default function StockTable({ items = [], onDeleteRequest, onEditName }) {
  const [openId, setOpenId] = useState(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const buttonRectsRef = useRef({});

  // Open dropdown & compute position
  const handleOpen = (e, itemId) => {
    e.stopPropagation();
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    buttonRectsRef.current[itemId] = rect;

    const DROPDOWN_WIDTH = 160;
    const DROPDOWN_HEIGHT_EST = 96;

    let left = rect.right - DROPDOWN_WIDTH;
    left = Math.max(8, Math.min(left, window.innerWidth - DROPDOWN_WIDTH - 8));

    let top = rect.top - DROPDOWN_HEIGHT_EST - 8;
    top = Math.max(8, top);

    setCoords({ top, left });
    setOpenId(openId === itemId ? null : itemId);
  };

  // Adjust position after dropdown mounts
  useEffect(() => {
    if (!openId) return;
    const rect = buttonRectsRef.current[openId];
    if (!rect) return;

    const dd = dropdownRef.current;
    if (!dd) return;

    const ddRect = dd.getBoundingClientRect();
    const DROPDOWN_WIDTH = ddRect.width;
    const DROPDOWN_HEIGHT = ddRect.height;

    let left = rect.right - DROPDOWN_WIDTH;
    left = Math.max(8, Math.min(left, window.innerWidth - DROPDOWN_WIDTH - 8));

    let top = rect.top - DROPDOWN_HEIGHT - 8;
    top = Math.max(8, top);

    if (top < 8 && rect.bottom + DROPDOWN_HEIGHT + 8 < window.innerHeight) {
      top = rect.bottom + 8;
    }

    setCoords({ top, left });
  }, [openId]);

  // Close on outside click or ESC
  useEffect(() => {
    const handleDocClick = () => setOpenId(null);
    const handleEsc = (ev) => ev.key === "Escape" && setOpenId(null);

    document.addEventListener("click", handleDocClick);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("click", handleDocClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const stopProp = (e) => e.stopPropagation();

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Item Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Current Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {items.length ? (
            items.map((it) => {
              const out = it.openingQty == null || it.openingQty === 0;
              const low = !out && it.openingQty <= (it.minStock ?? 0);

              return (
                <tr key={it._id} className="hover:bg-gray-50 relative">
                  <td className="px-6 py-4">{it.name || it.itemName}</td>
                  <td className="px-6 py-4">{it.openingQty ?? 0}</td>
                  <td className="px-6 py-4">
                    {out ? (
                      <span className="text-red-600 font-medium text-sm">
                        Out of Stock
                      </span>
                    ) : low ? (
                      <span className="text-yellow-600 font-medium text-sm">
                        Low Stock
                      </span>
                    ) : (
                      <span className="text-green-600 font-medium text-sm">
                        In Stock
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {/* three-dot button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpen(e, it._id);
                      }}
                      className="p-2 hover:bg-gray-100 rounded"
                      aria-haspopup="true"
                      aria-expanded={openId === it._id}
                    >
                      <MoreVertical size={18} />
                    </button>

                    {/* floating dropdown */}
                    {openId === it._id && (
                      <div
                        ref={dropdownRef}
                        onClick={stopProp}
                        style={{
                          position: "fixed",
                          top: coords.top,
                          left: coords.left,
                          width: 160,
                          zIndex: 9999,
                          transition:
                            "transform 160ms cubic-bezier(.2,.9,.2,1), opacity 160ms",
                          transform: "translateY(0)",
                          opacity: 1,
                        }}
                        className="bg-white border rounded-md shadow-lg overflow-hidden"
                      >
                        <div className="flex flex-col">
                          <button
                            onClick={() => {
                              setOpenId(null);
                              onEditName(it);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50"
                          >
                            Edit Name
                          </button>

                          <button
                            onClick={() => {
                              setOpenId(null);
                              onDeleteRequest(it);
                            }}
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                          >
                            Delete Item
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan="4"
                className="px-6 py-4 text-center text-gray-500 italic"
              >
                No items available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
