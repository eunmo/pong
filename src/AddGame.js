import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import GameForm from './GameForm';
import { post } from './utils';

function AddGame() {
  const navigate = useNavigate();

  const submit = useCallback(
    (l, r, lp, rp) => {
      post('/api/crud/game', { l, r, lp, rp }, () => {
        navigate('/');
      });
    },
    [navigate]
  );

  return <GameForm title="개인전 기록" submit={submit} />;
}

export default AddGame;
