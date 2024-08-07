import { useEffect, useState } from "react";
import { Container, Row, Nav, Navbar } from "react-bootstrap";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { FaSignOutAlt, FaPlus } from "react-icons/fa";
import "../postlink.css";
import ImageSquare from "../components/ImageSquare";
import PostModals from "../components/Modals";

export default function PostPageHome() {
  const [posts, setPosts] = useState([]);
  const [user, loading] = useAuthState(auth);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

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

  async function getAllPosts() {
    const query = await getDocs(collection(db, "posts"));
    const posts = query.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    setPosts(posts);
  }

  useEffect(() => {
    if (loading) return;
    if (user && user.email) {
      setUserEmail(user.email);
    } else {
      setUserEmail(`Not logged in`);
    }

    getAllPosts();
  }, [loading, navigate, user]);

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
      />

      <Container>
        <h1>Listings</h1>
        <Row className="d-flex justify-content-center align-items-center">
          {posts.map((post, index) => (
            <ImageSquare key={index} post={post} />
          ))}
        </Row>
      </Container>
    </>
  );
}
