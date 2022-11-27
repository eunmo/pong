const { dml, cleanup } = require('@eunmo/mysql');
const { getPersons, getAllPersons } = require('./query');

afterAll(async () => {
  await cleanup();
});

beforeAll(async () => {
  await dml('TRUNCATE TABLE person');
  await dml('INSERT INTO person VALUES (1, 1500), (2, 1400), (3, 1300)');
});

test('get all persons', async () => {
  const persons = await getAllPersons();
  expect(persons.length).toBe(3);

  expect(persons[0].id).toBe(1);
  expect(persons[0].rating).toBe(1500);
  expect(persons[1].id).toBe(2);
  expect(persons[1].rating).toBe(1400);
  expect(persons[2].id).toBe(3);
  expect(persons[2].rating).toBe(1300);
});

test('get persons 2+3', async () => {
  const persons = await getPersons([2, 3]);
  expect(persons.length).toBe(2);

  expect(persons[0].id).toBe(2);
  expect(persons[0].rating).toBe(1400);
  expect(persons[1].id).toBe(3);
  expect(persons[1].rating).toBe(1300);
});
