import { Fragment, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import LinkButton from './LinkButton';
import { View } from './svg';
import { get, peopleMap, displayDiff } from './utils';
import style from './Person.module.css';

function cmpOpponent(a, b) {
  if (a.rating === b.rating) {
    return peopleMap[a.id].name < peopleMap[b.id].name ? -1 : 1;
  }

  return b.rating - a.rating;
}

function Person() {
  const [opponents, setOpponents] = useState([]);
  const { id: pid } = useParams();

  useEffect(() => {
    get(`/api/person/summary/${pid}`, setOpponents);
  }, [pid]);

  const calculated = useMemo(
    () =>
      opponents
        .map(({ id, count, wins, rating, diff }) => ({
          id,
          rate: Math.round((wins / count) * 100),
          rating,
          diff,
        }))
        .sort(cmpOpponent),
    [opponents]
  );

  return (
    <div className={style.Person}>
      <div className="header">{peopleMap[pid].name}</div>
      <div className={style.opponents}>
        <div className="light-text">Elo</div>
        <div className="light-text">상대</div>
        <div className="light-text">승률</div>
        <div className="light-text">변동</div>
        <div className="light-text">전적</div>
        {calculated.map(({ id, rate, rating, diff }) => (
          <Fragment key={id}>
            <div className={`${style.stat} mono light-text`}>{rating}</div>
            <LinkButton to={`/person/${id}`} size="sm">
              {peopleMap[id].name}
            </LinkButton>
            <div className={`${style.stat} ${style.rate} mono`}>{rate}%</div>
            <div className={`${style.stat} ${style.wins} mono`}>
              {displayDiff(diff)}
            </div>
            <LinkButton to={`/duo/${pid}/${id}`} size="sm" cn={style.button}>
              <View />
            </LinkButton>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default Person;
