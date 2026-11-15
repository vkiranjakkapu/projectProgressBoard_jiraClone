import useAuthContext from "../../context/useAuthContext";
import ProgressBoard from "../board/ProgressBoard";
import AdminDashboard from "./AdminDashboard";

export default function DashboardPage() {
    const { isAdmin } = useAuthContext();

    return isAdmin ? <AdminDashboard /> : <ProgressBoard />;
}
