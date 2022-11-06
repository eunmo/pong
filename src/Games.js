import { Fragment, useMemo, useState } from 'react';

import LinkButton from './LinkButton';
import { Edit } from './svg';
import { peopleMap } from './utils';
import style from './Games.module.css';

function Score({ scores }) {
  return (
    <div className={scores[0] < scores[1] ? 'light-text' : ''}>{scores[0]}</div>
  );
}

function PersonLink({ id, loser }) {
  const to = `/person/${id}`;
  return (
    <LinkButton size="sm" to={to} cn={loser ? style.loser : ''}>
      {peopleMap[id].name}
    </LinkButton>
  );
}

function GameLink({ id }) {
  const to = `/game/edit/${id}`;
  return (
    <LinkButton size="sm" to={to} cn={style.gameLink}>
      <Edit />
    </LinkButton>
  );
}

function cmpGame(a, b) {
  return a.id - b.id;
}

function cmpName(a, b) {
  return peopleMap[a].name < peopleMap[b].name ? -1 : 1;
}

function Games({ games }) {
  const [selected, setSelected] = useState(-1);

  const sortedGames = useMemo(() => games.sort(cmpGame), [games]);

  const participants = useMemo(
    () => [...new Set(games.flatMap(({ l, r }) => [l, r]))].sort(cmpName),
    [games]
  );

  const filtered = useMemo(() => {
    if (selected !== -1) {
      return sortedGames
        .filter(({ l, r }) => [l, r].includes(selected))
        .map(({ id, l, r, lp, rp }) => {
          if (r === selected) {
            return { id, l: r, r: l, lp: rp, rp: lp };
          }
          return { id, l, r, lp, rp };
        });
    }
    return sortedGames;
  }, [sortedGames, selected]);

  return (
    <div className={style.Games}>
      <div className={style.nameGrid}>
        <button
          className={selected === -1 ? style.selected : style.participant}
          type="button"
          onClick={() => setSelected(-1)}
        >
          ALL
        </button>
        {participants.map((id) => (
          <button
            key={id}
            className={selected === id ? style.selected : style.participant}
            type="button"
            onClick={() => setSelected(id)}
          >
            {peopleMap[id].name}
          </button>
        ))}
      </div>
      <div className={style.gameGrid}>
        {filtered.map(({ id, l, r, lp, rp }, index) => (
          <Fragment key={id}>
            <div className="light-text">{index + 1}</div>
            <PersonLink id={l} loser={lp <= rp} />
            <Score scores={[lp, rp]} />
            <Score scores={[rp, lp]} />
            <PersonLink id={r} loser={rp <= lp} />
            <GameLink id={id} type="individual" />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default Games;
