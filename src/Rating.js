import { Fragment, useEffect, useState } from 'react';

import { get, peopleMap } from './utils';
import style from './Rating.module.css';

function cmpRating(a, b) {
  if (a.rating === b.rating) {
    return peopleMap[a.id] < peopleMap[b.id] ? -1 : 1;
  }

  return b.rating - a.rating;
}

function Rating() {
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    get('/api/rank', (data) => {
      setRatings(data.ratings.sort(cmpRating));
    });
  }, []);

  return (
    <div>
      <div className="header">Elo 레이팅 순위</div>
      <div className={style.Rating}>
        <div className="light-text">#</div>
        <div className={style.label}>이름</div>
        <div className={style.label}>점수</div>
        {ratings.map(({ id, rating }, index) => (
          <Fragment key={id}>
            <div className={style.rank}>{index + 1}</div>
            <div>{peopleMap[id].name}</div>
            <div className="mono">{rating}</div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default Rating;
