import { useEffect, useState } from "react";
import { auth, storage } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { Button, Container, Form, Image, Modal } from "react-bootstrap";

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

    const imageReference = ref(
      storage,
      `profile/${user.uid}/${imageFile.name}`
    );
    try {
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
      <Container className="mt-5">
        <h2>User Profile</h2>
        <div className="text-center mb-4">
          <Image
            src={imagePreview || photoURL}
            roundedCircle
            width={150}
            height={150}
            className="mb-3"
          />
          <Form.Group controlId="profileImage" className="mb-3">
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
        <p>Email: {user?.email}</p>
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
