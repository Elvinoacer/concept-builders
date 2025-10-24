
import PopularPosts from "./PopularPosts";

const Sidebar = () => {
  return (
    <div className="space-y-8">
      {/* Categories removed */}
      <PopularPosts />
    </div>
  );
};

export default Sidebar;
