import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminDashboard from "./Components/AdminDashboard";

const AdminPage = async () => {
    const user = await currentUser();

    if (!user || user.publicMetadata?.role !== "admin") {
        redirect("/");
    }

    return (
        <main className="w-full py-8 md:py-16">
            <div
                className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10"
                role="main"
                aria-label="Admin dashboard">
                
                {/* Admin Header */}
                <div className="border-b border-border/80 pb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-textPrimary tracking-tight">
                            Admin Control Panel
                        </h1>
                        <p className="text-xs text-textSecondary mt-1 uppercase tracking-widest font-mono">
                            System Overview & Book Moderation
                        </p>
                    </div>
                </div>

                <div className="space-y-8">
                    <AdminDashboard />
                </div>
            </div>
        </main>
    );
};

export default AdminPage;
