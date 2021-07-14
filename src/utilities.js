export function getBaseURL() {
    if (process.env.NODE_ENV === "production") {
      return "http://api-visage.adityakhot.fr";
    } else {
      return "http://localhost:8081";
    }
  }