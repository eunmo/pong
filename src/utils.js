import { teams, people } from './people';

function get(url, callback) {
  fetch(url)
    .then((response) => response.json())
    .then(callback);
}

function post(url, body, callback) {
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(callback);
}

function put(url, body, callback) {
  fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(callback);
}

function fetchDelete(url, body, callback) {
  fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(callback);
}

function toMap(list) {
  return Object.fromEntries(list.map((element) => [element.id, element]));
}

const teamMap = toMap(teams);
const peopleMap = toMap(people);
const peopleGrouped = teams.map((team) => ({
  ...team,
  people: people.filter(({ team: teamId }) => teamId === team.id),
}));

function formatDate(date) {
  const m = parseInt(date.substring(5, 7), 10);
  const d = parseInt(date.substring(8, 10), 10);

  return `${m}월 ${d}일`;
}

function displayDiff(diff) {
  return diff > 0 ? `+${diff}` : diff;
}

export {
  get,
  post,
  put,
  fetchDelete,
  teams,
  teamMap,
  people,
  peopleMap,
  peopleGrouped,
  formatDate,
  displayDiff,
};
