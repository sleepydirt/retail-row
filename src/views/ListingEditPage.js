import React, { useEffect, useState } from "react";
import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../firebase";
import { signOut } from "firebase/auth";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FaSignOutAlt, FaPlus } from "react-icons/fa";

export default function ListingEditPage() {
  const params = useParams();
  const id = params.id;
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [desc, setDesc] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");
  const [photoURL, setPhotoURL] = useState();

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

  async function updatePost() {
    let imageUrl = image;
    if (imageFile) {
      const imageReference = ref(storage, `images/${imageFile.name}`);
      const response = await uploadBytes(imageReference, imageFile);
      imageUrl = await getDownloadURL(response.ref);
    }
    await updateDoc(doc(db, "posts", id), {
      caption,
      desc,
      condition,
      price,
      image: imageUrl,
    });
    navigate("/");
  }

  async function getPost(id) {
    const postDocument = await getDoc(doc(db, "posts", id));
    const post = postDocument.data();
    setCaption(post.caption);
    setImage(post.image);
    setDesc(post.desc);
    setCondition(post.condition);
    setPrice(post.price);
  }

  useEffect(() => {
    if (loading) return;
    if (user?.photoURL) setPhotoURL(user.photoURL);
    if (!user) navigate("/login");
    getPost(id);

    if (user && user.email) {
      setUserEmail(user.email);
    }

    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [id, navigate, user, loading, imagePreview]);

  return (
    <div>
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
            <Nav.Link className="d-flex align-items-center" href="/profile">
              <img
                src={photoURL}
                width={"32px"}
                height={"32px"}
                alt="profile"
                style={{ borderRadius: "50%" }}
              />
              <span className="ms-2">{userEmail}</span>
            </Nav.Link>
            <Nav.Link href="/add" className="d-flex align-items-center">
              <FaPlus />
            </Nav.Link>
            <Nav.Link
              onClick={(e) => signOut(auth)}
              className="d-flex align-items-center"
            >
              <FaSignOutAlt />
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container
        style={{
          maxWidth: "600px",
          border: "1px solid #fff",
          borderRadius: "15px",
          padding: "2rem",
          margin: "10rem auto",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
        }}
      >
        <h1 style={{ marginBlock: "1rem" }}>Edit Listing</h1>
        <Form>
          <Form.Group className="mb-3" controlId="caption">
            <h3 style={{ marginBlock: "1rem" }}>Item details</h3>
            <Form.Label>Listing Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name your listing"
              value={caption}
              onChange={(text) => setCaption(text.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="desc">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              placeholder="Include any other details helpful to buyers."
              value={desc}
              onChange={(text) => setDesc(text.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="condition">
            <Form.Label>Condition</Form.Label>
            <Form.Select
              onChange={(e) => setCondition(e.target.value)}
              value={condition}
            >
              <option value="New">New</option>
              <option value="Used">Used</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="S$"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control type="file" onChange={handleImageChange} />
            <div style={{ marginTop: "10px" }}>
              {/* This uses a ternary operator to handle image previewing:
                If imagePreview exists (user has uploaded a new img), then render it;
                else it will render the original image.  */}
              {imagePreview ? (
                <img
                  src={imagePreview}
                  style={{ width: "100%" }}
                  alt="preview"
                />
              ) : image ? (
                <img src={image} style={{ width: "100%" }} alt="" />
              ) : null}
            </div>
          </Form.Group>
          <Button variant="primary" onClick={(e) => updatePost()}>
            Submit
          </Button>
        </Form>
      </Container>
    </div>
  );
}
