export default function OfflinePage() {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            backgroundColor: "#f0f0f0",
            fontFamily: "var(--font-body), sans-serif",
            textAlign: "center",
            padding: "20px"
        }}>
            <h1 style={{ fontFamily: "var(--font-hero), sans-serif", fontSize: "3rem", color: "#333", marginBottom: "1rem" }}>
                OFFLINE MODE
            </h1>
            <p style={{ fontSize: "1.2rem", color: "#666" }}>
                Signal lost! Reconnect to access the mainframe.
            </p>
            <div style={{ fontSize: "4rem", marginTop: "2rem" }}>&#x1F4E1;</div>
        </div>
    );
}
