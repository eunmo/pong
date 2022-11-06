import { Fragment, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import LinkButton from './LinkButton';
import { View } from './svg';
import { get, peopleMap } from './utils';
import style from './Person.module.css';

function cmpOpponent(a, b) {
  if (a.rate === b.rate) {
    return peopleMap[a.id].name < peopleMap[b.id].name ? -1 : 1;
  }

  return b.rate - a.rate;
}

function pad(number) {
  return `${number}`.padStart(3, '\xa0');
}

function Person() {
  const [opponents, setOpponents] = useState([]);
  const { id: pid } = useParams();

  useEffect(() => {
    get(`/api/person/summary/${pid}`, (data) => setOpponents(data.opponents));
  }, [pid]);

  const calculated = useMemo(
    () =>
      opponents
        .map(({ id, count, wins }) => ({
          id,
          count,
          wins,
          rate: Math.round((wins / count) * 100),
        }))
        .sort(cmpOpponent),
    [opponents]
  );

  return (
    <div className={style.Person}>
      <div className="header">{peopleMap[pid].name}</div>
      <div className={style.opponents}>
        {calculated.map(({ id, count, wins, rate }) => (
          <Fragment key={id}>
            <LinkButton to={`/person/${id}`} size="sm">
              {peopleMap[id].name}
            </LinkButton>
            <div className={`${style.stat} mono`}>
              {pad(rate)}%{pad(count)}전{pad(wins)}승
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
