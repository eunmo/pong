import { Fragment, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import LinkButton from './LinkButton';
import { get, peopleMap } from './utils';
import style from './Duo.module.css';

function describe(games, wins) {
  if (games.length === wins) {
    return '전승';
  }
  if (wins === 0) {
    return '전패';
  }

  const [{ lp: lp1, rp: rp1 }] = games;

  if (lp1 > rp1) {
    const streak = games.findIndex(({ lp, rp }) => lp <= rp);
    return `${wins}승 최근 ${streak}${streak > 1 ? '연' : ''}승`;
  }

  const streak = games.findIndex(({ lp, rp }) => lp > rp);
  return `${wins}승 최근 ${streak}${streak > 1 ? '연' : ''}패`;
}

function Duo() {
  const [games, setGames] = useState([]);
  const { id1, id2 } = useParams();

  useEffect(() => {
    get(`/api/game/history/${id1}/${id2}`, (data) => setGames(data.games));
  }, [id1, id2]);

  const sorted = useMemo(
    () =>
      games
        .map(({ r, lp, rp, ...rest }) =>
          r === Number(id1) ? { lp: rp, rp: lp, ...rest } : { lp, rp, ...rest }
        )
        .sort((a, b) => b.id - a.id),
    [games, id1]
  );

  const wins = useMemo(
    () => sorted.filter(({ lp, rp }) => lp > rp).length,
    [sorted]
  );

  const desc = useMemo(() => describe(sorted, wins), [sorted, wins]);

  const [name1, name2] = useMemo(
    () => [peopleMap[id1].name, peopleMap[id2].name],
    [id1, id2]
  );

  return (
    <div className={style.Duo}>
      <div className="header">
        <LinkButton size="sm" to={`/person/${id1}`} cn={style.name}>
          {name1}
        </LinkButton>
        {' vs '}
        <LinkButton size="sm" to={`/person/${id2}`} cn={style.name}>
          {name2}
        </LinkButton>
      </div>
      <div className={style.subtitle}>{`${sorted.length}경기 ${desc}`}</div>
      <div className={style.gameGrid}>
        {sorted.map(({ id, lp, rp, time }) => (
          <Fragment key={id}>
            <LinkButton
              size="sm"
              to={`/game/date/${time.substring(0, 10)}`}
              cn={`${style.date} mono`}
            >
              {time.substring(5, 10)}
            </LinkButton>
            <div>{name1}</div>
            <div className={lp > rp ? 'highlight' : ''}>{lp}</div>
            <div className={lp < rp ? 'highlight' : ''}>{rp}</div>
            <div>{name2}</div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default Duo;
