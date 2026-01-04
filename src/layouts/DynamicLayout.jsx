import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import Heading from "../components/Heading";
import MiniPoster from "../components/MiniPoster";

const DynamicLayout = ({ title, data, endpoint }) => {
  return (
    <div className="w-full">
      {/* Header - Clean and Professional */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-600/40">
        <Heading className="text-base font-semibold text-white">
          {title}
        </Heading>
        
        <Link 
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-gray-700/80 text-gray-200 hover:bg-blue-600 hover:text-white transition-all duration-200"
          to={`/animes/${endpoint}`}
        >
          <span>View All</span>
          <FaAngleRight className="text-xs" />
        </Link>
      </div>
      
      {/* Content - Seamless Integration */}
      <div className="space-y-2">
        {data && data.map((item) => (
          <div 
            key={item.id} 
            className="bg-gray-800/60 hover:bg-gray-700/80 rounded-lg p-2.5 transition-all duration-200 border border-transparent hover:border-blue-500/30"
          >
            <MiniPoster item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicLayout;