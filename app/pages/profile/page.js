import FavoriteBooks from "./components/FavoriteBooks";
import RecommendedBooks from "./components/RecommendedBooks";
import { currentUser } from "@clerk/nextjs/server";

const ProfilePage = async () => {
  const user = await currentUser();

  return (
    <div
      className="container mx-auto px-4 py-8"
      role="main"
      aria-label="User profile page"
    >
      <div
        className="bg-surface rounded-lg border border-border p-6 mb-6"
        role="region"
        aria-label="User profile information"
      >
        <div className="flex justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              {user?.username}
            </h2>
          </div>
        </div>
      </div>

      <FavoriteBooks />
      <RecommendedBooks />
    </div>
  );
};

export default ProfilePage;
