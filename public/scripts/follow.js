/* eslint-disable @typescript-eslint/restrict-template-expressions */

function followUser(fields) {
  fetch(`/api/follow?username=${fields.username}`, {method: 'POST'})
    .then(showResponse)
    .catch(showResponse);
}

function unfollowUser(fields) {
  fetch(`/api/follow?username=${fields.username}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
