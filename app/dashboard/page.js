import { currentUser } from "@clerk/nextjs/server";
import FetchData from "./Components/FetchData";

const dashboard = async () => {
    const user = await currentUser();
    const username = user.username;

    return (
        <main className="w-full py-8 md:py-16">
            <div
                className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10"
                role="main"
                aria-label={`${username}'s public profile`}>
                
                {/* Profile Header */}
                <div className="border-b border-border/80 pb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-textPrimary tracking-tight">
                            {username}
                        </h1>
                        <p className="text-xs text-textSecondary mt-1 uppercase tracking-widest font-mono">
                            Member Dashboard Drawer
                        </p>
                    </div>
                </div>

                <div className="space-y-10">
                    <FetchData userName={username} />
                </div>
            </div>
        </main>
    );
};

export default dashboard;
