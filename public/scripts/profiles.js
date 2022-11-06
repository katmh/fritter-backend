/* eslint-disable @typescript-eslint/restrict-template-expressions */

function editProfile() {
  fetch('/api/profiles', {method: 'PUT'})
    .then(showResponse)
    .catch(showResponse);
}
