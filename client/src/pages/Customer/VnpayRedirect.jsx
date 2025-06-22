import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function VnpayRedirect() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Chuyển hướng sang trang giao diện đẹp, giữ nguyên query string
        navigate(`/payment-success${location.search}`, { replace: true });
    }, [navigate, location.search]);

    return <div>Đang chuyển hướng...</div>;
}

export default VnpayRedirect;