import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminDashboard from "./Components/AdminDashboard";

const AdminPage = async () => {
    const user = await currentUser();

    if (!user || user.publicMetadata?.role !== "admin") {
        redirect("/");
    }

    return (
        <div
            className="container mx-auto px-4 py-8"
            role="main"
            aria-label="Admin dashboard">
            <div className="bg-surface rounded-lg border border-border p-6 mb-6">
                <h1 className="text-2xl font-bold text-textPrimary">
                    Admin Dashboard
                </h1>
            </div>

            <AdminDashboard />
        </div>
    );
};

export default AdminPage;
