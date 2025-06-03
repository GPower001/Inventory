import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Card, CardContent } from "../components/ui/card";
import "../App.css";
import { Bell, AlertTriangle, Clock } from "lucide-react";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Link } from "react-router-dom";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const [stockData, setStockData] = useState({
    products: 0,
  });

  const [revenueData, setRevenueData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      {
        label: "Revenue",
        data: [20, 45, 30, 50, 40, 60, 30, 55],
        backgroundColor: "#009688",
      },
    ],
  });

  const [inventory, setInventory] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [expiredItems, setExpiredItems] = useState([]);

  const baseURL =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_API_URL
      : import.meta.env.VITE_SOCKET_URL_PROD;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch low stock items
        const lowStockResponse = await axios.get(`${baseURL}/api/items/lowstock`);
        setLowStockItems(lowStockResponse.data.data);

        // Fetch inventory data
        const inventoryResponse = await axios.get(`${baseURL}/api/items`);
        setInventory(inventoryResponse.data.data);
        setStockData((prev) => ({
          ...prev,
          products: inventoryResponse.data.data.length,
        }));

        // Fetch expired items
        const expiredResponse = await axios.get(`${baseURL}/api/items/expired`);
        const today = new Date();
        const filteredExpired = (expiredResponse.data.data || []).filter(
          item => item.expiryDate && new Date(item.expiryDate) <= today
        );
        setExpiredItems(filteredExpired);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-xl font-semibold">
        Hello <span className="font-bold">Mark!</span>{" "}
        <span className="text-teal-500">Analytics For this week</span>
      </h1>

      {/* Stock Update Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        {/* Product Card */}
        {stockData.products > 0 && (
          <Card className="p-4">
            <CardContent className="flex flex-col gap-2 text-center">
              <h2 className="text-lg font-medium">Product</h2>
              <p className="text-2xl font-bold">{stockData.products} items</p>
              <Link className="link" to={"categories"}>
                <button className="bg-teal-500 text-white px-4 py-1 rounded-md">
                  View
                </button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Low Stock Card */}
        {lowStockItems.length > 0 && (
          <Card className="p-4 border border-red-500">
            <CardContent className="flex flex-col gap-2 text-center">
              <div className="flex justify-between">
                <h2 className="text-lg font-medium">Low Stock</h2>
                <AlertTriangle className="text-red-500" size={20} />
              </div>
              <p className="text-2xl font-bold">{lowStockItems.length} items</p>
              <Link className="link" to="low-stock">
                <button className="bg-teal-500 text-white px-4 py-1 rounded-md">
                  View
                </button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Expired Products Card */}
        {expiredItems.length > 0 && (
          <Card className="p-4 border border-yellow-500">
            <CardContent className="flex flex-col gap-2 text-center">
              <div className="flex justify-between">
                <h2 className="text-lg font-medium">Expired Products</h2>
                <Clock className="text-yellow-500" size={20} />
              </div>
              <p className="text-2xl font-bold">{expiredItems.length} items</p>
              <Link className="link" to="expired-products">
                <button className="bg-yellow-500 text-white px-4 py-1 rounded-md">
                  View
                </button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Revenue Chart */}
      <Card className="p-4 h-[50vh] min-h-0">
        <CardContent className="h-full flex flex-col min-h-0">
          <h2 className="text-lg font-medium">Revenue</h2>
          <p className="text-2xl font-bold text-teal-600">£150,000</p>
          <div className="flex-grow w-full min-h-0">
            <Bar
              data={revenueData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;




// import { useState, useEffect } from "react";
// import { Bar } from "react-chartjs-2";
// import { Card, CardContent } from "../components/ui/card";
// import "../App.css"
// import { Bell, AlertTriangle } from "lucide-react";
// import axios from "axios"; // Import axios for API calls
// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Link } from "react-router-dom";

// ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// const Dashboard = () => {
//   const [stockData, setStockData] = useState({
//     products: 0,
//     lowStock: 0, // Initialize low stock as 0
//     expiryAlerts: 0,
//   });

//   const [revenueData, setRevenueData] = useState({
//     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
//     datasets: [
//       {
//         label: "Revenue",
//         data: [20, 45, 30, 50, 40, 60, 30, 55],
//         backgroundColor: "#009688",
//       },
//     ],
//   });

//   const [inventory, setInventory] = useState([]);
//   const [lowStockItems, setLowStockItems] = useState([]); // State to store low stock items


//   // Fetch data from the backend
//   const baseURL = import.meta.env.MODE === 'development'
//   ? import.meta.env.VITE_API_URL // Development URL
//   : import.meta.env.VITE_SOCKET_URL_PROD; // Production URL

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       // Fetch low stock items
//       const lowStockResponse = await axios.get(`${baseURL}/api/items/lowstock`);
//       setStockData((prev) => ({
//         ...prev,
//         lowStock: lowStockResponse.data.data.length, // Update low stock count
//       }));
//       setLowStockItems(lowStockResponse.data.data); // Store low stock items

//       // Fetch inventory data
//       const inventoryResponse = await axios.get(`${baseURL}/api/items`);
//       setInventory(inventoryResponse.data.data);

//       // Update total products count
//       setStockData((prev) => ({
//         ...prev,
//         products: inventoryResponse.data.data.length,
//       }));
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//     }
//   };

//   fetchData();
// }, []);

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <h1 className="text-xl font-semibold">
//         Hello <span className="font-bold">Mark!</span>{" "}
//         <span className="text-teal-500">Analytics For this week</span>
//       </h1>

//       {/* Stock Update Section */}
//       <div className="grid grid-cols-3 gap-4 my-6">
//             {/* Conditionally Render Product Card */}
//             {stockData.products > 0 && (
//               <Card className="p-4">
//                 <CardContent className="flex flex-col gap-2 text-center">
//                   <h2 className="text-lg font-medium">Product</h2>
//                   <p className="text-2xl font-bold">{stockData.products} items</p>
//                   <Link className="link" to={'categories'}>
//                     <button
//                       className="bg-teal-500 text-white px-4 py-1 rounded-md"
//                     >
//                       View
//                     </button>
//                   </Link>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Conditionally Render Low Stock Card */}
//             {lowStockItems.length > 0 && (
//               <Card className="p-4 border border-red-500">
//                 <CardContent className="flex flex-col gap-2 text-center">
//                   <div className="flex justify-between">
//                     <h2 className="text-lg font-medium">Low Stock</h2>
//                     <AlertTriangle className="text-red-500" size={20} />
//                   </div>
//                   <p className="text-2xl font-bold">{stockData.lowStock} items</p>
//                   <Link className="link"
//                     to="low-stock">
//                     <button
//                     className="bg-teal-500 text-white px-4 py-1 rounded-md"
//                   >
//                       View
//                     </button>
//                   </Link>
                
//                 </CardContent>
//               </Card>
//             )}

//             {/* Conditionally Render Expiry Alert Card */}
//             {stockData.expiryAlerts > 0 && (
//               <Card className="p-4 border border-red-500">
//                 <CardContent className="flex flex-col gap-2 text-center">
//                   <div className="flex justify-between">
//                     <h2 className="text-lg font-medium">Expiry Alert</h2>
//                     <Bell className="text-red-500" size={20} />
//                   </div>
//                   <p className="text-2xl font-bold">{stockData.expiryAlerts} items</p>
//                   <button
//                     className="bg-teal-500 text-white px-4 py-1 rounded-md"
//                     onClick={() => alert("Viewing expiry alerts")}
//                   >
//                     View
//                   </button>
//                 </CardContent>
//               </Card>
//             )}
//       </div>

//       {/* Revenue Chart */}
//       <Card className="p-4 h-[50vh] min-h-0">
//         <CardContent className="h-full flex flex-col min-h-0">
//           <h2 className="text-lg font-medium">Revenue</h2>
//           <p className="text-2xl font-bold text-teal-600">£150,000</p>

//           {/* Responsive Chart Container */}
//           <div className="flex-grow w-full min-h-0">
//             <Bar
//               data={revenueData}
//               options={{
//                 responsive: true,
//                 maintainAspectRatio: false, // Allows shrinking/stretching
//               }}
//             />
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Dashboard;