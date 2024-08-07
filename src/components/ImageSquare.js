import { Container, Image, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import "../postlink.css";
export default function ImageSquare({ post }) {
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
