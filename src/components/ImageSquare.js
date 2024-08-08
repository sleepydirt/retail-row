import { Container, Image, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import "../postlink.css";

export default function ImageSquare({ post }) {
  const { image, id, caption, price, owner, condition, ownerUID } = post;
  const [photoURL, setPhotoURL] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
  );
  const storage = getStorage();

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (ownerUID) {
        try {
          const profileFolderRef = ref(storage, `profile/${ownerUID}`);
          const fileList = await listAll(profileFolderRef);

          if (fileList.items.length > 0) {
            const fileRef = fileList.items[0];
            const url = await getDownloadURL(fileRef);
            setPhotoURL(url);
          }
        } catch (error) {
          console.error("Error fetching profile image:", error);
        }
      }
    };

    fetchProfileImage();
  }, [ownerUID, storage]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Date unknown";
    const now = new Date();
    const postDate = timestamp.toDate();
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    }
  };
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
              src={photoURL}
              width="32px"
              height="32px"
              alt="profile"
              style={{ borderRadius: "50%" }}
            />
            <span className="ms-2">
              {owner}
              <p className="mb-0 text-muted" style={{ fontSize: "0.8rem" }}>
                {formatTimestamp(post.createdAt)}
              </p>
            </span>
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
