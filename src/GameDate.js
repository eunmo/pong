import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Games from './Games';
import { get, formatDate } from './utils';

function GameDate() {
  const [games, setGames] = useState();
  const { date } = useParams();

  useEffect(() => {
    get(`/api/game/date/${date}`, (data) => setGames(data.games));
  }, [date]);

  return (
    <div>
      <div className="header">{formatDate(date)}</div>
      <div>{games && <Games games={games} />}</div>
    </div>
  );
}

export default GameDate;
