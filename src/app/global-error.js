"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap"
        />
      </head>
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#faf4ea",                 // warm cream
            fontFamily: '"DM Sans", sans-serif',   // body font
            padding: "1rem",
          }}
        >
          <div
            style={{
              maxWidth: "28rem",
              width: "100%",
              background: "#fbf8f3",                 // card
              borderRadius: "1.5rem",
              padding: "2rem",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(58, 42, 30, 0.12)", // earth-brown tint
              border: "1px solid #e6ded2",           // warm border
            }}
          >
            <div
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: "2rem",
                fontWeight: 700,
                color: "#c1552c",                    // terracotta
                marginBottom: "0.5rem",
                lineHeight: 1.1,
              }}
            >
              Something went wrong
            </div>

            <h2
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "#3a2a1e",                    // earth brown
                marginBottom: "0.5rem",
              }}
            >
              Application error
            </h2>

            <p
              style={{
                color: "#7a6a58",                    // muted brown
                marginBottom: "1.5rem",
                fontSize: "0.95rem",
                lineHeight: 1.6,
              }}
            >
              The app failed to load. Please refresh the page or try again.
            </p>

            <button
              onClick={() => reset()}
              style={{
                padding: "0.625rem 1.25rem",
                background: "#c1552c",               // terracotta
                color: "white",
                border: "none",
                borderRadius: "0.75rem",
                fontWeight: 600,
                fontFamily: '"DM Sans", sans-serif',
                cursor: "pointer",
                transition: "background 0.3s ease, transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#a84824";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#c1552c";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}