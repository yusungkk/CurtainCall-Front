import {useEffect, useState} from "react";
import {getUserRole} from "/src/api/userApi.js";

export default function UseUserRole() {
    const [role, setRole] = useState("");

    useEffect(() => {
        const fetchUserRole = async () => {
            const data = await getUserRole();
            if (data === 403) {
                setRole("ANONYMOUS");
                return;
            }
            if (data === true) {
                setRole("ADMIN");
                return;
            }
            setRole("USER");
        };
        fetchUserRole();
    }, [role]);

    return [role];
};