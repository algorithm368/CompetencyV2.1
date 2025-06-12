// import React, { useState, useEffect } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// // import { useAuth } from "@Contexts/AuthContext";
// import { Loading, Modal } from "@Components/ExportComponent";
// import { FaSignInAlt } from "react-icons/fa";

// const ProtectedRoute: React.FC = () => {
//   // const { user, loading } = useAuth();
//   const [showModal, setShowModal] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!loading && !user) {
//       setShowModal(true);
//     }
//   }, [loading, user]);

//   const handleCloseModal = () => {
//     setShowModal(false);
//     navigate("/login", { replace: true });
//   };

//   if (loading) {
//     return <Loading message="Loading user data..." />;
//   }

//   if (!user) {
//     return (
//       showModal && (
//         <Modal
//           title="Please Log In"
//           onClose={handleCloseModal}
//         >
//           <div className="flex flex-col items-center text-center space-y-4">
//             <FaSignInAlt className="text-blue-600 text-4xl" />
//             <p className="text-gray-700 text-lg font-medium">You need to log in to access this page.</p>
//             <button
//               onClick={handleCloseModal}
//               className="mt-2 px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
//             >
//               OK
//             </button>
//           </div>
//         </Modal>
//       )
//     );
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;
