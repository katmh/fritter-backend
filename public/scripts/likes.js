/* eslint-disable @typescript-eslint/restrict-template-expressions */

function viewLikes() {
  fetch('/api/likes', {method: 'GET'})
    .then(showResponse)
    .catch(showResponse);
}

function likeFreet(fields) {
  fetch(`/api/likes/${fields.id}`, {method: 'POST'})
    .then(showResponse)
    .catch(showResponse);
}

function unlikeFreet(fields) {
  fetch(`/api/likes/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
