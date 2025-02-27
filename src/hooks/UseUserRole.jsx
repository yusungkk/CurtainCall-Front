import {useEffect, useState} from "react";
import {getUserRole} from "/src/api/userApi.js";

export default function UseUserRole(setActive) {
    const [role, setRole] = useState("ANONYMOUS");

    useEffect(() => {
        const fetchUserRole = async () => {
            const data = await getUserRole();
            if (data === 403) {
                return;
            }
            if (data === true) {
                setRole("ADMIN");
                setActive(true);
                window.sessionStorage.setItem("toggleActive", "true")
                return;
            }
            setRole("USER");
        };
        fetchUserRole();
    }, [role]);
    return [role, setRole];
};
