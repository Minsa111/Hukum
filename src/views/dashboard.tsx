import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


export default function Dashboard(){
    const navigate = useNavigate();

    const handleLogOut = () => {
        localStorage.removeItem("isLoggedIn");
    navigate("/login");
    };
    return(
    
    <Button onClick={handleLogOut}>
        nice
    </Button>
    );
}