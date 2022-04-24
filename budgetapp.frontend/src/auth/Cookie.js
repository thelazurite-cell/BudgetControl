export class Cookie {
  static get(cookieName) {
    const name = `${cookieName}=`;
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  static set(cookieName, cookieValue, cookieExpires = null) {
    document.cookie =
      cookieName +
      "=" +
      cookieValue +
      ";" +
      (cookieExpires ? " expires=" + cookieExpires + ";" : "") +
      "path=/;SameSite=Lax; Secure";
  }

  static clear(cookieName) {
    const date = new Date();
    date.setTime(date.getTime() + -10 * 24 * 60 * 60 * 1000);
    document.cookie = `${cookieName}=; expires=${date.toUTCString()}; path=/;SameSite=Lax; Secure`;
  }
}
