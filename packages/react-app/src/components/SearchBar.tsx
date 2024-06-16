import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useStore } from "../store/store";

const SearchBar = () => {
  const { setSearchString, searchString } = useStore();
  return (
    <div className="flex border-gray-500">
      <form className="flex items-center space-x-5 rounded-md shadow-md">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />

        <input
          type="text"
          placeholder="Search"
          className="flex-1 outline-none p-2 bg-transparent text-white placeholder-gray-400 border  rounded-md focus:border-blue-500"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
        <button type="button" hidden></button>
      </form>
      {/* <Avatar name="HeyHey" round size="44" color="#0055D1" /> */}
    </div>
  );
};

export default SearchBar;
