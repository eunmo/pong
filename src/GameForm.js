import { useCallback, useEffect, useMemo, useState } from 'react';

import { people, peopleMap } from './utils';
import style from './GameForm.module.css';

function PersonSelect({ peopleSorted, onClick }) {
  return (
    <>
      {peopleSorted.map(({ name, id }) => (
        <input
          type="button"
          key={id}
          value={name}
          onClick={() => onClick(id)}
        />
      ))}
    </>
  );
}

function PointInput({ value, setValue, onDone }) {
  const onClick = useCallback(() => {
    setValue(value);
    onDone();
  }, [value, setValue, onDone]);

  return <input type="button" value={value} onClick={onClick} />;
}

function getInputClass(value, target, selected) {
  if (target === selected) {
    return style.selectedInput;
  }

  if (value === undefined) {
    return style.noInput;
  }

  return '';
}

const steps = ['person1', 'point1', 'point2', 'person2'];

function GameForm({
  title,
  l: defaultL,
  r: defaultR,
  lp: defaultLp,
  rp: defaultRp,
  editMode = false,
  submit,
  deleteCallback,
}) {
  const [l, setL] = useState(defaultL);
  const [r, setR] = useState(defaultR);
  const [lp, setLp] = useState(defaultLp);
  const [rp, setRp] = useState(defaultRp);
  const [step, setStep] = useState(steps[0]);
  const [automatic, setAutomatic] = useState(true);

  useEffect(() => {
    if (editMode) {
      setStep(null);
      setAutomatic(false);
    } else {
      setStep(steps[0]);
      setAutomatic(true);
    }
  }, [editMode]);

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();
      submit(l, r, lp, rp);
    },
    [l, lp, r, rp, submit]
  );

  const next = useCallback(() => {
    if (automatic) {
      const index = steps.findIndex((e) => e === step) + 1;
      if (index === steps.length) {
        setStep();
      } else {
        setStep(steps[index]);
      }
    } else {
      setStep();
    }
  }, [step, automatic]);

  const selectPerson = useCallback(
    (target, id) => {
      if (target === 'person1') {
        setL(id);
      } else {
        setR(id);
      }
      next();
    },
    [next]
  );

  const manualInput = useCallback((target) => {
    if (target === 'point1') {
      setLp();
    }
    if (target === 'point2') {
      setRp();
    }
    setAutomatic(false);
    setStep(target);
  }, []);

  const peopleSorted = useMemo(
    () =>
      people
        .filter(({ mia }) => !mia)
        .sort((a, b) => (a.name < b.name ? -1 : 1)),
    []
  );

  return (
    <div className={style.GameForm}>
      <div className="header">{title}</div>
      <form onSubmit={onSubmit}>
        <label>선수 1</label>
        <label>점수 1</label>
        <label>점수 2</label>
        <label>선수 2</label>
        {[
          [peopleMap[l]?.name, l, 'person1'],
          [lp, lp, 'point1'],
          [rp, rp, 'point2'],
          [peopleMap[r]?.name, r, 'person2'],
        ].map(([displayValue, value, key]) => (
          <input
            key={key}
            type="button"
            value={displayValue ?? '선택'}
            className={getInputClass(value, key, step)}
            onClick={() => manualInput(key)}
          />
        ))}
        {['person1', 'person2'].includes(step) && (
          <div className={style.personSelect}>
            <label className={style.pointInputDivider}>선수 선택</label>
            <PersonSelect
              peopleSorted={peopleSorted}
              onClick={(id) => selectPerson(step, id)}
            />
          </div>
        )}
        {['point1', 'point2'].includes(step) && (
          <div className={style.pointInput}>
            <label className={style.pointInputDivider}>점수 선택</label>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((v) => (
              <PointInput
                key={v}
                value={v}
                setValue={step === 'point1' ? setLp : setRp}
                onDone={automatic ? next : () => {}}
              />
            ))}
          </div>
        )}
        <input
          type="submit"
          value={editMode ? '수정' : '저장'}
          disabled={!(l && r && lp !== undefined && rp !== undefined)}
        />
        {deleteCallback && (
          <input
            type="button"
            value="삭제"
            className={style.delete}
            onClick={deleteCallback}
          />
        )}
      </form>
    </div>
  );
}

export default GameForm;
