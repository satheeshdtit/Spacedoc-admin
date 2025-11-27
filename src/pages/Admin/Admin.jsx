// import React, { useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Image,
//   Card,
//   Button,
//   Table,
//   Form,
// } from "react-bootstrap";
// import admin from "../assets/Images/admin.png";
// import { FiTrash2 } from "react-icons/fi";

// export default function Admin() {
//   const initialAdminUsers = [
//     { id: 1, name: "admin1", email: "admin1@gmail.com", type: "Primary" },
//     { id: 2, name: "admin2", email: "admin2@gmail.com", type: "Secondary" },
//     { id: 3, name: "john", email: "john@gmail.com", type: "Secondary" },
//     { id: 4, name: "alex", email: "alex@gmail.com", type: "Primary" },
//     { id: 5, name: "mark", email: "mark@gmail.com", type: "Secondary" },
//     { id: 6, name: "sam", email: "sam@gmail.com", type: "Secondary" },
//     { id: 7, name: "tom", email: "tom@gmail.com", type: "Primary" },
//     { id: 8, name: "karen", email: "karen@gmail.com", type: "Primary" },
//     { id: 9, name: "mick", email: "mick@gmail.com", type: "Secondary" },
//     { id: 10, name: "steve", email: "steve@gmail.com", type: "Primary" },
//     { id: 11, name: "peter", email: "peter@gmail.com", type: "Secondary" },
//     { id: 12, name: "peter", email: "peter@gmail.com", type: "Secondary" },
//     { id: 13, name: "peter", email: "peter@gmail.com", type: "Secondary" },
//     { id: 14, name: "peter", email: "peter@gmail.com", type: "Secondary" },
//     { id: 15, name: "peter", email: "peter@gmail.com", type: "Secondary" },
//   ];

//   // 🔥 MAKE DATA STATEFUL
//   const [adminUsers, setAdminUsers] = useState(initialAdminUsers);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [search, setSearch] = useState("");
//   const [goToPage, setGoToPage] = useState("");

//   // 🔥 DELETE FUNCTION
//   const handleDelete = (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete?");
//     if (!confirmDelete) return;

//     setAdminUsers((prev) => prev.filter((user) => user.id !== id));
//   };

//   const filteredData = adminUsers.filter(
//     (item) =>
//       item.name.toLowerCase().includes(search.toLowerCase()) ||
//       item.email.toLowerCase().includes(search.toLowerCase()) ||
//       item.type.toLowerCase().includes(search.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredData.length / rowsPerPage);
//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

//   const nextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const prevPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   return (
//     <Container className="mt-5 mb-5">
      

//       {/* PROFILE CARD */}
//       <Card className="shadow-sm p-4 mt-3">
//         <h5 className="text-center fw-bold mb-4">ADMIN PROFILE</h5>

//         <Row className="align-items-center">
//           <Col xs={12} md={4} className="text-center mb-4 mb-md-0">
//             <Image src={admin} rounded fluid className="admin-avatar" />
//           </Col>

//           <Col xs={12} md={8}>
//             <Row className="py-2 border-bottom">
//               <Col xs={12} sm={4} className="fw-bold">
//                 Username
//               </Col>
//               <Col xs={12} sm={8}>admin</Col>
//             </Row>

//             <Row className="py-2 border-bottom">
//               <Col xs={12} sm={4} className="fw-bold">
//                 Email
//               </Col>
//               <Col xs={12} sm={8}>test@gmail.com</Col>
//             </Row>

//             <Row className="py-2 border-bottom">
//               <Col xs={12} sm={4} className="fw-bold">
//                 Admin Type
//               </Col>
//               <Col xs={12} sm={8}>Primary</Col>
//             </Row>

//             <div className="d-flex flex-wrap gap-2 mt-4">
//               <Button variant="primary">Change Password</Button>
//               <Button variant="primary">Edit Profile</Button>
//               <Button variant="primary">Add Admin</Button>
//             </div>
//           </Col>
//         </Row>
//       </Card>

//       <Card className="shadow-sm p-4 mt-4">
//         <h5 className="text-center fw-bold mb-3">ADMIN USERS</h5>

//         {/* Controls */}
//         <Row className="mb-3">
//           <Col xs={6} md={3}>
//             <Form.Select
//               value={rowsPerPage}
//               onChange={(e) => {
//                 setRowsPerPage(Number(e.target.value));
//                 setCurrentPage(1);
//               }}
//             >
//               <option value={5}>Show 5</option>
//               <option value={10}>Show 10</option>
//               <option value={25}>Show 25</option>
//               <option value={50}>Show 50</option>
//             </Form.Select>
//           </Col>

//           <Col xs={6} md={3} className="ms-auto">
//             <Form.Control
//               type="text"
//               placeholder="Search..."
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setCurrentPage(1);
//               }}
//             />
//           </Col>
//         </Row>

//         {/* Table */}
//         <div className="table-container">
//           <Table className="simple-table">
//             <thead>
//               <tr>
//                 <th>S.No</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Admin Type</th>
//                 <th>Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {currentRows.map((user, idx) => (
//                 <tr key={user.id}>
//                   <td>{indexOfFirstRow + idx + 1}</td>
//                   <td>{user.name}</td>
//                   <td>{user.email}</td>
//                   <td>
//                     <span className="badge-type">{user.type}</span>
//                   </td>
//                   <td>
//                     <button
//                       className="delete-icon-btn"
//                       onClick={() => handleDelete(user.id)}
//                     >
//                       <FiTrash2 size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>

//         {/* Pagination */}
//         <div className="custom-pagination-container mt-4">
//           <div className="pagination-info">
//             Showing {indexOfFirstRow + 1} to{" "}
//             {Math.min(indexOfLastRow, filteredData.length)} of{" "}
//             {filteredData.length} entries
//           </div>

//           <div className="d-flex align-items-center gap-3 flex-wrap">
//             <div className="custom-pagination">
//               <button
//                 className="page-btn"
//                 onClick={prevPage}
//                 disabled={currentPage === 1}
//               >
//                 &laquo;
//               </button>

//               {Array.from({ length: totalPages }, (_, i) => (
//                 <button
//                   key={i}
//                   className={`page-number ${
//                     currentPage === i + 1 ? "active" : ""
//                   }`}
//                   onClick={() => setCurrentPage(i + 1)}
//                 >
//                   {i + 1}
//                 </button>
//               ))}

//               <button
//                 className="page-btn"
//                 onClick={nextPage}
//                 disabled={currentPage === totalPages}
//               >
//                 &raquo;
//               </button>
//             </div>

//             {/* Go To Page */}
//             <div className="go-to-page d-flex align-items-center gap-2">
//               <input
//                 type="number"
//                 min="1"
//                 max={totalPages}
//                 value={goToPage}
//                 onChange={(e) => setGoToPage(e.target.value)}
//                 className="go-input"
//                 placeholder="Go to..."
//               />

//               <button
//                 className="go-btn"
//                 onClick={() => {
//                   const page = Number(goToPage);
//                   if (page >= 1 && page <= totalPages) {
//                     setCurrentPage(page);
//                     setGoToPage("");
//                   }
//                 }}
//               >
//                 Go
//               </button>
//             </div>
//           </div>
//         </div>
//       </Card>
//     </Container>
//   );
// }



import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Card,
  Button,
  Table,
} from "react-bootstrap";

import admin from "../../assets/Images/admin.png";
import { FiTrash2 } from "react-icons/fi";

import ChangePasswordForm from "../Admin/ChangePasswordForm";
import EditProfileForm from "../Admin/EditProfileForm";
import AddAdminForm from "../Admin/AddAdminForm";

export default function Admin() {
  const [adminUsers, setAdminUsers] = useState([]);

  const [profile, setProfile] = useState({
    username: "",
    email: "",
    type: "Primary",
  });

  const [view, setView] = useState("profile"); // profile | changePassword | editProfile | addAdmin

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    setAdminUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <Container className="mt-5 mb-5">
      {/* PROFILE CARD */}
      <Card className="shadow-sm p-4 mt-3">
        {view === "profile" && (
          <>
            <h5 className="text-center fw-bold mb-4">ADMIN PROFILE</h5>

            <Row className="align-items-center">
              <Col xs={12} md={4} className="text-center mb-4 mb-md-0">
                <Image src={admin} rounded fluid className="admin-avatar" />
              </Col>

              <Col xs={12} md={8}>
                <Row className="py-2 border-bottom">
                  <Col xs={12} sm={4} className="fw-bold">
                    Username
                  </Col>
                  <Col xs={12} sm={8}>
                    {profile.username || "Not set"}
                  </Col>
                </Row>

                <Row className="py-2 border-bottom">
                  <Col xs={12} sm={4} className="fw-bold">
                    Email
                  </Col>
                  <Col xs={12} sm={8}>
                    {profile.email || "Not set"}
                  </Col>
                </Row>

                <Row className="py-2 border-bottom">
                  <Col xs={12} sm={4} className="fw-bold">
                    Admin Type
                  </Col>
                  <Col xs={12} sm={8}>{profile.type}</Col>
                </Row>

                <div className="d-flex flex-wrap gap-2 mt-4">
                  <Button variant="primary" onClick={() => setView("changePassword")}>
                    Change Password
                  </Button>

                  <Button variant="primary" onClick={() => setView("editProfile")}>
                    Edit Profile
                  </Button>

                  <Button variant="primary" onClick={() => setView("addAdmin")}>
                    Add Admin
                  </Button>
                </div>
              </Col>
            </Row>
          </>
        )}

        {view === "changePassword" && (
          <ChangePasswordForm onCancel={() => setView("profile")} />
        )}

        {view === "editProfile" && (
          <EditProfileForm
            data={profile}
            onUpdate={(updated) => setProfile(updated)}
            onCancel={() => setView("profile")}
          />
        )}

        {view === "addAdmin" && (
          <AddAdminForm
            onAdd={(newAdmin) =>
              setAdminUsers((prev) => [...prev, { ...newAdmin, id: Date.now() }])
            }
            onCancel={() => setView("profile")}
          />
        )}
      </Card>

      {/* USERS TABLE */}
      <Card className="shadow-sm p-4 mt-4 table-card">
        <h5 className="text-center fw-bold mb-3">ADMIN USERS</h5>

        <div className="table-container">
          <Table className="simple-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Admin Type</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {adminUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-3">
                    No admin users found
                  </td>
                </tr>
              )}

              {adminUsers.map((user, idx) => (
                <tr key={user.id}>
                  <td>{idx + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="badge-type">{user.type}</span>
                  </td>
                  <td>
                    <button className="delete-icon-btn" onClick={() => handleDelete(user.id)}>
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
    </Container>
  );
}
