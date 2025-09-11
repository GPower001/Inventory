import { useEffect, useState, useRef, useContext } from "react";
import { RefreshCcw, Bell, AlertTriangle, ChevronDown } from "lucide-react";
import { io } from "socket.io-client";
import { UserContext } from "../context/UserContext";
import Logo from "../assets/favicon.ico";
import DefaultAvatar from "../assets/user-avatar.jpg";
import api from "../utils/api";

const Navbar = () => {
  const { user } = useContext(UserContext);
  const branchId = user?.branchId;
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  const userName = user?.name || "Guest User";
  const userAvatar = user?.avatar || DefaultAvatar;
  const hasNotifications = notifications.length > 0;

  // --------------------
  // Socket.IO setup
  // --------------------
  useEffect(() => {
    if (!branchId) return;

    // Get token from localStorage or user context
    const token = localStorage.getItem('token') || user?.token;
    
    if (!token) {
      console.error("No authentication token found for socket connection");
      return;
    }

    const socket = io(import.meta.env.VITE_API_URL || "https://inventory-sycr.onrender.com", {
      transports: ["websocket", "polling"],
      withCredentials: true,
      auth: {
        token: token
      }
    });

    // Debug connection events
    socket.on("connect", () => {
      console.log("Socket connected successfully", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Join branch room
    socket.emit("join-branch", branchId, (response) => {
      if (response && response.error) {
        console.error("Failed to join branch:", response.error);
      } else {
        console.log("Successfully joined branch room:", branchId);
      }
    });

    // Listen for new notifications
    socket.on("new-notification", (notification) => {
      console.log("New notification received:", notification);
      if (
        notification.branchId === branchId &&
        (notification.type === "expired" || notification.type === "low-stock")
      ) {
        setNotifications((prev) => {
          // Prevent duplicate notifications
          if (prev.some((n) => n._id === notification._id)) return prev;
          return [notification, ...prev];
        });
      }
    });

    return () => {
      console.log("Cleaning up socket connection");
      socket.disconnect();
    };
  }, [branchId, user?.token]);

  // --------------------
  // Fetch initial notifications
  // --------------------
  useEffect(() => {
    if (!branchId) return;

    const fetchNotifications = async () => {
      try {
        const response = await api.get(`/api/notifications?branchId=${branchId}`);
        const notificationsData = response?.data?.data || [];

        const filtered = notificationsData.filter(
          (n) => !n.isRead && (n.type === "expired" || n.type === "low-stock")
        );

        setNotifications(filtered);
      } catch (error) {
        console.error("Error fetching notifications:", error.message);
      }
    };

    fetchNotifications();
  }, [branchId]);

  // --------------------
  // Mark notification as read
  // --------------------
  const markAsRead = async (id) => {
    if (!branchId) return;

    try {
      await api.patch(`/api/notifications/${id}/read`, { branchId });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Error marking notification as read:", error.message);
    }
  };

  // --------------------
  // Close dropdown on click outside
  // --------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const expiredNotifications = notifications.filter((n) => n.type === "expired");
  const lowStockNotifications = notifications.filter((n) => n.type === "low-stock");

  // --------------------
  // JSX
  // --------------------
  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md relative">
      {/* Logo */}
      <div className="flex items-center">
        <img src={Logo} alt="Logo" className="h-10" />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 focus:outline-none"
          >
            <div className="relative">
              <Bell
                size={20}
                className={`cursor-pointer transition ${
                  isOpen ? "text-gray-700" : "text-gray-500 hover:text-gray-700"
                }`}
              />
              {hasNotifications && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </div>
            <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
              <div className="py-1">
                <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {/* Expired */}
                  <div>
                    <div className="px-4 py-2 border-b bg-red-50">
                      <span className="text-xs font-semibold text-red-600">Expired Items</span>
                    </div>
                    {expiredNotifications.length > 0 ? (
                      expiredNotifications.map((n) => (
                        <div
                          key={n._id}
                          className="px-4 py-3 hover:bg-gray-100 cursor-pointer bg-red-50"
                          onClick={() => markAsRead(n._id)}
                        >
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 p-1 rounded-full bg-red-100 text-red-600">
                              <AlertTriangle size={14} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{n.item}</p>
                              <p className="text-xs text-gray-500">{n.message}</p>
                              {n.expiryDate && (
                                <p className="text-xs mt-1 text-red-600">
                                  Expiry: {new Date(n.expiryDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-xs text-gray-500 text-center">No expired items</div>
                    )}
                  </div>

                  {/* Low Stock */}
                  <div>
                    <div className="px-4 py-2 border-b bg-amber-50">
                      <span className="text-xs font-semibold text-amber-700">Low Stock Items</span>
                    </div>
                    {lowStockNotifications.length > 0 ? (
                      lowStockNotifications.map((n) => (
                        <div
                          key={n._id}
                          className="px-4 py-3 hover:bg-gray-100 cursor-pointer bg-amber-50"
                          onClick={() => markAsRead(n._id)}
                        >
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 p-1 rounded-full bg-amber-100 text-amber-600">
                              <AlertTriangle size={14} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{n.item}</p>
                              <p className="text-xs text-gray-500">{n.message}</p>
                              {n.expiryDate && (
                                <p className="text-xs mt-1 text-red-600">
                                  Expiry: {new Date(n.expiryDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-xs text-gray-500 text-center">No low stock items</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <img src={userAvatar} alt="User Avatar" className="w-10 h-10 rounded-full border" />
        <span className="text-gray-700 font-medium">{userName}</span>

        {/* Refresh */}
        <RefreshCcw
          size={18}
          className="text-gray-500 cursor-pointer hover:text-gray-700 transition"
          onClick={() => window.location.reload()}
        />
      </div>
    </nav>
  );
};

export default Navbar;





// import { useEffect, useState, useRef, useContext } from "react";
// import { RefreshCcw, Bell, AlertTriangle, ChevronDown } from "lucide-react";
// import { io } from "socket.io-client";
// import axios from "axios";
// import { UserContext } from "../context/UserContext"; // Import the UserContext
// import Logo from "../assets/favicon.ico";
// import DefaultAvatar from "../assets/user-avatar.jpg";

// const socket = io("http://localhost:5000"); // Replace with your backend URL

// const Navbar = () => {
//   const { user } = useContext(UserContext); // Access the logged-in user's data
//   const [isOpen, setIsOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const dropdownRef = useRef(null);

//   const userName = user?.name || "Guest User"; // Use the logged-in user's name or a default
//   const userAvatar = user?.avatar || DefaultAvatar; // Use the user's avatar or a default
//   const hasNotifications = notifications.length > 0;

//   useEffect(() => {
//     // Fetch initial notifications
//     const fetchNotifications = async () => {
//       try {
//         const response = await axios.get("/api/notifications");
//         const notificationsData = response?.data?.data || []; // Fallback to an empty array
//         setNotifications(notificationsData.filter((n) => !n.isRead)); // Only show unread notifications
//       } catch (error) {
//         console.error("Error fetching notifications:", error.message);
//       }
//     };
//     fetchNotifications();

//     // Listen for new notifications
//     socket.on("new-notification", (notification) => {
//       setNotifications((prev) => [notification, ...prev]);
//     });

//     return () => {
//       socket.off("new-notification");
//     };
//   }, []);

//   const markAsRead = async (id) => {
//     try {
//       await axios.patch(`/api/notifications/${id}/read`);
//       setNotifications((prev) => prev.filter((notification) => notification._id !== id)); // Remove the notification from the list
//     } catch (error) {
//       console.error("Error marking notification as read:", error.message);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <nav className="flex justify-between items-center p-4 bg-white shadow-md relative">
//       {/* Logo Section */}
//       <div className="flex items-center">
//         <img src={Logo} alt="Glory Wellness Logo" className="h-10" />
//       </div>

//       {/* User Profile Section */}
//       <div className="flex items-center gap-4">
//         {/* Notification Dropdown */}
//         <div className="relative" ref={dropdownRef}>
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="flex items-center gap-1 focus:outline-none"
//           >
//             <div className="relative">
//               <Bell
//                 size={20}
//                 className={`cursor-pointer transition ${
//                   isOpen ? "text-gray-700" : "text-gray-500 hover:text-gray-700"
//                 }`}
//               />
//               {hasNotifications && (
//                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                   {notifications.length}
//                 </span>
//               )}
//             </div>
//             <ChevronDown
//               size={16}
//               className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
//             />
//           </button>

//           {/* Dropdown Menu */}
//           {isOpen && (
//         <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
//           <div className="py-1">
//             <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
//               <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
//             </div>
//             {/* Make notifications scrollable with a max height */}
//             <div className="max-h-80 overflow-y-auto">
//               {notifications.length > 0 ? (
//                 notifications.map((notification) => (
//                   <div
//                     key={notification._id}
//                     className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
//                       notification.type === "expired"
//                         ? "bg-red-50"
//                         : notification.type === "low-stock"
//                         ? "bg-amber-50"
//                         : ""
//                     }`}
//                     onClick={() => markAsRead(notification._id)} // Mark as read on click
//                   >
//                     <div className="flex items-start gap-2">
//                       <div
//                         className={`mt-0.5 p-1 rounded-full ${
//                           notification.type === "expired"
//                             ? "bg-red-100 text-red-600"
//                             : notification.type === "low-stock"
//                             ? "bg-amber-100 text-amber-600"
//                             : ""
//                         }`}
//                       >
//                         <AlertTriangle size={14} />
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-sm font-medium text-gray-900">
//                           {notification.item}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           {notification.message}
//                         </p>
//                         {notification.expiryDate && (
//                           <p className="text-xs mt-1 text-red-600">
//                             Expiry: {new Date(notification.expiryDate).toLocaleDateString()}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="px-4 py-3 text-center text-sm text-gray-500">
//                   No new notifications
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//         </div>

//         {/* User Avatar and Name */}
//         <img src={userAvatar} alt="User Avatar" className="w-10 h-10 rounded-full border" />
//         <span className="text-gray-700 font-medium">{userName}</span>

//         {/* Refresh Button */}
//         <RefreshCcw
//           size={18}
//           className="text-gray-500 cursor-pointer hover:text-gray-700 transition"
//           onClick={() => window.location.reload()}
//         />
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// import { useEffect, useState, useRef } from "react";
// import { RefreshCcw, Bell, AlertTriangle, ChevronDown } from "lucide-react";
// import { io } from "socket.io-client";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import Logo from "../assets/favicon.ico";
// import DefaultAvatar from "../assets/user-avatar.jpg";

// const socket = io("http://localhost:5000"); // Replace with your backend URL

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [user, setUser] = useState(null); // State to store user data
//   const dropdownRef = useRef(null);

//   const userName = user?.name || "Guest User"; // Use the logged-in user's name or a default
//   const userAvatar = user?.avatar || DefaultAvatar; // Use the user's avatar or a default
//   const hasNotifications = notifications.length > 0;

//   useEffect(() => {
//     // Fetch user profile
//     const fetchUserProfile = async () => {
//       try {
//         const response = await axios.get("/api/auth/profile", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token in the request
//           },
//         });
//         setUser(response.data); // Set the user data
//       } catch (error) {
//         console.error("Error fetching user profile:", error.message);
//       }
//     };

//     // Fetch initial notifications
//     // const fetchNotifications = async () => {
//     //   try {
//     //     const response = await axios.get("/api/notifications");
//     //     setNotifications(response.data.data.filter((n) => !n.isRead)); // Only show unread notifications
//     //   } catch (error) {
//     //     console.error("Error fetching notifications:", error.message);
//     //   }
//     // };
//     const fetchNotifications = async () => {
//       try {
//         const response = await axios.get("/api/notifications", {
//           timeout: 5000 // 5 second timeout
//         });
    
//         // Handle different response structures
//         const notificationsData = response?.data?.data || 
//                                 response?.data?.notifications || 
//                                 Array.isArray(response?.data) ? response.data : [];
    
//         // Validate we have an array before filtering
//         if (!Array.isArray(notificationsData)) {
//           throw new Error('Invalid notifications data format');
//         }
    
//         // Safe filtering for unread notifications
//         const unreadNotifications = notificationsData.filter(notification => 
//           notification?.isRead === false
//         );
    
//         setNotifications(unreadNotifications);
//       } catch (error) {
//         console.error("Error fetching notifications:", error);
        
//         // More detailed error handling
//         const errorMessage = error.response?.data?.message || 
//                            error.message || 
//                            'Failed to load notifications';
        
//         // Optional: Set error state if you have one
//         setError?.(errorMessage);
        
//         // Reset to empty array on error
//         setNotifications([]);
        
//         // Optional: Retry logic could be added here
//       }
//     };

//     fetchUserProfile();
//     fetchNotifications();

//     // Listen for new notifications
//     socket.on("new-notification", (notification) => {
//       setNotifications((prev) => [notification, ...prev]);
//     });

//     return () => {
//       socket.off("new-notification");
//     };
//   }, []);

//   const markAsRead = async (id) => {
//     try {
//       await axios.patch(`/api/notifications/${id}/read`);
//       setNotifications((prev) => prev.filter((notification) => notification._id !== id)); // Remove the notification from the list
//     } catch (error) {
//       console.error("Error marking notification as read:", error.message);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <nav className="flex justify-between items-center p-4 bg-white shadow-md relative">
//       {/* Logo Section */}
//       <div className="flex items-center">
//         <img src={Logo} alt="Glory Wellness Logo" className="h-10" />
//       </div>

//       {/* User Profile Section */}
//       <div className="flex items-center gap-4">
//         {/* Notification Dropdown */}
//         <div className="relative" ref={dropdownRef}>
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="flex items-center gap-1 focus:outline-none"
//           >
//             <div className="relative">
//               <Bell
//                 size={20}
//                 className={`cursor-pointer transition ${
//                   isOpen ? "text-gray-700" : "text-gray-500 hover:text-gray-700"
//                 }`}
//               />
//               {hasNotifications && (
//                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                   {notifications.length}
//                 </span>
//               )}
//             </div>
//             <ChevronDown
//               size={16}
//               className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
//             />
//           </button>

//           {/* Dropdown Menu */}
//           {isOpen && (
//             <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
//               <div className="py-1">
//                 <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
//                   <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
//                 </div>

//                 {notifications.length > 0 ? (
//                   notifications.map((notification) => (
//                     <div
//                       key={notification._id}
//                       className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
//                         notification.type === "expired" ? "bg-red-50" : "bg-amber-50"
//                       }`}
//                       onClick={() => markAsRead(notification._id)} // Mark as read on click
//                     >
//                       <div className="flex items-start gap-2">
//                         <div
//                           className={`mt-0.5 p-1 rounded-full ${
//                             notification.type === "expired"
//                               ? "bg-red-100 text-red-600"
//                               : "bg-amber-100 text-amber-600"
//                           }`}
//                         >
//                           <AlertTriangle size={14} />
//                         </div>
//                         <div className="flex-1">
//                           <p className="text-sm font-medium text-gray-900">
//                             {notification.item}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             <Link className="notifications" to={"Adjust-stock"}>
//                               {notification.message}
//                             </Link>
//                           </p>
//                           {notification.expiryDate && (
//                             <p className="text-xs mt-1 text-red-600">
//                               Expiry: {new Date(notification.expiryDate).toLocaleDateString()}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="px-4 py-3 text-center text-sm text-gray-500">
//                     No new notifications
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* User Avatar and Name */}
//         <img src={userAvatar} alt="User Avatar" className="w-10 h-10 rounded-full border" />
//         <span className="text-gray-700 font-medium">{userName}</span>

//         {/* Refresh Button */}
//         <RefreshCcw
//           size={18}
//           className="text-gray-500 cursor-pointer hover:text-gray-700 transition"
//           onClick={() => window.location.reload()}
//         />
//       </div>
//     </nav>
//   );
// };

// export default Navbar;