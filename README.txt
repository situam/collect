# co-llection

Source repository for the digital co-llection interface.

## installation

- download and extract [pocketbase](https://pocketbase.io/docs/) to `database/pocketbase`
- install node v20:
  - [nvm](https://github.com/nvm-sh/nvm)
  - `$ nvm install 20`

## usage

$ sh start_collector.sh

## autostart

```
sudo cp co-llection.service /etc/systemd/system/co-llection.service
sudo systemctl daemon-reload
sudo systemctl enable co-llection.service
sudo systemctl start co-llection.service
```

## roadmap

### April 2025:

[ ] publish the publication
    [ ] add publication viewing mode:
        - default unlocked
        - nothing selectable
        - no adding/uploading
    [ ] add option to disable "out of site destroyed" so that sound files play

[X] Scripts to run on start
  [ ] Document setup:
    - add collection.service to git
    - add readme to indicate how to do this (see devlog.txt)
[ ] Run on local network
[ ] Backup strategy

(hopefully)
[ ] make some more spaces for co-creator
[ ] brainstorm space management system
    [ ] think about access control (i.e. start with online as view-only)
[ ] brainstorm online version


### Backlog:

[X] add human readable ID for collections
  [X] for each entry CO#1, CO#2...
  [ ] QR code / printable label
[ ] Update contribution data model:
    [ ] add date created range (maybe just end date)
    [ ] change location tags to points on a map
[X] Full text search of the title/description
[ ] Text search: all fields?
[ ] Consider implementing inPhysicalCollection internally as just adding the "physical" tag.

Recollection:
[ ] Pagination / lazy load when scrolling
[ ] Single view of single file
[ ] Design the single views with embedding in mind (e.g. for co-creator)

Processing pipeline:
[X] Check if loop is working
[ ] Split into two running in parallel: one handling video, one handling the rest

Deployment:
[ ] Password-protect repo ?

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
- visual indication of where to upload files
- prompts for each field

Re-collection:
- clicking anywhere on an entry takes you directly to the single view
- dont open in a new tab
- ideally provide a way to go way to the previous context

- How do captions appear?
