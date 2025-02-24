import { createContext, useContext, useState } from "react";

const ToggleContext = createContext(false);

export function ToggleProvider({ children }) {
    const [isToggled, setIsToggled] = useState(false);

    return (
        <ToggleContext.Provider value={{ isToggled, setIsToggled }}>
            {children}
        </ToggleContext.Provider>
    )
}

export function useToggle() {
    return useContext(ToggleContext);
}
