import PopularPosts from "./PopularPosts";

const Sidebar = () => {
  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10 w-full">
      {/* Categories removed */}
      <PopularPosts />
    </div>
  );
};

export default Sidebar;
