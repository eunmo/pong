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

function PersonLink({ id, loser, cn }) {
  const to = `/person/${id}`;
  return (
    <LinkButton size="sm" to={to} cn={cn ?? (loser ? style.loser : '')}>
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

function displayD(d) {
  return d > 0 ? `+${d}` : d;
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
        .map(({ id, l, r, lp, rp, d }) => {
          if (r === selected) {
            return { id, l: r, r: l, lp: rp, rp: lp, d: -d };
          }
          return { id, l, r, lp, rp, d };
        });
    }
    return sortedGames.map(({ id, l, r, lp, rp, d }) => {
      if (rp > lp) {
        return { id, l: r, r: l, lp: rp, rp: lp, d: -d };
      }
      return { id, l, r, lp, rp, d };
    });
  }, [sortedGames, selected]);
  const diffSum = useMemo(() => {
    if (selected === -1) {
      return;
    }
    return filtered.map(({ d }) => d).reduce((a, b) => a + b, 0);
  }, [selected, filtered]);

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
        {selected !== -1 && (
          <>
          <PersonLink cn={style.totalLeft} id={selected} />
          <div className={style.total}>{displayD(diffSum)} </div>
          <div className={style.totalRight} />
          </>
        )}
        {filtered.map(({ id, l, r, lp, rp, d }, index) => (
          <Fragment key={id}>
            <div className="light-text">{index + 1}</div>
            <PersonLink id={l} loser={lp <= rp} />
            <div className={style.numberGrid}>
              <Score scores={[lp, rp]} />
              <Score scores={[rp, lp]} />
              <div className={style.d}>{displayD(d)}</div>
            </div>
            <PersonLink id={r} loser={rp <= lp} />
            <GameLink id={id} type="individual" />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default Games;
