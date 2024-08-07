import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Container,
  Image,
  Nav,
  Navbar,
  Row,
  Button,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { storage, auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import {
  FaSignOutAlt,
  FaPlus,
  FaRegHeart,
  FaCommentAlt,
  FaHeart,
  FaPencilAlt,
  FaRegTrashAlt,
} from "react-icons/fa";
import PostModals from "../components/Modals";

export default function ListingPage() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [owner, setOwner] = useState("");
  const params = useParams();
  const id = params.id;
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [desc, setDesc] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOwnerModal, setShowOwnerModal] = useState(false);

  const handleDeletePost = () => {
    if (user) {
      if (user.email === owner) {
        deletePost(id);
      } else {
        setShowOwnerModal(true);
      }
    } else {
      setShowLoginModal(true);
    }
  };

  const handleEditPost = () => {
    if (user) {
      if (user.email === owner) {
        navigate(`/update/${id}`);
      } else {
        setShowOwnerModal(true);
      }
    } else {
      setShowLoginModal(true);
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  async function deletePost(id) {
    const postDocument = await getDoc(doc(db, "posts", id));
    const post = postDocument.data();

    if (post && post.image) {
      await deleteImage(post.image);
    }
    await deleteDoc(doc(db, "posts", id));
    navigate("/");
  }

  async function deleteImage(imageUrl) {
    if (!imageUrl) return;

    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  }

  const handleLogout = async () => {
    if (user) {
      try {
        await signOut(auth);
        setShowLogoutModal(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error("Error signing out: ", error);
        setShowLogoutModal(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }
  };

  const handleCreatePost = () => {
    if (user) {
      navigate("/add");
    } else {
      setShowLoginModal(true);
    }
  };

  async function getPost(id) {
    const postDocument = await getDoc(doc(db, "posts", id));
    const post = postDocument.data();
    setCaption(post.caption);
    setImage(post.image);
    setOwner(post.owner);
    setDesc(post.desc);
    setCondition(post.condition);
    setPrice(post.price);
  }

  useEffect(() => {
    if (loading) return;
    getPost(id);

    if (user && user.email) {
      setUserEmail(user.email);
    } else {
      setUserEmail(`Not logged in`);
    }
  }, [id, navigate, user, loading]);

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
            <Nav.Link className="d-flex align-items-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                width={"32px"}
                alt="profile"
                style={{ borderRadius: "50%" }}
              />
              <span className="ms-2">{userEmail}</span>
            </Nav.Link>
            <Nav.Link
              onClick={handleCreatePost}
              className="d-flex align-items-center"
            >
              <FaPlus />
            </Nav.Link>
            <Nav.Link
              onClick={handleLogout}
              className="d-flex align-items-center"
            >
              <FaSignOutAlt />
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <PostModals
        showLogoutModal={showLogoutModal}
        setShowLogoutModal={setShowLogoutModal}
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        showOwnerModal={showOwnerModal}
        setShowOwnerModal={setShowOwnerModal}
      />
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "90vh" }}
      >
        <Row
          style={{
            width: "100%",
            maxWidth: "600px",
            border: "1px solid #fff",
            borderRadius: "15px",
            padding: "0",
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
          }}
        >
          <Col className="my-3 d-flex align-items-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
              width={"32px"}
              alt="profile"
              style={{ borderRadius: "50%" }}
            />
            <span className="ms-2">{owner}</span>
          </Col>
          <Col xxl="12">
            <Image src={image} style={{ width: "100%", maxHeight: "600px" }} />
          </Col>
          <Col>
            <Card style={{ border: "none" }}>
              <Card.Body style={{ padding: "1rem 10px" }}>
                <Card.Text className="d-flex align-items-center justify-content-between">
                  <div>
                    <span
                      onClick={toggleLike}
                      style={{ cursor: "pointer", marginRight: "0.5rem" }}
                    >
                      {isLiked ? (
                        <FaHeart size={"26px"} color="red" />
                      ) : (
                        <FaRegHeart size={"26px"} />
                      )}
                    </span>
                  </div>
                  <span>
                    <Card.Link
                      onClick={handleEditPost}
                      style={{ cursor: "pointer", color: "black" }}
                    >
                      <FaPencilAlt size={"1.5rem"} />
                    </Card.Link>
                    <Card.Link
                      onClick={handleDeletePost}
                      style={{ cursor: "pointer", color: "black" }}
                    >
                      <FaRegTrashAlt size={"1.5rem"} />
                    </Card.Link>
                  </span>
                </Card.Text>
                <Card.Text className="h4">{caption}</Card.Text>
                <Card.Text className="lead">S${price}</Card.Text>
                <hr />
                <Card.Text className="h5 mb-3">Details</Card.Text>
                <Card.Text className="text-muted my-0">Condition</Card.Text>
                <Card.Text>{condition}</Card.Text>
                <Card.Text className="h5 mb-3">Description</Card.Text>
                <Card.Text>{desc}</Card.Text>
                <Button className="w-100 btn-danger">
                  <FaCommentAlt color="white" />
                  <span className="mx-1 h6">Chat</span>
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
