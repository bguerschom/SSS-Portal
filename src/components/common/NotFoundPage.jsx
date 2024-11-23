import React from "react";

const NotFoundPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 - Page Not Found</h1>
      <p style={styles.description}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <a href="/" style={styles.link}>
        Go Back to Home
      </a>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    color: "#343a40",
  },
  description: {
    fontSize: "1rem",
    color: "#6c757d",
    margin: "1rem 0",
  },
  link: {
    fontSize: "1rem",
    color: "#007bff",
    textDecoration: "none",
    marginTop: "1rem",
  },
};

export default NotFoundPage;
