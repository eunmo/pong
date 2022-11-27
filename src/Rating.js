import { Fragment, useEffect, useMemo, useState } from 'react';

import LinkButton from './LinkButton';
import { get, peopleMap } from './utils';
import style from './Rating.module.css';

function cmpRating(a, b) {
  if (a.rating === b.rating) {
    return peopleMap[a.id].name < peopleMap[b.id].name ? -1 : 1;
  }

  return b.rating - a.rating;
}

function RatingInner({ ratings }) {
  return (
    <div className={style.Rating}>
      <div className="light-text">#</div>
      <div className={style.label}>이름</div>
      <div className={style.label}>점수</div>
      {ratings.map(({ id, rating, rank }) => (
        <Fragment key={id}>
          <div className={style.rank}>{rank}</div>
          <LinkButton size="sm" to={`/person/${id}`} cn={style.name}>
            {peopleMap[id].name}
          </LinkButton>
          <div className="mono">{rating}</div>
        </Fragment>
      ))}
    </div>
  );
}

function Rating() {
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    get('/api/rank', (data) => {
      const sortedRatings = data.sort(cmpRating);
      let prevRank = 1;
      let prevRating = 10000;
      const indexed = sortedRatings.map(({ id, rating }, index) => {
        let rank = index + 1;
        if (prevRating === rating) {
          rank = prevRank;
        } else {
          prevRank = rank;
          prevRating = rating;
        }
        return { id, rating, rank };
      });
      setRatings(indexed);
    });
  }, []);

  const east = useMemo(
    () => ratings.filter(({ rating }) => rating >= 1400),
    [ratings]
  );
  const west = useMemo(
    () => ratings.filter(({ rating }) => rating < 1400),
    [ratings]
  );

  return (
    <div>
      <div className="header">Elo 레이팅 순위</div>
      <div className={style.Ratings}>
        <RatingInner ratings={east} />
        <RatingInner ratings={west} />
      </div>
    </div>
  );
}

export default Rating;
