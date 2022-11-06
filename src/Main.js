import { useEffect, useState } from 'react';

import Games from './Games';
import LinkButton from './LinkButton';
import { get } from './utils';

function Main() {
  const [games, setGames] = useState();

  useEffect(() => {
    const dateString = new Date().toISOString().substring(0, 10);
    get(`/api/game/date/${dateString}`, (data) => {
      setGames(data.games);
    });
  }, []);

  return (
    <div>
      <LinkButton size="lg" to="game/add">
        개인전 기록
      </LinkButton>
      <LinkButton size="lg" to="game/calendar">
        과거 기록 열람
      </LinkButton>
      {games && <Games games={games} editable />}
    </div>
  );
}

export default Main;
