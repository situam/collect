# collect

beginnings of collection

## installation

- download and extract [pocketbase](https://pocketbase.io/docs/) to `database/pocketbase`
- install node v20:
  - [nvm](https://github.com/nvm-sh/nvm)
  - `$ nvm install 20`

## usage

$ cd database && ./pocketbase serve
$ cd backend && node main.js
$ cd frontend && npm run dev

## roadmap

[X] add human readable ID for collections
  [X] for each entry CO#1, CO#2...
  [ ] QR code / printable label
[ ] Update contribution data model: add date created range (maybe just end date)
[X] Full text search of the title/description
[ ] Text search: all fields?
[ ] Consider implementing inPhysicalCollection internally as just adding the "physical" tag.

Recollection:
[ ] Pagination / lazy load when scrolling
[ ] Single view of single file
[ ] Design the signle views with embedding in mind (e.g. for co-creator)

Processing pipeline:
[X] Check if loop is working
[ ] Split into two running in parrallel: one handling video, one handling th erest

Deployment:
[ ] Password-protect repo ?
[ ] Scripts to run on start ?
[ ] SSH tunnel for remote support

UI:
[X] Greek version

Cocreator:
[X] Add ability to embed a webpage
[ ] Export printable snapshot
[ ] Embedded Co-llection entries: no interaction allowed, work with interaction via popup (only in view mode)
[ ] How to create a space:
    - first and last name
    - Generate button - generates a live agora space


---
References:
-  askiarchives.eu

-----
Collection:
- heading
- introduction text
- visual indicitation of where to upload files
- prompts for each field

Re-collection:
- clicking anywhere on an entry takes you directly to the single view
- dont open in a new tab
- ideally provide a way to go way to the previous context

- How do captions appear?
