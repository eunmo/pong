import { useEffect, useState } from 'react';

import Games from './Games';
import LinkButton from './LinkButton';
import { get } from './utils';
import style from './Main.module.css';

function TodayGames() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const dateString = new Date().toISOString().substring(0, 10);
    get(`/api/game/date/${dateString}`, (data) => {
      setGames(data.games);
    });
  }, []);

  if (games.length === 0) {
    return null;
  }

  return (
    <>
      <div className={style.gamesHeader}>오늘의 결과</div>
      <Games games={games} />
    </>
  );
}

function Main() {
  return (
    <div className={style.Main}>
      <div>
        <LinkButton size="lg" to="game/add">
          개인전 기록
        </LinkButton>
        <LinkButton size="lg" to="game/calendar">
          과거 기록 열람
        </LinkButton>
        <LinkButton size="lg" to="rating">
          순위표
        </LinkButton>
      </div>
      <div>
        <TodayGames />
      </div>
    </div>
  );
}

export default Main;
