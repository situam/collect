import Tagify from '@yaireo/tagify'
import '@yaireo/tagify/dist/tagify.css'

import PocketBase from 'pocketbase'

import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

const uppy = new Uppy().use(Dashboard, { inline: true, target: '#uppy-dashboard',

/*
metaFields: [
  { id: 'name', name: 'Name', placeholder: 'file name' },
  { id: 'tags', name: 'Keywords', placeholder: 'specify extra keywords (comma separated)' },
  {
    id: 'public',
    name: 'Public',
    render({ value, onChange, required, form }, h) {
      return h('input', {
        type: 'text',
        form,
        onChange: (ev) => {
          console.log("onChange:", ev.target.value)
          onChange(ev.target.value)
        },
        defaultValue: value
        //defaultChecked: value === 'on',
      });
    },
  },
],
*/

});
window.uppy = uppy

const pb = new PocketBase('http://127.0.0.1:8090')
pb.autoCancellation(false);

const fileInput = document.querySelector('input#files')

// https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
const imageFileTypes = [
  "image/apng",
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/pjpeg",
  "image/png",
  "image/svg+xml",
  "image/tiff",
  "image/webp",
  "image/x-icon",
];

function fileIsImage(file) {
  return fileTypes.includes(file.type);
}

function FilePreview(file) {
  if (file.type.includes('image')) {
    return `<img src="${URL.createObjectURL(file)}"/>`
  }

  if (file.type.includes('video')) {
    return `<video><source src="${URL.createObjectURL(file)}"></video>`
  }
  
  return ''
}

/*
fileInput.addEventListener('change', ()=>{
  const preview = document.querySelector("#filesPreview")
  while (preview.firstChild) {
    preview.removeChild(preview.firstChild);
  }
  const curFiles = fileInput.files;
  let h = `<table>`

  for (const file of curFiles) {  
    h +=`<tr>
      <td>${FilePreview(file)}</td>
      <td>${file.name}</td>
      <!--<td>(tags)</td>-->
    </tr>`
  }

  h +=`</table>`
  preview.innerHTML = h
})
*/

const tagRecords = await pb.collection('tags').getFullList()
let tagList = tagRecords.map(rec=>({
  value: rec.tag,
  name: rec.id
}))
const tags = new Tagify(document.querySelector('input#tags'), {
  whitelist: tagList,
  maxTags: 10,
  dropdown: {
    maxItems: 20,           // <- mixumum allowed rendered suggestions
    classname: 'tags-look', // <- custom classname for this dropdown, so it could be targeted
    enabled: 0,             // <- show suggestions on focus
    closeOnSelect: false    // <- do not hide the suggestions dropdown once an item has been selected
  }
})

const locationRecords = await pb.collection('locations').getFullList()
let locationList = locationRecords.map(rec=>({
  value: rec.location,
  name: rec.id
}))
const locations = new Tagify(document.querySelector('input#location'), {
  whitelist: locationList,
  maxTags: 10,
  dropdown: {
    maxItems: 20,           // <- mixumum allowed rendered suggestions
    classname: 'tags-look', // <- custom classname for this dropdown, so it could be targeted
    enabled: 0,             // <- show suggestions on focus
    closeOnSelect: false    // <- do not hide the suggestions dropdown once an item has been selected
  }
})

const form = document.querySelector('form');
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (document.querySelector('input#tags').tagifyValue==='' || JSON.parse(document.querySelector('input#tags').tagifyValue).length < 3) {
    // tags empty
    alert("please select at least 3 tags")
    return
  }

  // create/get tag records 
  let tagRecordIds = []
  await Promise.all(JSON.parse(document.querySelector('input#tags').tagifyValue).map(async tag=>{
    if (!tag.name) {
      console.log("make new tag: ", tag.value)
      // new tag, need to create
      const record = await pb.collection('tags').create({
        'tag': tag.value
      });
      tagRecordIds = [...tagRecordIds, record.id]
    } else {
      tagRecordIds = [...tagRecordIds, tag.name]
    }
  }))
  //console.log("tagRecordIds", tagRecordIds)

  // create/get location records
  let locationRecordIds = []
  await Promise.all(JSON.parse(document.querySelector('input#location').tagifyValue).map(async tag=>{
    if (!tag.name) {
      console.log("make new location: ", tag.value)
      // new tag, need to create
      const record = await pb.collection('locations').create({
        'location': tag.value
      });
      locationRecordIds = [...locationRecordIds, record.id]
    } else {
      locationRecordIds = [...locationRecordIds, tag.name]
    }
  }))
  console.log("locationRecordIds", locationRecordIds)
  
  // upload files, get file records
  let fileRecordIds = []
  let files = uppy.getFiles().map(uppyFile=>uppyFile.data)
  for (const file of files) {
  //for (const file of fileInput.files) {
    let formData = new FormData()
    formData.append('file', file)
    const createdRecord = await pb.collection('files').create(formData);
    fileRecordIds = [...fileRecordIds, createdRecord.id]
  }
  console.log("fileRecordIds",fileRecordIds)

  // add contribution
  await pb.collection('contributions').create({
    'description': document.querySelector("input#description").value,
    'contributor_name': document.querySelector("input#contributor_name").value,
    'tags': tagRecordIds,
    'location': locationRecordIds,
    'author': document.querySelector("input#author").value,
    'physical': document.querySelector("input#physical").checked,
    'date_created': document.querySelector("input#date_created").value,
    'files': fileRecordIds
  });

  alert("Submission saved to collection.")
  window.location.reload()
});