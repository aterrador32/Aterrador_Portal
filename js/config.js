const API_URL =
  "https://script.google.com/macros/s/AKfycbxocBxiKrYnxL_Z7DmlDZID-3BE1jpOBZ8pBhhtLDIF7toILjyFEPFRWYcxK5ZxN9tsfw/exec";
const API_TOKEN = "blue1brown-nutshell";
const EMAIL_SALT = "trumanDoctrine#1971@july24";

function apiUrl(sheet) {
  return `${API_URL}?sheet=${sheet}&token=${API_TOKEN}`;
}
