import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Container,
  Image,
  Nav,
  Navbar,
  Row,
  Form,
  Button,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { storage, auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import {
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import {
  FaSignOutAlt,
  FaPlus,
  FaRegHeart,
  FaRegCommentAlt,
  FaRegPaperPlane,
  FaHeart,
  FaPencilAlt,
  FaRegTrashAlt,
} from "react-icons/fa";

export default function PostPageDetails() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [owner, setOwner] = useState("");
  const params = useParams();
  const id = params.id;
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  async function handleCommentSubmit(e) {
    e.preventDefault();
    if (!comment.trim()) return;

    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, {
      comments: arrayUnion({
        text: comment,
        author: user.email,
      }),
    });
    setComment("");
  }

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

  async function getPost(id) {
    const postDocument = await getDoc(doc(db, "posts", id));
    const post = postDocument.data();
    setCaption(post.caption);
    setImage(post.image);
    setOwner(post.owner);
    setComments(post.comments || []);
  }

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
    getPost(id);

    if (user && user.email) {
      setUserEmail(user.email);
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
            <Image src={image} style={{ width: "100%" }} />
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
                    <span>
                      <FaRegCommentAlt
                        size={"1.5rem"}
                        style={{ marginRight: "0.5rem" }}
                      />
                      <FaRegPaperPlane size={"1.5rem"} />
                    </span>
                  </div>
                  <span>
                    <Card.Link
                      href={`/update/${id}`}
                      style={{ color: "black" }}
                    >
                      <FaPencilAlt size={"1.5rem"} />
                    </Card.Link>
                    <Card.Link
                      onClick={() => deletePost(id)}
                      style={{ cursor: "pointer", color: "black" }}
                    >
                      <FaRegTrashAlt size={"1.5rem"} />
                    </Card.Link>
                  </span>
                </Card.Text>
                <Card.Text>{caption}</Card.Text>
                <Card.Text>
                  <h6>Comments</h6>
                  {comments.map((comment, index) => (
                    <p key={index}>
                      <strong>{comment.author}:</strong> {comment.text}
                    </p>
                  ))}
                </Card.Text>
                <Form onSubmit={handleCommentSubmit}>
                  <Form.Group>
                    <Row>
                      <Col xs="10">
                        <Form.Control
                          type="text"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Add a comment..."
                        />
                      </Col>
                      <Col xs="2" className="text-end">
                        <Button type="submit">Post</Button>
                      </Col>
                    </Row>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
