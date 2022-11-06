import { Fragment } from 'react';

import LinkButton from './LinkButton';
import { Edit } from './svg';
import { peopleMap } from './utils';
import style from './Games.module.css';

function Score({ scores }) {
  return (
    <div className={scores[0] < scores[1] ? 'light-text' : ''}>{scores[0]}</div>
  );
}

function GameLink({ id }) {
  const to = `/game/edit/${id}`;
  return (
    <LinkButton size="sm" to={to} cn={style.button}>
      <Edit />
    </LinkButton>
  );
}

function Games({ games }) {
  return (
    <div className={style.Games}>
      {games.map(({ id, l, r, lp, rp }, index) => (
        <Fragment key={id}>
          <div className="light-text">{index + 1}</div>
          <div className={lp > rp ? 'highlight' : ''}>{peopleMap[l]?.name}</div>
          <Score scores={[lp, rp]} />
          <Score scores={[rp, lp]} />
          <div className={lp < rp ? 'highlight' : ''}>{peopleMap[r]?.name}</div>
          <GameLink id={id} type="individual" />
        </Fragment>
      ))}
    </div>
  );
}

export default Games;
