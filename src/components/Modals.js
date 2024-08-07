import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PostModals = ({
  showLogoutModal,
  setShowLogoutModal,
  showLoginModal,
  setShowLoginModal,
  showOwnerModal,
  setShowOwnerModal,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>You have been logged out successfully.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You need to be logged in to perform this action. Please log in and try
          again.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => navigate("/login")}>
            Log in
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showOwnerModal} onHide={() => setShowOwnerModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Unauthorized</Modal.Title>
        </Modal.Header>
        <Modal.Body>You are not allowed to perform this function.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOwnerModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PostModals;
