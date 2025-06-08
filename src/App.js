//the sjsu students - an input box to enter an isbn, , use sce api, then a box , display book title, author, link to the library page and the cover image, textbook name, 
import React, { useState } from "react";

function App() {
  const [isbn, setIsbn] = useState("");
  const [bookData, setBookData] = useState(null);
  const [error, setError] = useState("");

  const fetchBook = async () => {
    if (!isbn.trim()) {
      setError("Please enter an ISBN.");
      setBookData(null);
      return;
    }

    try {
      const response = await fetch(`https://sce.sjsu.edu/isbn/${isbn.trim()}`);
      if (!response.ok) throw new Error("Book not found.");
      const data = await response.json();

      const book = data[`ISBN:${isbn.trim()}`];
      if (!book) throw new Error("No book data found for this ISBN.");

      setBookData({
        title: book.title || "Not available",
        author: book.authors?.[0]?.name || "Not available",
        cover: book.cover?.large || "",
        library_url: book.url || "",
      });
      setError("");
    } catch (err) {
      setError(err.message);
      setBookData(null);
    }
  };

  const handleRefresh = () => {
    setIsbn("");
    setBookData(null);
    setError("");
  };

  return (
    <div style={{ textAlign: "center", padding: "40px", fontFamily: "Arial" }}>
      <h1>SJSU Book Finder</h1>

      <input
        type="text"
        placeholder="Enter ISBN"
        value={isbn}
        onChange={(e) => setIsbn(e.target.value)}
        style={{ padding: "10px", width: "300px", fontSize: "16px" }}
      />
      <br /><br />

      <button onClick={fetchBook} style={{ padding: "10px", marginRight: "10px" }}>
        Submit
      </button>
      <button onClick={handleRefresh} style={{ padding: "10px" }}>
        Refresh
      </button>

      {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}

      {bookData && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            backgroundColor: "#f9f9f9",
            maxWidth: "500px",
            margin: "30px auto",
          }}
        >
          <h2>{bookData.title}</h2>
          <p>Author: {bookData.author}</p>
          <p>
            Library Page:{" "}
            <a href={bookData.library_url} target="_blank">
              {bookData.library_url}
            </a>
          </p>
          {bookData.cover && (
            <img
              src={bookData.cover}
              alt="Book Cover"
              style={{ width: "150px", marginTop: "10px" }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
