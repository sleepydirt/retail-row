import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/");
  }, [loading, navigate, user]);

  return (
    <div
      style={{
        background:
          "linear-gradient(112.1deg, rgb(32, 38, 57) 11.4%, rgb(63, 76, 119) 70.2%)",
      }}
      className="d-flex flex-column justify-content-center w-100 h-100"
    >
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Container
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/52/Rolls-Royce_Motor_Cars_logo.svg"
              alt="brand"
              width="24px"
              className="mx-3"
            />
            <h1 style={{ margin: 0 }} className="display-5">
              Retail Row
            </h1>
          </div>
          <h3 className="my-3 text-center">
            You must be logged in to continue.
          </h3>
          <Row>
            <Col
              xl="6"
              className="d-flex align-items-center justify-content-center"
            >
              <Link
                style={{
                  color: "grey",
                  textDecoration: "none",
                  fontSize: "1rem",
                }}
                to="/login"
              >
                I have an account
              </Link>
            </Col>
            <Col
              xl="6"
              className="d-flex align-items-center justify-content-center"
            >
              <Link
                style={{
                  color: "grey",
                  textDecoration: "none",
                  fontSize: "1rem",
                }}
                to="/signup"
              >
                Sign up
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
