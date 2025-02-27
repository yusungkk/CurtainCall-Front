import { useToggle } from "./ToggleContext";

function GlobalToggleIcon() {
    const { isToggled, setIsToggled } = useToggle();

    return (
        <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", cursor: "pointer", zIndex: "990",}}>
            <button
                onClick={() => setIsToggled(!isToggled)}
                style={{
                    fontSize: "2.5rem",
                    padding: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#800000",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    width: "4.5rem",
                    height: "4.5rem",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",

                }}
            >
                💬
            </button>
        </div>
    );
}

export default GlobalToggleIcon;
