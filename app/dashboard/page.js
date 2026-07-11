import { currentUser } from "@clerk/nextjs/server";
import FetchData from "./Components/FetchData";

const dashboard = async () => {
    const user = await currentUser();
    const username = user.username;

    return (
        <div
            className="container mx-auto px-4 py-8"
            role="main"
            aria-label={`${username}'s public profile`}>
            <div
            className="bg-surface rounded-lg border border-border p-6 mb-6"
            role="region"
            aria-label="User profile information">
            <div className="flex justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">
                        {username}
                    </h1>
                </div>
            </div>
        </div>

            <FetchData userName={username} />

        </div>
    );
};

export default dashboard;
