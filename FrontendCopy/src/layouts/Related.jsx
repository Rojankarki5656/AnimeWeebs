// Related.jsx
import { Link } from "react-router-dom";
import { LinkIcon } from "lucide-react";

const Related = ({ relations }) => {
  if (!relations?.length) return null;

  return (
    <section className="mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500">
          <LinkIcon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">Related Series</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {relations.map((rel, idx) => (
          <Link
            key={rel.id || idx}
            to={`/anime/${rel.id}`}
            className="group flex items-center gap-4 p-3 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-purple-500 transition"
          >
            <div className="flex-1">
              <p className="text-xs text-purple-400 mb-1">{rel.type || "Relation"}</p>
              <p className="font-medium text-white group-hover:text-purple-300">{rel.title}</p>
              <p className="text-xs text-gray-400">{rel.info || rel.mediaType}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Related;