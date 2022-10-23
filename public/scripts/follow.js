/* eslint-disable @typescript-eslint/restrict-template-expressions */

function followUser(fields) {
  console.log(fields);
  fetch(`/api/follow?username=${fields.username}`, {method: 'POST'})
    .then(showResponse)
    .catch(showResponse);
}
