/* eslint-disable @typescript-eslint/restrict-template-expressions */

function addToReadingList(fields) {
  fetch(`/api/readinglist/${fields.id}`, {method: 'POST'})
    .then(showResponse)
    .catch(showResponse);
}

function removeFromReadingList(fields) {
  fetch(`/api/readinglist/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function clearReadingList() {
  fetch('/api/readinglist/', {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
