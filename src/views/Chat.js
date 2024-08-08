import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

function Chat() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userPhotos, setUserPhotos] = useState({});
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    const chatRef = collection(db, "chats", chatId, "messages");
    const q = query(chatRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);

      // Fetch user photos for unique senders
      const uniqueSenders = [...new Set(messagesData.map((msg) => msg.sender))];
      uniqueSenders.forEach(fetchUserPhoto);
    });

    return () => unsubscribe();
  }, [chatId, db]);

  const fetchUserPhoto = async (uid) => {
    if (userPhotos[uid]) return;
    try {
      const profileFolderRef = ref(storage, `profile/${uid}`);
      const fileList = await listAll(profileFolderRef);

      if (fileList.items.length > 0) {
        const fileRef = fileList.items[0];
        const url = await getDownloadURL(fileRef);
        setUserPhotos((prev) => ({ ...prev, [uid]: url }));
      } else {
        // Set default image if no profile image is found
        setUserPhotos((prev) => ({
          ...prev,
          [uid]:
            "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
        }));
      }
    } catch (error) {
      console.error("Error fetching user photo:", error);
      setUserPhotos((prev) => ({
        ...prev,
        [uid]:
          "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
      }));
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: newMessage,
      sender: auth.currentUser.uid,
      timestamp: new Date(),
    });

    setNewMessage("");
  };

  const renderMessages = () => {
    return messages.map((msg, index) => {
      const isCurrentUser = msg.sender === auth.currentUser.uid;
      const showPhoto =
        index === 0 || messages[index - 1].sender !== msg.sender;

      return (
        <div
          key={msg.id}
          style={{
            display: "flex",
            justifyContent: isCurrentUser ? "flex-end" : "flex-start",
            marginBottom: "10px",
          }}
        >
          {!isCurrentUser && (
            <div style={{ width: "42px", marginRight: "10px" }}>
              {showPhoto && (
                <img
                  src={
                    userPhotos[msg.sender] ||
                    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                  }
                  alt="User"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                  }}
                />
              )}
            </div>
          )}
          <div
            style={{
              background: isCurrentUser ? "#dcf8c6" : "#f1f0f0",
              padding: "8px 12px",
              borderRadius: "12px",
              maxWidth: "70%",
            }}
          >
            {msg.text}
          </div>
          {isCurrentUser && (
            <div style={{ width: "42px", marginLeft: "10px" }}>
              {showPhoto && (
                <img
                  src={
                    userPhotos[msg.sender] ||
                    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                  }
                  alt="User"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                  }}
                />
              )}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div
        style={{
          height: "400px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        {renderMessages()}
      </div>
      <form onSubmit={sendMessage} style={{ display: "flex" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ flex: 1, padding: "10px", marginRight: "10px" }}
          placeholder="Type a message..."
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
