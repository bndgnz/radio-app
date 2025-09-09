import PlayingNowReader from "@/src/components/Layout/components/playingNow";

interface PlayingTodayProps {
  url?: string;
  show?: string;
  title?: string;
}

function PlayingToday({ url, show = "Waiheke Radio", title = "Playing Today" }: PlayingTodayProps) {
  // Default URL for the playing now feed
  const defaultUrl = url || "https://waihekeradio.com/api/playing-now";
  
  return (
    <div className="playing-today-component">
      <div className="playing-today-header">
        <h3>{title}</h3>
      </div>
      <div className="playing-today-content">
        <PlayingNowReader url={defaultUrl} show={show} />
      </div>
    </div>
  );
}

export default PlayingToday;