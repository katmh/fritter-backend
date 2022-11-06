/api/users/
/api/follows/

PUT /api/profiles/ - Edit profile
- 403 if not logged in

POST /api/freets/

GET /api/likes/ - View all liked freets
- 403 if not logged in
POST /api/likes/:id - Like freet with ID id
- 404 if not found
- 403 if not logged in
- Idempotent
DELETE /api/likes/:id - Unlike freet with ID id

/api/readinglist/ (singular)
POST /api/readinglist/:id - Add freet with ID id to reading list
DELETE /api/readinglist/:id - Remove freet
DELETE /api/readinglist - Clear all

POST /api/collaborativemoments/ - Create CM
- title nonempty and <= x chars
- description <= y chars

PUT /api/collaborativemoments/:id - Edit CM details & freets
DELETE /api/collaborativemoments/:id - Delete CM

---

# POST /api/cm/:id/entries
Add freets to a collaborative moment.

## Parameters
- `id` (required, in URL): ID of the collaborative moment to add freets to
- `freets[]` (required, in request body): list of freet IDs

## Returns
- Success message
- The updated collaborative moment

## (Notes)

If it were a regular function, it'd look something like:
```
addFreetsToCM(cmId: string, freets: Types.ObjectId[]): cm
```

---

## collection methods

- add
- find
- update
- delete

suffixes
- one
- many
- by [something]


client makes a request to...
`POST /api/collaborativemoments`
the request body contains the title, description, admins, etc.
of the collaborative moment that the user wants to create

then, router makes a call to...
`CMCollection.addOne(someArguments)`
CMCollection is a class with methods for interfacing
with the `collaborativemoments` collection in MongoDB

what should someArguments be?

