import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Image,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import ChangePasswordForm from "../Admin/ChangePasswordForm";
import EditProfileForm from "../Admin/EditProfileForm";
import AddAdminForm from "../Admin/AddAdminForm";
import UpdateProfileImageModal from "../Admin/UpdateProfileImageModal";

export default function Admin() {
  const BASE = import.meta.env.VITE_API_BASE_URL;

  const GET_ADMINS = "/admin/getAdmins";
  const DELETE_ADMIN = "/admin/deleteAdmin";

  const [adminUsers, setAdminUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("profile");
  const [editData, setEditData] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const token = JSON.parse(localStorage.getItem("authUser"))?.token;

  const getImageURL = (img) => {
    if (!img) return "/placeholder-profile.png";
    if (img.startsWith("http")) return img;

    const p = img.indexOf("/uploads");
    if (p !== -1) return `${BASE}${img.slice(p)}`;

    return `${BASE}/${img}`;
  };

const fetchMyProfile = async () => {
  try {
    const res = await axios.get(`${BASE}/admin/getMyProfile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const p = res.data.profile;

    const fullImage = getImageURL(p.admin_img);

    setProfile({
      id: p.id,
      username: p.adminname,
      email: p.email,
      type: p.admin_type,
      image: p.admin_img,
    });

    const cacheFreeImage = `${fullImage}?t=${Date.now()}`;
    localStorage.setItem("adminProfileImage", cacheFreeImage);
    window.dispatchEvent(new Event("profile-image-updated"));

  } catch (err) {
    console.error("GET MY PROFILE ERROR:", err);
    setProfile(null);
  }
};


  const fetchAdmins = async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${BASE}${GET_ADMINS}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAdminUsers(res.data.admins || []);
    } catch (err) {
      console.error("GET ADMINS ERROR:", err);
      setAdminUsers([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMyProfile();
    fetchAdmins();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      await axios.delete(`${BASE}${DELETE_ADMIN}`, {
        data: {
          admin_delete_id: id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAdminUsers((prev) => prev.filter((u) => u.id !== id));

      if (profile?.id === id) setProfile(null);

      alert("Admin deleted successfully ✅");
    } catch (err) {
      console.error("DELETE ADMIN ERROR:", err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Failed to delete admin");
    }
  };

  const handleEdit = (adminObj) => {
    setEditData(adminObj);
    setView("editProfile");
  };

  return (
    <Container fluid="lg" className="mt-5 mb-5 px-3">
      <Card className="shadow-sm p-3 p-md-4">
        {view === "profile" && (
          <>
            <h5 className="text-center fw-bold mb-4">ADMIN PROFILE</h5>

            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" />
              </div>
            ) : profile ? (
              <Row className="align-items-center g-3">
                <Col xs={12} md={4} className="text-center">
                  <div
                    className="position-relative d-inline-block"
                    onClick={() => {setShowImageModal(true);
                      window.dispatchEvent(new Event("modal-open"));
                    }}
                    
                    style={{ cursor: "pointer" }}
                  >
                    <Image
                      src={getImageURL(profile.image)}
                      roundedCircle
                      fluid
                      style={{
                        width: "160px",
                        height: "160px",
                        objectFit: "cover",
                      }}
                    />

                    <div className="profile-upload-overlay">
                      <FiEdit size={22} />
                    </div>
                  </div>
                </Col>

                <Col xs={12} md={8}>
                  <Row className="py-1">
                    <Col xs={5} className="fw-bold">
                      Username
                    </Col>
                    <Col xs={7}>{profile.username}</Col>
                  </Row>

                  <Row className="py-1">
                    <Col xs={5} className="fw-bold">
                      Email
                    </Col>
                    <Col xs={7} className="text-break">
                      {profile.email}
                    </Col>
                  </Row>

                  <Row className="py-1">
                    <Col xs={5} className="fw-bold">
                      Admin Type
                    </Col>
                    <Col xs={7}>{profile.type}</Col>
                  </Row>

                  <div className="d-flex flex-wrap gap-2 mt-3">
                    <Button size="sm" onClick={() => setView("changePassword")}>
                      Change Password
                    </Button>

                    <Button
                      size="sm"
                      onClick={() =>
                        handleEdit({
                          id: profile.id,
                          adminname: profile.username,
                          email: profile.email,
                          admin_type: profile.type,
                          admin_img: profile.image,
                        })
                      }
                    >
                      Edit Profile
                    </Button>

                    <Button size="sm" onClick={() => setView("addAdmin")}>
                      Add Admin
                    </Button>
                  </div>
                </Col>
              </Row>
            ) : (
              <div className="text-center text-muted">No profile found</div>
            )}
          </>
        )}

        {view === "changePassword" && (
          <ChangePasswordForm
            adminId={profile?.id}
            onCancel={() => setView("profile")}
          />
        )}

        {view === "editProfile" && (
          <EditProfileForm
            data={editData}
            onCancel={() => setView("profile")}
            onUpdate={() => {
              fetchAdmins();
              fetchMyProfile();
              setView("profile");
            }}
          />
        )}

        {view === "addAdmin" && (
          <AddAdminForm
            onCancel={() => setView("profile")}
            onAdd={() => fetchAdmins()}
          />
        )}
      </Card>

      <UpdateProfileImageModal
        show={showImageModal}
        onClose={() => setShowImageModal(false)}
        profile={profile}
        onUpdated={fetchMyProfile}
      />

      <Card className="shadow-sm p-3 p-md-4 mt-4">
        <h5 className="text-center fw-bold mb-3">ADMIN USERS</h5>

        <div className="table-responsive">
          <Table className="simple-table align-middle">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Admin Type</th>
                <th>Profile Image</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {adminUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-3 text-muted">
                    No admins found
                  </td>
                </tr>
              ) : (
                adminUsers.map((u, idx) => (
                  <tr key={u.id}>
                    <td>{idx + 1}</td>
                    <td className="text-break">{u.adminname}</td>
                    <td className="text-break">{u.email}</td>
                    <td>{u.admin_type}</td>
                    <td>
                      <Image
                        src={getImageURL(u.admin_img)}
                        fluid
                        style={{
                          width: "70px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                    </td>
                    <td className="d-flex gap-2 justify-content-center flex-wrap">
                      <button
                        onClick={() => handleEdit(u)}
                        className="edit-icon-btn"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="delete-icon-btn"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </Container>
  );
}
