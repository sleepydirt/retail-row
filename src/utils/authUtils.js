import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export const handleLogout = async (setShowLogoutModal) => {
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
};

export const handleCreatePost = (navigate, setShowLoginModal, user) => {
  if (user) {
    navigate("/add");
  } else {
    setShowLoginModal(true);
  }
};
