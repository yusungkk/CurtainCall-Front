import {useEffect, useState} from "react";

export function useToggleActive() {
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (window.sessionStorage.getItem("toggleActive") === "true") {
            setActive(true);
        }
    }, []);

    return [active, setActive];
}