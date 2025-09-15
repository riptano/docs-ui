/* eslint-disable */
window._ibmAnalytics = {
  "settings": {
    "name": "DataStax",
    "tealiumProfileName": "ibm-subsidiary",
  },
  "trustarc": {
    "privacyPolicyLink": "https://www.datastax.com/legal/datastax-website-privacy-policy"
  },
  "digitalData.page.services.google.enabled": true
};
window.digitalData = {
  "page": {
    "pageInfo": {
      "ibm": {
        "siteId": "IBM_" + _ibmAnalytics.settings.name,
      }
    },
    "category": {
      "primaryCategory": "PC230"
    }
  }
};
