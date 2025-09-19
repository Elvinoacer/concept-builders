
import Categories from "./Categories";
import PopularPosts from "./PopularPosts";

const Sidebar = () => {
  return (
    <div className="space-y-8">
      <Categories />
      <PopularPosts />
    </div>
  );
};

export default Sidebar;
