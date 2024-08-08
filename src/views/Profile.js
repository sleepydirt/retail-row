import { useEffect, useState } from "react";
import { auth, storage } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  Button,
  Container,
  Form,
  Image,
  Modal,
  Nav,
  Navbar,
  Row,
  Col,
} from "react-bootstrap";
import { FaHome } from "react-icons/fa";

export default function Profile() {
  const [photoURL, setPhotoURL] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
  );
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [user, loading] = useAuthState(auth);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
    if (user?.photoURL) setPhotoURL(user.photoURL);

    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [user, loading, navigate, imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImageFile(null);
      setImagePreview("");
    }
  };

  async function updateProfileImage() {
    if (!imageFile) return;

    const oldPhotoURL = user.photoURL;

    const imageReference = ref(
      storage,
      `profile/${user.uid}/${imageFile.name}`
    );
    try {
      if (oldPhotoURL) {
        const oldImageRef = ref(storage, oldPhotoURL);
        await deleteObject(oldImageRef);
      }

      const response = await uploadBytes(imageReference, imageFile);
      const imageUrl = await getDownloadURL(response.ref);

      await updateProfile(user, { photoURL: imageUrl });
      setPhotoURL(imageUrl);
      setShowSuccessModal(true);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Error updating profile picture:", error);
      alert("Failed to update profile picture. Please try again.");
    }
  }

  return (
    <>
      <Navbar variant="light" bg="light">
        <Container>
          <Navbar.Brand href="/" className="d-flex align-items-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/52/Rolls-Royce_Motor_Cars_logo.svg"
              alt="brand"
              width="24px"
              className="mx-3"
            />
            Retail Row
          </Navbar.Brand>
          <Nav className="align-items-center">
            <Nav.Link className="d-flex align-items-center" href="/">
              <FaHome size="24px" />
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container
        className="mt-5"
        style={{
          background: "white",
          width: "100%",
          maxWidth: "600px",
          border: "1px solid #fff",
          borderRadius: "15px",
          padding: "1.5rem",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
        }}
      >
        <h2>User Profile</h2>
        <div className="text-center mb-4">
          <Image
            src={imagePreview || photoURL}
            roundedCircle
            width={150}
            height={150}
            className="mb-3"
          />
          <Form.Group as={Row} className="mb-3" controlId="formEmail">
            <Form.Label column xs="2">
              Email
            </Form.Label>
            <Col xs="10">
              <Form.Control plaintext readOnly defaultValue={user?.email} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="profileImage" className="mb-3">
            <Form.Control
              type="file"
              onChange={handleImageChange}
              accept="image/*"
            />
          </Form.Group>
          <Button onClick={updateProfileImage} disabled={!imageFile}>
            Update Profile Picture
          </Button>
        </div>
      </Container>
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Profile photo successfully updated!</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowSuccessModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
