import i18next from "i18next";

i18next.init({
  lng: getLocaleFromUrl(),
  debug: true,
  resources: {
    en: {
      translation: {
        collector: {
          title: "Co&ndash;llect",
          subtitle: "Add to the Co–llection using the fields below",
          formUploadHint: "Drop files here or %{browseFiles}",
          formUploadHintBrowseFiles: "browse files",
          formUploadXFilesSelected: {
            0: "%{smart_count} file selected",
            1: "%{smart_count} files selected",
          },
          formUploadAddMore: "Add more",
          formUploadCancel: "Cancel",
          formUploadEditing: "Editing %{file}",
          formUploadSaveChanges: "Save changes",
          formUploadCaptionButton: "+caption",
          formUploadCaption: "Caption",
          formUploadCaptionHint: "Add a caption (optional)",
          formTitle: "title",
          formDescription: "description",
          formKeywords: "collection keywords",
          formKeywordsHint: "Choose/create at least 3 keywords",
          formKeywordsValidate: "Please choose at least 3 keywords",
          formLocation: "location",
          formContributors: "contributors",
          formContributorsHint: "Choose/create at least 1 contributor",
          formContributorsValidate: "Please enter at least 1 contributor",
          formAuthors: "authors",
          formDateCreated: "date created",
          formInPhysicalCollection: "in physical collection",
          formAcceptTerms:
            'I accept the <a href="/terms.txt" target="_blank">terms</a><span style="color: red">*</span>',
          formSubmit: "submit",
          alertContributionSaved: "Contribution saved to collection.",
        },
        recollector: {
          title: "Re–collect",
          subtitle: "Use the fields below to filter the Co–llection",
          formFieldSearch: "title/description",
          formFieldSearchHint: "try searching in title/description",
          formFieldTagHint: "try choosing from the list",
          formSubmit: "Search",
          linkMore: "more ⇨",
        },
        cocreate: {
          title: "Co&ndash;create",
        },
        contribution: {
          long_description: "Description",
          tags: "Collection Keywords",
          location: "Location",
          contributors: "Contributors",
          authors: "Authors",
          date_created: "Date Created",
          date_added: "Date Added",
          physical: "In Physical Collection",
        },
        misc: {
          yes: "Yes",
          no: "No",
          notApplicable: "N/A",
        },
      },
    },
    gr: {
      translation: {
        collector: {
          title: "Συλλο&ndash;γή",
          subtitle: "Προσθέστε στη Συλλο–γή χρησιμοποιώντας τα παρακάτω πεδία",
          formUploadHint: "Αποθέστε αρχεία εδώ ή %{browseFiles}",
          formUploadHintBrowseFiles: "Περιηγηθείτε στα αρχεία",
          formUploadXFilesSelected: {
            0: "%{smart_count} αρχείο επιλέχθηκε",
            1: "%{smart_count} αρχεία επιλέχθηκαν",
          },
          formUploadAddMore: "Προσθέστε περισσότερα",
          formUploadCancel: "Ακύρωση",
          formUploadEditing: "Επεξεργασία %{file}",
          formUploadSaveChanges: "Αποθήκευση αλλαγών",
          formUploadCaptionButton: "+Λεζάντα",
          formUploadCaption: "Λεζάντα",
          formUploadCaptionHint: "Προσθέστε μια λεζάντα (προαιρετικό)",
          formTitle: "τίτλος",
          formDescription: "περιγραφή",
          formKeywords: "λέξεις-κλειδιά συλλογής",
          formKeywordsHint:
            "Επιλέξτε/δημιουργήστε τουλάχιστον 3 λέξεις-κλειδιά",
          formKeywordsValidate:
            "Παρακαλώ επιλέξτε τουλάχιστον 3 λέξεις-κλειδιά",
          formLocation: "τοποθεσία",
          formContributors: "συντελεστές",
          formContributorsHint:
            "Επιλέξτε/δημιουργήστε τουλάχιστον 1 συντελεστή",
          formContributorsValidate:
            "Παρακαλώ εισάγετε τουλάχιστον 1 συντελεστή",
          formAuthors: "συγγραφείς",
          formDateCreated: "ημερομηνία δημιουργίας",
          formInPhysicalCollection: "στη φυσική συλλογή",
          formAcceptTerms:
            'Αποδέχομαι τους <a href="/terms.txt" target="_blank">όρους</a><span style="color: red">*</span>',
          formSubmit: "υποβολή",
          alertContributionSaved: "Η συνεισφορά αποθηκεύτηκε στη συλλογή.",
        },
        recollector: {
          title: "Επανα–συλλογή",
          subtitle:
            "Χρησιμοποιήστε τα παρακάτω πεδία για να φιλτράρετε τη Συλλο–γή",
          formFieldSearch: "τίτλος/περιγραφή",
          formFieldSearchHint: "δοκιμάστε να αναζητήσετε σε τίτλο/περιγραφή",
          formFieldTagHint: "δοκιμάστε να επιλέξετε από τη λίστα",
          formSubmit: "Αναζήτηση",
          linkMore: "περισσότερα ⇨",
        },
        contribution: {
          long_description: "Περιγραφή",
          tags: "Λέξεις-κλειδιά Συλλογής",
          location: "Τοποθεσία",
          contributors: "Συντελεστές",
          authors: "Συγγραφείς",
          date_created: "Ημερομηνία Δημιουργίας",
          date_added: "Ημερομηνία Προσθήκης",
          physical: "Στη Φυσική Συλλογή",
        },
        cocreate: {
          title: "Συν&ndash;δημιουργία",
        },
        misc: {
          yes: "Ναι",
          no: "Όχι",
          notApplicable: "Μη εφαρμοστέο",
        },
      },
    },
  },
});

// Function to get the locale from the URL
function getLocaleFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const locale = params.get("locale"); // Get the 'locale' parameter
  return locale || "en"; // Default to 'en' if no locale is found
}

function getLocaleParam() {
  return `locale=${getLocaleFromUrl()}`;
}

function hydrateText() {
  // Update innerHTML for elements with data-i18n
  document.querySelectorAll("[data-i18n]").forEach(function (element) {
    const key = element.getAttribute("data-i18n");
    element.innerHTML = i18next.t(key, {
      interpolation: { escapeValue: false },
    });
  });

  // Update placeholders for elements with data-i18n-placeholder
  document
    .querySelectorAll("[data-i18n-placeholder]")
    .forEach(function (element) {
      const key = element.getAttribute("data-i18n-placeholder");
      element.setAttribute("placeholder", i18next.t(key));
    });

  // Update value for input elements with data-i18n-value
  document.querySelectorAll("[data-i18n-value]").forEach(function (element) {
    const key = element.getAttribute("data-i18n-value");
    element.setAttribute("value", i18next.t(key));
  });

  addRequiredAsterisk();
}

// Function to dynamically add a red asterisk (*) for required fields
function addRequiredAsterisk() {
  document.querySelectorAll("label[data-required]").forEach(function (label) {
    // Append the red asterisk only if it doesn't already exist
    if (!label.innerHTML.includes('<span style="color: red">*</span>')) {
      label.innerHTML += ' <span style="color: red">*</span>';
    }
  });
}
export { i18next, getLocaleParam, getLocaleFromUrl, hydrateText };
