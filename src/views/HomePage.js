import { useEffect, useState } from "react";
import { Container, Image, Row, Nav, Navbar, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { FaSignOutAlt, FaPlus } from "react-icons/fa";
import "../postlink.css";

export default function PostPageHome() {
  const [posts, setPosts] = useState([]);
  const [user, loading] = useAuthState(auth);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  async function getAllPosts() {
    const query = await getDocs(collection(db, "posts"));
    // console.log(query.docs[0].data());
    const posts = query.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    setPosts(posts);
  }

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/onboard");

    if (user && user.email) {
      setUserEmail(user.email);
    }

    getAllPosts();
  }, [loading, navigate, user]);

  const ImagesRow = () => {
    return posts.map((post, index) => <ImageSquare key={index} post={post} />);
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
      <Container>
        <h1>Listings</h1>
        <Row className="d-flex justify-content-center align-items-center">
          <ImagesRow />
        </Row>
      </Container>
    </>
  );
}

function ImageSquare({ post }) {
  const { image, id, caption, price, owner, condition } = post;
  return (
    <Link
      to={`posts/${id}`}
      style={{
        display: "block",
        width: "20rem",
        height: "30rem",
        marginLeft: "1rem",
        marginTop: "2rem",
        textDecoration: "none",
        color: "inherit",
        padding: "0",
        overflow: "hidden",
      }}
      className="post-link-container"
    >
      <Container
        className="d-flex flex-column justify-content-between align-items-center"
        style={{ height: "100%" }}
      >
        <Row style={{ width: "100%", height: "100%" }}>
          <Col xs={12} className="my-3 d-flex align-items-center px-0">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
              width="32px"
              alt="profile"
              style={{ borderRadius: "50%" }}
            />
            <span className="ms-2">{owner}</span>
          </Col>
          <Col xs={12} className="px-0">
            <div
              style={{
                width: "18rem",
                height: "18rem",
                margin: "0 auto",
                overflow: "hidden",
              }}
            >
              <Image
                src={image}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </Col>
          <Col xs={12}>
            <Card style={{ border: "none" }}>
              <Card.Body className="px-0">
                <Card.Text
                  className="my-0"
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {caption}
                </Card.Text>
                <Card.Text className="h6 my-0">S${price}</Card.Text>
                <Card.Text>{condition}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Link>
  );
}
