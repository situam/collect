import Tagify from "@yaireo/tagify";
import "@yaireo/tagify/dist/tagify.css";
import { initTagField, getTagRecordIds } from "./tagify";
import { pb } from "./database";

import { getLocaleFromUrl, hydrateText, i18next } from "./src/i18n";

hydrateText();

async function getAllContributions() {
  return await getFilteredContributions();
}

async function getFilteredContributions(
  titleDescriptionText,
  tagRecordIds = [],
  locationRecordIds = [],
  authorRecordIds = [],
  contributorRecordIds = [],
) {
  // Build filter string
  let filters = [];
  if (titleDescriptionText) {
    filters.push(`description ~ '${titleDescriptionText}'`);
    filters.push(`long_description ~ '${titleDescriptionText}'`);
  }
  if (tagRecordIds.length) {
    filters.push(tagRecordIds.map((el) => `tags ~ '${el}'`).join(" || "));
  }
  if (locationRecordIds.length) {
    filters.push(
      locationRecordIds.map((el) => `location ~ '${el}'`).join(" || "),
    );
  }
  if (authorRecordIds.length) {
    filters.push(authorRecordIds.map((el) => `authors ~ '${el}'`).join(" || "));
  }
  if (contributorRecordIds.length) {
    filters.push(
      contributorRecordIds.map((el) => `contributors ~ '${el}'`).join(" || "),
    );
  }

  let filter = filters.join(" || "); // combine all filter groups

  console.log("[getFilteredContributions] filter: ", filter);

  // Query database
  const records = await pb.collection("contributions").getFullList({
    filter: filter,
    sort: "-created",
    expand: "tags,files,location,contributors,authors",
  });
  console.log("[getFilteredContributions] records: ", records);

  // Sort records by number of filter matches (tags, locations, authors, contributors)
  const sortedRecords = records.sort((a, b) => {
    const aMatches = countTotalMatches(
      a,
      titleDescriptionText,
      tagRecordIds,
      locationRecordIds,
      authorRecordIds,
      contributorRecordIds,
    );
    const bMatches = countTotalMatches(
      b,
      titleDescriptionText,
      tagRecordIds,
      locationRecordIds,
      authorRecordIds,
      contributorRecordIds,
    );
    return bMatches - aMatches;
  });

  return sortedRecords;
}

// Helper function to count total matches across all filters
function countTotalMatches(
  record,
  titleDescriptionText,
  tagRecordIds,
  locationRecordIds,
  authorRecordIds,
  contributorRecordIds,
) {
  let matches = 0;

  // Count titleDescriptionText matches
  if (titleDescriptionText) {
    if (
      record.description
        ?.toLowerCase()
        .includes(titleDescriptionText.toLowerCase())
    ) {
      matches++;
    }
    if (
      record.long_description
        ?.toLowerCase()
        .includes(titleDescriptionText.toLowerCase())
    ) {
      matches++;
    }
  }

  // Count tag matches
  const tags = record.expand?.tags || [];
  matches += tags.filter((tag) => tagRecordIds.includes(tag.id)).length;

  // Count location matches
  const locations = record.expand?.location || [];
  matches += locations.filter((location) =>
    locationRecordIds.includes(location.id),
  ).length;

  // Count author matches
  const authors = record.expand?.authors || [];
  matches += authors.filter((author) =>
    authorRecordIds.includes(author.id),
  ).length;

  // Count contributor matches
  const contributors = record.expand?.contributors || [];
  matches += contributors.filter((contributor) =>
    contributorRecordIds.includes(contributor.id),
  ).length;

  return matches;
}

function limitTextDisplay(text, maxLength = 200) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

function hydrateContributionList(documentElement, contributions) {
  documentElement.innerHTML = `<div class="contributions-list">
    ${contributions
      .map(
        (rec) => `
      <div class="contribution">
        <pre>CO#${rec.entry_id}</pre>
        <h3>${rec.description}</h3>
        <div class="preview-image-grid">
          ${rec.expand?.files
            ?.map(
              (el) => `
              ${
                el.thumb
                  ? `<a href="${pb.files.getUrl(el, el.processed_file)}"><img src="${pb.files.getUrl(el, el.thumb)}" title="FILE#${el.entry_id}"></img></a>`
                  : "⏳"
              }`,
            )
            .join("")}
        </div>

        <p>${limitTextDisplay(rec.long_description)}</p>
        <a href="recollect_single.html?contribution=${rec.entry_id}" target="_blank" title="Open contribution CO#${rec.entry_id}">${i18next.t("recollector.linkMore")}</a>
      </div>
      `,
      )
      .join("")}
    </div>`;
}

await initTagField("tags", document.querySelector("input#tags"), {
  enforceWhitelist: true,
});
await initTagField("locations", document.querySelector("input#location"), {
  enforceWhitelist: true,
});
await initTagField(
  "contributors",
  document.querySelector("input#contributors"),
  { enforceWhitelist: true },
);
await initTagField("authors", document.querySelector("input#authors"), {
  enforceWhitelist: true,
});

const contributions = await getAllContributions();
hydrateContributionList(
  document.querySelector("#contributions"),
  contributions,
);
console.log(contributions);

const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titleDescriptionText = document.querySelector(
    "input#title_description",
  ).value;
  const tagRecordIds = await getTagRecordIds(
    "tags",
    document.querySelector("input#tags").tagifyValue,
    false,
  );
  const locationRecordIds = await getTagRecordIds(
    "locations",
    document.querySelector("input#location").tagifyValue,
    false,
  );
  const authorRecordIds = await getTagRecordIds(
    "authors",
    document.querySelector("input#authors").tagifyValue,
    false,
  );
  const contributorRecordIds = await getTagRecordIds(
    "contributors",
    document.querySelector("input#contributors").tagifyValue,
    false,
  );

  const contributions = await getFilteredContributions(
    titleDescriptionText,
    tagRecordIds,
    locationRecordIds,
    authorRecordIds,
    contributorRecordIds,
  );
  hydrateContributionList(
    document.querySelector("#contributions"),
    contributions,
  );
});

/*
Back-to-top button
*/

// Show button when user scrolls down 100px from the top
window.onscroll = function () {
  const backToTopButton = document.getElementById("back-to-top");
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
};

// Scroll smoothly to the top when the button is clicked
document
  .getElementById("back-to-top")
  .addEventListener("click", function (event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
