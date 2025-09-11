// import React, { useContext, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   Home,
//   Box,
//   Plus,
//   BarChart,
//   Settings,
//   LogOut,
//   Search,
//   Menu,
//   ChevronLeft,
//   ChevronDown,
//   ChevronRight,
//   Pill,
//   Syringe,
//   ShoppingBasket,
//   Minus,
//   Thermometer,
//   HeartPulse,
//   Droplet
// } from "lucide-react";
// import { UserContext } from "../context/UserContext";
// import "bootstrap/dist/css/bootstrap.min.css";

// const Sidebar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [isInventoryOpen, setIsInventoryOpen] = useState(false);
//   const { logout } = useContext(UserContext);

//   const isActive = (path) => location.pathname === path;

//   const toggleInventory = () => {
//     setIsInventoryOpen(!isInventoryOpen);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <div
//       className={`d-flex flex-column bg-light shadow-sm border-end vh-100 transition-all`}
//       style={{ width: isCollapsed ? "4rem" : "16rem" }}
//     >
//       {/* Sidebar Header */}
//       <div className="d-flex align-items-center justify-content-between p-3 bg-teal-600 text-white">
//         {!isCollapsed && <h5 className="m-0">Dashboard</h5>}
//         <button
//           className="btn btn-sm btn-light"
//           onClick={() => setIsCollapsed(!isCollapsed)}
//         >
//           {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
//         </button>
//       </div>

//       {/* Search Bar */}
//       <div className={`p-2 ${isCollapsed ? "d-none" : ""}`}>
//         <div className="input-group">
//           <span className="input-group-text">
//             <Search size={16} />
//           </span>
//           <input type="text" className="form-control" placeholder="Search" />
//         </div>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-grow-1">
//         <ul className="list-unstyled p-2">
//           {/* Dashboard */}
//           <li className="mb-2">
//             <Link
//               to="/dashboard"
//               className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//                 isActive("/dashboard") ? "bg-teal-600 text-white" : "text-dark"
//               } ${isCollapsed ? "justify-content-center" : "gap-2"}`}
//             >
//               <Home size={18} />
//               {!isCollapsed && <span>Dashboard</span>}
//             </Link>
//           </li>

//           {/* Inventory - Collapsible Section */}
//           <li className="mb-2">
//             <button
//               onClick={toggleInventory}
//               className={`d-flex align-items-center p-2 w-100 text-decoration-none rounded ${
//                 isActive("/dashboard/inventory") ||
//                 isActive("/dashboard/inventory/medication") ||
//                 isActive("/dashboard/inventory/consumables") ||
//                 isActive("/dashboard/inventory/general") ||
//                 isActive("/dashboard/inventory/aparatus") ||
//                 isActive("/dashboard/inventory/skincare") ||
//                 isActive("/dashboard/inventory/medication-fridge")
//                   ? "bg-teal-600 text-white"
//                   : "text-dark"
//               } ${isCollapsed ? "justify-content-center" : "gap-2"}`}
//             >
//               <Box size={18} />
//               {!isCollapsed && (
//                 <>
//                   <span className="flex-grow-1 text-start">Inventory</span>
//                   {isInventoryOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//                 </>
//               )}
//             </button>

//             {/* Inventory Sub-items */}
//             {!isCollapsed && isInventoryOpen && (
//               <ul className="list-unstyled ps-4 mt-2">
//                 <li className="mb-1">
//                   <Link
//                     to="/dashboard/inventory/medication"
//                     className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//                       isActive("/dashboard/inventory/medication") ? "bg-teal-500 text-white" : "text-dark"
//                     } gap-2`}
//                   >
//                     <Pill size={16} />
//                     <span>Medication</span>
//                   </Link>
//                 </li>
//                 <li className="mb-1">
//                   <Link
//                     to="/dashboard/inventory/consumables"
//                     className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//                       isActive("/dashboard/inventory/consumables") ? "bg-teal-500 text-white" : "text-dark"
//                     } gap-2`}
//                   >
//                     <Syringe size={16} />
//                     <span>Consumables</span>
//                   </Link>
//                 </li>
//                 <li className="mb-1">
//                   <Link
//                     to="/dashboard/inventory/general"
//                     className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//                       isActive("/dashboard/inventory/general") ? "bg-teal-500 text-white" : "text-dark"
//                     } gap-2`}
//                   >
//                     <ShoppingBasket size={16} />
//                     <span>General</span>
//                   </Link>
//                 </li>
//                 {/* New Categories */}
//                 <li className="mb-1">
//                   <Link
//                     to="/dashboard/inventory/aparatus"
//                     className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//                       isActive("/dashboard/inventory/aparatus") ? "bg-teal-500 text-white" : "text-dark"
//                     } gap-2`}
//                   >
//                     <HeartPulse size={16} />
//                     <span>Aparatus</span>
//                   </Link>
//                 </li>
//                 <li className="mb-1">
//                   <Link
//                     to="/dashboard/inventory/skincare"
//                     className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//                       isActive("/dashboard/inventory/skincare") ? "bg-teal-500 text-white" : "text-dark"
//                     } gap-2`}
//                   >
//                     <Droplet size={16} />
//                     <span>Skin Care Products</span>
//                   </Link>
//                 </li>
//                 <li className="mb-1">
//                   <Link
//                     to="/dashboard/inventory/medication-fridge"
//                     className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//                       isActive("/dashboard/inventory/medication-fridge") ? "bg-teal-500 text-white" : "text-dark"
//                     } gap-2`}
//                   >
//                     <Thermometer size={16} />
//                     <span>Medication (Fridge)</span>
//                   </Link>
//                 </li>
//               </ul>
//             )}
//           </li>

//           {/* Other Menu Items */}
//           {[
//             { name: "Add Item", icon: <Plus size={18} />, path: "/dashboard/add-item" },
//             { name: "Adjust Stock", icon: <Minus size={18} />, path: "/dashboard/adjust-stock" },
//             { name: "Report", icon: <BarChart size={18} />, path: "/dashboard/report" },
//           ].map((item, index) => (
//             <li key={index} className="mb-2">
//               <Link
//                 to={item.path}
//                 className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//                   isActive(item.path) ? "bg-teal-600 text-white" : "text-dark"
//                 } ${isCollapsed ? "justify-content-center" : "gap-2"}`}
//               >
//                 {item.icon}
//                 {!isCollapsed && <span>{item.name}</span>}
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </nav>

//       {/* Divider */}
//       <div className="border-top my-2"></div>

//       {/* Settings & Logout */}
//       <ul className="list-unstyled p-2">
//         <li>
//           <Link
//             to="/dashboard/settings"
//             className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//               isActive("/dashboard/settings") ? "bg-primary text-white" : "text-dark"
//             } ${isCollapsed ? "justify-content-center" : "gap-2"}`}
//           >
//             <Settings size={18} />
//             {!isCollapsed && <span>Settings</span>}
//           </Link>
//         </li>

//         <li>
//           <button 
//             onClick={handleLogout}
//             className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
//           >
//             <LogOut size={18} />
//             {!isCollapsed && <span>Logout</span>}
//           </button>
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;


// import React, { useContext, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   Home,
//   Box,
//   Plus,
//   BarChart,
//   Settings,
//   LogOut,
//   Search,
//   Menu,
//   ChevronLeft,
//   ChevronDown,
//   ChevronRight,
//   Pill,
//   Syringe,
//   ShoppingBasket,
//   Minus,
//   Thermometer,
//   HeartPulse,
//   Droplet
// } from "lucide-react";
// import { UserContext } from "../context/UserContext";
// import "bootstrap/dist/css/bootstrap.min.css";

// const Sidebar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [isInventoryOpen, setIsInventoryOpen] = useState(false);
//   const { logout } = useContext(UserContext);

//   const isActive = (path) => location.pathname === path;

//   const toggleInventory = () => {
//     setIsInventoryOpen(!isInventoryOpen);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   // Fixed width values
//   const sidebarWidth = isCollapsed ? "64px" : "256px";

//   return (
//     <div
//       className="d-flex flex-column bg-light shadow-sm border-end vh-100 position-relative"
//       style={{
//         width: sidebarWidth,
//         minWidth: sidebarWidth,
//         maxWidth: sidebarWidth,
//         flexShrink: "0",
//         flexGrow: "0"
//       }}
//     >
//       {/* Sidebar Header */}
//       <div className="d-flex align-items-center justify-content-between p-3 bg-primary text-white">
//         {!isCollapsed && <h5 className="m-0">Dashboard</h5>}
//         <button
//           className="btn btn-sm btn-light"
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           type="button"
//         >
//           {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
//         </button>
//       </div>

//       {/* Search Bar */}
//       {!isCollapsed && (
//         <div className="p-2">
//           <div className="input-group">
//             <span className="input-group-text">
//               <Search size={16} />
//             </span>
//             <input type="text" className="form-control" placeholder="Search" />
//           </div>
//         </div>
//       )}

//       {/* Navigation */}
//       <nav className="flex-grow-1 overflow-hidden">
//         <ul className="list-unstyled p-2">
//           {/* Dashboard */}
//           <li className="mb-2">
//             <Link
//               to="/dashboard"
//               className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//                 isActive("/dashboard") ? "bg-primary text-white" : "text-dark"
//               } ${isCollapsed ? "justify-content-center" : "gap-2"}`}
//             >
//               <Home size={18} />
//               {!isCollapsed && <span>Dashboard</span>}
//             </Link>
//           </li>

//           {/* Inventory - Collapsible Section */}
//           <li className="mb-2">
//             <button
//               onClick={toggleInventory}
//               className={`btn d-flex align-items-center p-2 w-100 text-decoration-none rounded border-0 ${
//                 isActive("/dashboard/inventory") ||
//                 isActive("/dashboard/inventory/medication") ||
//                 isActive("/dashboard/inventory/consumables") ||
//                 isActive("/dashboard/inventory/general") ||
//                 isActive("/dashboard/inventory/aparatus") ||
//                 isActive("/dashboard/inventory/skincare") ||
//                 isActive("/dashboard/inventory/medication-fridge")
//                   ? "bg-primary text-white"
//                   : "text-dark bg-transparent"
//               } ${isCollapsed ? "justify-content-center" : "gap-2"}`}
//             >
//               <Box size={18} />
//               {!isCollapsed && (
//                 <>
//                   <span className="flex-grow-1 text-start">Inventory</span>
//                   {isInventoryOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//                 </>
//               )}
//             </button>

//             {/* Inventory Sub-items */}
//             {!isCollapsed && isInventoryOpen && (
//               <ul className="list-unstyled ps-4 mt-2">
//                 <li className="mb-1">
//                   <Link
//                     to="/dashboard/inventory/medication"
//                     className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//                       isActive("/dashboard/inventory/medication") ? "bg-info text-white" : "text-dark"
//                     } gap-2`}
//                   >
//                     <Pill size={16} />
//                     <span>Medication</span>
//                   </Link>
//                 </li>
//                 <li className="mb-1">
//                   <Link
//                     to="/dashboard/inventory/consumables"
//                     className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//                       isActive("/dashboard/inventory/consumables") ? "bg-info text-white" : "text-dark"
//                     } gap-2`}
//                   >
//                     <Syringe size={16} />
//                     <span>Consumables</span>
//                   </Link>
//                 </li>
//                 <li className="mb-1">
//                   <Link
//                     to="/dashboard/inventory/general"
//                     className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//                       isActive("/dashboard/inventory/general") ? "bg-info text-white" : "text-dark"
//                     } gap-2`}
//                   >
//                     <ShoppingBasket size={16} />
//                     <span>General</span>
//                   </Link>
//                 </li>
//                 <li className="mb-1">
//                   <Link
//                     to="/dashboard/inventory/aparatus"
//                     className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//                       isActive("/dashboard/inventory/aparatus") ? "bg-info text-white" : "text-dark"
//                     } gap-2`}
//                   >
//                     <HeartPulse size={16} />
//                     <span>Apparatus</span>
//                   </Link>
//                 </li>
//                 <li className="mb-1">
//                   <Link
//                     to="/dashboard/inventory/skincare"
//                     className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//                       isActive("/dashboard/inventory/skincare") ? "bg-info text-white" : "text-dark"
//                     } gap-2`}
//                   >
//                     <Droplet size={16} />
//                     <span>Skin Care Products</span>
//                   </Link>
//                 </li>
//                 <li className="mb-1">
//                   <Link
//                     to="/dashboard/inventory/medication-fridge"
//                     className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//                       isActive("/dashboard/inventory/medication-fridge") ? "bg-info text-white" : "text-dark"
//                     } gap-2`}
//                   >
//                     <Thermometer size={16} />
//                     <span>Medication (Fridge)</span>
//                   </Link>
//                 </li>
//               </ul>
//             )}
//           </li>

//           {/* Other Menu Items */}
//           {[
//             { name: "Add Item", icon: <Plus size={18} />, path: "/dashboard/add-item" },
//             { name: "Adjust Stock", icon: <Minus size={18} />, path: "/dashboard/adjust-stock" },
//             { name: "Report", icon: <BarChart size={18} />, path: "/dashboard/report" },
//           ].map((item, index) => (
//             <li key={index} className="mb-2">
//               <Link
//                 to={item.path}
//                 className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//                   isActive(item.path) ? "bg-primary text-white" : "text-dark"
//                 } ${isCollapsed ? "justify-content-center" : "gap-2"}`}
//               >
//                 {item.icon}
//                 {!isCollapsed && <span>{item.name}</span>}
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </nav>

//       {/* Divider */}
//       <div className="border-top my-2"></div>

//       {/* Settings & Logout */}
//       <ul className="list-unstyled p-2">
//         <li className="mb-2">
//           <Link
//             to="/dashboard/settings"
//             className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//               isActive("/dashboard/settings") ? "text-white" : "text-dark"
//             } ${isCollapsed ? "justify-content-center" : "gap-2"}`}
//             style={isActive("/dashboard/settings") ? { backgroundColor: "#0d9488" } : {}}
//           >
//             <Settings size={18} />
//             {!isCollapsed && <span>Settings</span>}
//           </Link>
//         </li>

//         <li>
//           <button 
//             onClick={handleLogout}
//             className={`btn btn-danger w-100 d-flex align-items-center justify-content-center ${
//               !isCollapsed ? "gap-2" : ""
//             }`}
//           >
//             <LogOut size={18} />
//             {!isCollapsed && <span>Logout</span>}
//           </button>
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;



// import React, { useContext, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   Home,
//   Box,
//   Plus,
//   BarChart,
//   Settings,
//   LogOut,
//   Search,
//   Menu,
//   ChevronLeft,
//   ChevronDown,
//   ChevronRight,
//   Pill,
//   Syringe,
//   ShoppingBasket,
//   Minus,
//   Thermometer,
//   HeartPulse,
//   Droplet
// } from "lucide-react";
// import { UserContext } from "../context/UserContext";
// import "bootstrap/dist/css/bootstrap.min.css";

// const Sidebar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [isInventoryOpen, setIsInventoryOpen] = useState(false);
//   const { logout } = useContext(UserContext);

//   const isActive = (path) => location.pathname === path;

//   const toggleInventory = () => {
//     setIsInventoryOpen(!isInventoryOpen);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   // Fixed width values
//   const sidebarWidth = isCollapsed ? "64px" : "256px";

//   // Tailwind teal-600 color
//   const teal600 = "#0d9488";

//   return (
//     <div
//       className="d-flex flex-column bg-light shadow-sm border-end vh-100 position-relative"
//       style={{
//         width: sidebarWidth,
//         minWidth: sidebarWidth,
//         maxWidth: sidebarWidth,
//         flexShrink: "0",
//         flexGrow: "0"
//       }}
//     >
//       {/* Sidebar Header */}
//       <div className="d-flex align-items-center justify-content-between p-3 text-white"
//         style={{ backgroundColor: teal600 }}>
//         {!isCollapsed && <h5 className="m-0">Dashboard</h5>}
//         <button
//           className="btn btn-sm btn-light"
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           type="button"
//         >
//           {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
//         </button>
//       </div>

//       {/* Search Bar */}
//       {!isCollapsed && (
//         <div className="p-2">
//           <div className="input-group">
//             <span className="input-group-text">
//               <Search size={16} />
//             </span>
//             <input type="text" className="form-control" placeholder="Search" />
//           </div>
//         </div>
//       )}

//       {/* Navigation */}
//       <nav className="flex-grow-1 overflow-hidden">
//         <ul className="list-unstyled p-2">
//           {/* Dashboard */}
//           <li className="mb-2">
//             <Link
//               to="/dashboard"
//               className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//                 isActive("/dashboard") ? "text-white" : "text-dark"
//               } ${isCollapsed ? "justify-content-center" : "gap-2"}`}
//               style={isActive("/dashboard") ? { backgroundColor: teal600 } : {}}
//             >
//               <Home size={18} />
//               {!isCollapsed && <span>Dashboard</span>}
//             </Link>
//           </li>

//           {/* Inventory - Collapsible Section */}
//           <li className="mb-2">
//             <button
//               onClick={toggleInventory}
//               className={`btn d-flex align-items-center p-2 w-100 text-decoration-none rounded border-0 ${
//                 isActive("/dashboard/inventory") ||
//                 isActive("/dashboard/inventory/medication") ||
//                 isActive("/dashboard/inventory/consumables") ||
//                 isActive("/dashboard/inventory/general") ||
//                 isActive("/dashboard/inventory/aparatus") ||
//                 isActive("/dashboard/inventory/skincare") ||
//                 isActive("/dashboard/inventory/medication-fridge")
//                   ? "text-white"
//                   : "text-dark bg-transparent"
//               } ${isCollapsed ? "justify-content-center" : "gap-2"}`}
//               style={
//                 isActive("/dashboard/inventory") ||
//                 isActive("/dashboard/inventory/medication") ||
//                 isActive("/dashboard/inventory/consumables") ||
//                 isActive("/dashboard/inventory/general") ||
//                 isActive("/dashboard/inventory/aparatus") ||
//                 isActive("/dashboard/inventory/skincare") ||
//                 isActive("/dashboard/inventory/medication-fridge")
//                   ? { backgroundColor: teal600 }
//                   : {}
//               }
//             >
//               <Box size={18} />
//               {!isCollapsed && (
//                 <>
//                   <span className="flex-grow-1 text-start">Inventory</span>
//                   {isInventoryOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//                 </>
//               )}
//             </button>

//             {/* Inventory Sub-items */}
//             {!isCollapsed && isInventoryOpen && (
//               <ul className="list-unstyled ps-4 mt-2">
//                 <li className="mb-1">
//                   <Link
//                     to="/dashboard/inventory/medication"
//                     className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//                       isActive("/dashboard/inventory/medication") ? "text-white" : "text-dark"
//                     } gap-2`}
//                     style={isActive("/dashboard/inventory/medication") ? { backgroundColor: teal600 } : {}}
//                   >
//                     <Pill size={16} />
//                     <span>Medication</span>
//                   </Link>
//                 </li>
//                 <li className="mb-1">
//                   <Link
//                     to="/dashboard/inventory/consumables"
//                     className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//                       isActive("/dashboard/inventory/consumables") ? "text-white" : "text-dark"
//                     } gap-2`}
//                     style={isActive("/dashboard/inventory/consumables") ? { backgroundColor: teal600 } : {}}
//                   >
//                     <Syringe size={16} />
//                     <span>Consumables</span>
//                   </Link>
//                 </li>
//                 <li className="mb-1">
//                   <Link
//                     to="/dashboard/inventory/general"
//                     className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//                       isActive("/dashboard/inventory/general") ? "text-white" : "text-dark"
//                     } gap-2`}
//                     style={isActive("/dashboard/inventory/general") ? { backgroundColor: teal600 } : {}}
//                   >
//                     <ShoppingBasket size={16} />
//                     <span>General</span>
//                   </Link>
//                 </li>
//                 <li className="mb-1">
//                   <Link
//                     to="/dashboard/inventory/aparatus"
//                     className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//                       isActive("/dashboard/inventory/aparatus") ? "text-white" : "text-dark"
//                     } gap-2`}
//                     style={isActive("/dashboard/inventory/aparatus") ? { backgroundColor: teal600 } : {}}
//                   >
//                     <HeartPulse size={16} />
//                     <span>Apparatus</span>
//                   </Link>
//                 </li>
//                 <li className="mb-1">
//                   <Link
//                     to="/dashboard/inventory/skincare"
//                     className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//                       isActive("/dashboard/inventory/skincare") ? "text-white" : "text-dark"
//                     } gap-2`}
//                     style={isActive("/dashboard/inventory/skincare") ? { backgroundColor: teal600 } : {}}
//                   >
//                     <Droplet size={16} />
//                     <span>Skin Care Products</span>
//                   </Link>
//                 </li>
//                 <li className="mb-1">
//                   <Link
//                     to="/dashboard/inventory/medication-fridge"
//                     className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//                       isActive("/dashboard/inventory/medication-fridge") ? "text-white" : "text-dark"
//                     } gap-2`}
//                     style={isActive("/dashboard/inventory/medication-fridge") ? { backgroundColor: teal600 } : {}}
//                   >
//                     <Thermometer size={16} />
//                     <span>Medication (Fridge)</span>
//                   </Link>
//                 </li>
//               </ul>
//             )}
//           </li>

//           {/* Other Menu Items */}
//           {[
//             { name: "Add Item", icon: <Plus size={18} />, path: "/dashboard/add-item" },
//             { name: "Adjust Stock", icon: <Minus size={18} />, path: "/dashboard/adjust-stock" },
//             { name: "Report", icon: <BarChart size={18} />, path: "/dashboard/report" },
//           ].map((item, index) => (
//             <li key={index} className="mb-2">
//               <Link
//                 to={item.path}
//                 className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//                   isActive(item.path) ? "text-white" : "text-dark"
//                 } ${isCollapsed ? "justify-content-center" : "gap-2"}`}
//                 style={isActive(item.path) ? { backgroundColor: teal600 } : {}}
//               >
//                 {item.icon}
//                 {!isCollapsed && <span>{item.name}</span>}
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </nav>

//       {/* Divider */}
//       <div className="border-top my-2"></div>

//       {/* Settings & Logout */}
//       <ul className="list-unstyled p-2">
//         <li className="mb-2">
//           <Link
//             to="/dashboard/settings"
//             className={`d-flex align-items-center p-2 text-decoration-none rounded ${
//               isActive("/dashboard/settings") ? "text-white" : "text-dark"
//             } ${isCollapsed ? "justify-content-center" : "gap-2"}`}
//             style={isActive("/dashboard/settings") ? { backgroundColor: teal600 } : {}}
//           >
//             <Settings size={18} />
//             {!isCollapsed && <span>Settings</span>}
//           </Link>
//         </li>

//         <li>
//           <button 
//             onClick={handleLogout}
//             className={`btn btn-danger w-100 d-flex align-items-center justify-content-center ${
//               !isCollapsed ? "gap-2" : ""
//             }`}
//           >
//             <LogOut size={18} />
//             {!isCollapsed && <span>Logout</span>}
//           </button>
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;



import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Box,
  Plus,
  BarChart,
  Settings,
  LogOut,
  Search,
  Menu,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Pill,
  Syringe,
  ShoppingBasket,
  Minus,
  Thermometer,
  HeartPulse,
  Droplet,
  Building2, // 🏢 Icon for Branch
} from "lucide-react";
import { UserContext } from "../context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const { logout, user } = useContext(UserContext); // ✅ get user from context

  const isActive = (path) => location.pathname === path;

  const toggleInventory = () => {
    setIsInventoryOpen(!isInventoryOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Fixed width values
  const sidebarWidth = isCollapsed ? "64px" : "256px";

  // Tailwind teal-600 color
  const teal600 = "#0d9488";

  return (
    <div
      className="d-flex flex-column bg-light shadow-sm border-end vh-100 position-relative"
      style={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        maxWidth: sidebarWidth,
        flexShrink: "0",
        flexGrow: "0",
      }}
    >
      {/* Sidebar Header */}
      <div
        className="d-flex align-items-center justify-content-between p-3 text-white"
        style={{ backgroundColor: teal600 }}
      >
        {!isCollapsed && <h5 className="m-0">Dashboard</h5>}
        <button
          className="btn btn-sm btn-light"
          onClick={() => setIsCollapsed(!isCollapsed)}
          type="button"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Search Bar */}
      {!isCollapsed && (
        <div className="p-2">
          <div className="input-group">
            <span className="input-group-text">
              <Search size={16} />
            </span>
            <input type="text" className="form-control" placeholder="Search" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-grow-1 overflow-hidden">
        <ul className="list-unstyled p-2">
          {/* Dashboard */}
          <li className="mb-2">
            <Link
              to="/dashboard"
              className={`d-flex align-items-center p-2 text-decoration-none rounded ${
                isActive("/dashboard") ? "text-white" : "text-dark"
              } ${isCollapsed ? "justify-content-center" : "gap-2"}`}
              style={isActive("/dashboard") ? { backgroundColor: teal600 } : {}}
            >
              <Home size={18} />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </li>

          {/* Inventory - Collapsible Section */}
          <li className="mb-2">
            <button
              onClick={toggleInventory}
              className={`btn d-flex align-items-center p-2 w-100 text-decoration-none rounded border-0 ${
                isActive("/dashboard/inventory") ||
                isActive("/dashboard/inventory/medication") ||
                isActive("/dashboard/inventory/consumables") ||
                isActive("/dashboard/inventory/general") ||
                isActive("/dashboard/inventory/aparatus") ||
                isActive("/dashboard/inventory/skincare") ||
                isActive("/dashboard/inventory/medication-fridge")
                  ? "text-white"
                  : "text-dark bg-transparent"
              } ${isCollapsed ? "justify-content-center" : "gap-2"}`}
              style={
                isActive("/dashboard/inventory") ||
                isActive("/dashboard/inventory/medication") ||
                isActive("/dashboard/inventory/consumables") ||
                isActive("/dashboard/inventory/general") ||
                isActive("/dashboard/inventory/aparatus") ||
                isActive("/dashboard/inventory/skincare") ||
                isActive("/dashboard/inventory/medication-fridge")
                  ? { backgroundColor: teal600 }
                  : {}
              }
            >
              <Box size={18} />
              {!isCollapsed && (
                <>
                  <span className="flex-grow-1 text-start">Inventory</span>
                  {isInventoryOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </>
              )}
            </button>

            {/* Inventory Sub-items */}
            {!isCollapsed && isInventoryOpen && (
              <ul className="list-unstyled ps-4 mt-2">
                <li className="mb-1">
                  <Link
                    to="/dashboard/inventory/medication"
                    className={`d-flex align-items-center p-2 text-decoration-none rounded ${
                      isActive("/dashboard/inventory/medication")
                        ? "text-white"
                        : "text-dark"
                    } gap-2`}
                    style={
                      isActive("/dashboard/inventory/medication")
                        ? { backgroundColor: teal600 }
                        : {}
                    }
                  >
                    <Pill size={16} />
                    <span>Medication</span>
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    to="/dashboard/inventory/consumables"
                    className={`d-flex align-items-center p-2 text-decoration-none rounded ${
                      isActive("/dashboard/inventory/consumables")
                        ? "text-white"
                        : "text-dark"
                    } gap-2`}
                    style={
                      isActive("/dashboard/inventory/consumables")
                        ? { backgroundColor: teal600 }
                        : {}
                    }
                  >
                    <Syringe size={16} />
                    <span>Consumables</span>
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    to="/dashboard/inventory/general"
                    className={`d-flex align-items-center p-2 text-decoration-none rounded ${
                      isActive("/dashboard/inventory/general")
                        ? "text-white"
                        : "text-dark"
                    } gap-2`}
                    style={
                      isActive("/dashboard/inventory/general")
                        ? { backgroundColor: teal600 }
                        : {}
                    }
                  >
                    <ShoppingBasket size={16} />
                    <span>General</span>
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    to="/dashboard/inventory/aparatus"
                    className={`d-flex align-items-center p-2 text-decoration-none rounded ${
                      isActive("/dashboard/inventory/aparatus")
                        ? "text-white"
                        : "text-dark"
                    } gap-2`}
                    style={
                      isActive("/dashboard/inventory/aparatus")
                        ? { backgroundColor: teal600 }
                        : {}
                    }
                  >
                    <HeartPulse size={16} />
                    <span>Apparatus</span>
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    to="/dashboard/inventory/skincare"
                    className={`d-flex align-items-center p-2 text-decoration-none rounded ${
                      isActive("/dashboard/inventory/skincare")
                        ? "text-white"
                        : "text-dark"
                    } gap-2`}
                    style={
                      isActive("/dashboard/inventory/skincare")
                        ? { backgroundColor: teal600 }
                        : {}
                    }
                  >
                    <Droplet size={16} />
                    <span>Skin Care Products</span>
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    to="/dashboard/inventory/medication-fridge"
                    className={`d-flex align-items-center p-2 text-decoration-none rounded ${
                      isActive("/dashboard/inventory/medication-fridge")
                        ? "text-white"
                        : "text-dark"
                    } gap-2`}
                    style={
                      isActive("/dashboard/inventory/medication-fridge")
                        ? { backgroundColor: teal600 }
                        : {}
                    }
                  >
                    <Thermometer size={16} />
                    <span>Medication (Fridge)</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Other Menu Items */}
          {[
            {
              name: "Add Item",
              icon: <Plus size={18} />,
              path: "/dashboard/add-item",
            },
            {
              name: "Adjust Stock",
              icon: <Minus size={18} />,
              path: "/dashboard/adjust-stock",
            },
            {
              name: "Report",
              icon: <BarChart size={18} />,
              path: "/dashboard/report",
            },
          ].map((item, index) => (
            <li key={index} className="mb-2">
              <Link
                to={item.path}
                className={`d-flex align-items-center p-2 text-decoration-none rounded ${
                  isActive(item.path) ? "text-white" : "text-dark"
                } ${isCollapsed ? "justify-content-center" : "gap-2"}`}
                style={
                  isActive(item.path) ? { backgroundColor: teal600 } : {}
                }
              >
                {item.icon}
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}

          {/* ✅ Admin-only: Create Branch */}
          {user?.role === "Admin" && (
            <li className="mb-2">
              <Link
                to="/dashboard/create-branch"
                className={`d-flex align-items-center p-2 text-decoration-none rounded ${
                  isActive("/dashboard/create-branch")
                    ? "text-white"
                    : "text-dark"
                } ${isCollapsed ? "justify-content-center" : "gap-2"}`}
                style={
                  isActive("/dashboard/create-branch")
                    ? { backgroundColor: teal600 }
                    : {}
                }
              >
                <Building2 size={18} />
                {!isCollapsed && <span>Create Branch</span>}
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {/* Divider */}
      <div className="border-top my-2"></div>

      {/* Settings & Logout */}
      <ul className="list-unstyled p-2">
        <li className="mb-2">
          <Link
            to="/dashboard/settings"
            className={`d-flex align-items-center p-2 text-decoration-none rounded ${
              isActive("/dashboard/settings") ? "text-white" : "text-dark"
            } ${isCollapsed ? "justify-content-center" : "gap-2"}`}
            style={
              isActive("/dashboard/settings") ? { backgroundColor: teal600 } : {}
            }
          >
            <Settings size={18} />
            {!isCollapsed && <span>Settings</span>}
          </Link>
        </li>

        <li>
          <button
            onClick={handleLogout}
            className={`btn btn-danger w-100 d-flex align-items-center justify-content-center ${
              !isCollapsed ? "gap-2" : ""
            }`}
          >
            <LogOut size={18} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
