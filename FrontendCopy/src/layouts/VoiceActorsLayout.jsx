// VoiceActorsLayout.jsx
import { Link } from "react-router-dom";

const VoiceActorsLayout = ({ characters, animeId }) => {
  if (!characters?.length) return null;

  return (
    <section className="rounded-xl border border-gray-800 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base md:text-lg font-semibold text-white">Characters & Voice Actors</h2>
        <Link to={`/characters/${animeId}`} className="text-sm text-gray-400 hover:text-indigo-400">
          View more →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {characters.slice(0, 6).map((char) => (
          <div key={char.id} className="flex items-center justify-between gap-4 rounded-lg border border-gray-800 bg-gray-900/40 p-3">
            <div className="flex items-center gap-3">
              <Link to={`/character/${char.id}`}>
                <img src={char.image} alt={char.name} className="h-9 w-9 rounded-full object-cover" />
              </Link>
              <div>
                <Link to={`/character/${char.id}`} className="text-xs font-semibold text-white hover:text-indigo-400">
                  {char.name}
                </Link>
                <p className="text-[11px] text-gray-400">{char.role}</p>
              </div>
            </div>
            {char.voiceActor && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <Link to={`/staff/${char.voiceActor.id}`} className="text-xs font-semibold text-white hover:text-indigo-400">
                    {char.voiceActor.name}
                  </Link>
                  <p className="text-[11px] text-gray-400">Japanese</p>
                </div>
                <Link to={`/staff/${char.voiceActor.id}`}>
                  <img src={char.voiceActor.image} alt={char.voiceActor.name} className="h-9 w-9 rounded-full object-cover" />
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default VoiceActorsLayout;