import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Nav,
  Navbar,
  Form,
  FormControl,
  Dropdown,
} from "react-bootstrap";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { FaSignOutAlt, FaPlus } from "react-icons/fa";
import "../postlink.css";
import ImageSquare from "../components/ImageSquare";
import PostModals from "../components/Modals";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [conditionFilter, setConditionFilter] = useState("All");
  const [user, loading] = useAuthState(auth);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [photoURL, setPhotoURL] = useState();

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
    if (user?.photoURL) {
      setPhotoURL(user.photoURL);
    } else {
      setPhotoURL(
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
      );
    }
    if (user && user.email) {
      setUserEmail(user.email);
    } else {
      setUserEmail(`Not logged in`);
    }
    getAllPosts();
  }, [loading, navigate, user]);

  useEffect(() => {
    let filtered = posts.filter((post) =>
      post.caption.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (conditionFilter !== "All") {
      filtered = filtered.filter((post) => post.condition === conditionFilter);
    }

    setFilteredPosts(filtered);
  }, [searchQuery, conditionFilter, posts]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleConditionFilter = (condition) => {
    setConditionFilter(condition);
  };
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
          <Form inline className=" d-flex align-items-center">
            <FormControl
              type="text"
              placeholder="Search posts..."
              className="mr-sm-2"
              value={searchQuery}
              onChange={handleSearch}
            />
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                id="dropdown-condition"
              >
                {conditionFilter}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleConditionFilter("All")}>
                  All
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleConditionFilter("New")}>
                  New
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleConditionFilter("Used")}>
                  Used
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form>
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
          {filteredPosts.map((post, index) => (
            <ImageSquare key={index} post={post} />
          ))}
        </Row>
      </Container>
    </>
  );
}
