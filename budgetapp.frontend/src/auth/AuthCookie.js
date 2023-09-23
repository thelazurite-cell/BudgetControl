import moment from "moment";

export class AuthCookie {
  getTokenCookie() {
    const name = "token=";
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

  setTokenCookie(authToken) {
    const decoded = JSON.parse(atob(authToken));
    console.log(decoded);
    const expires = moment(decoded.accessTokenExpiresAt);
    document.cookie =
      "token=" +
      authToken +
      ";" +
      new Date(expires.utc().date()).toUTCString() +
      ";path=/;SameSite=Lax; Secure";
  }

  checkTokenCookie() {
    const token = this.getTokenCookie();
    if (token && token.length > 0) {
      const value = JSON.parse(atob(token));
      const currentDate = new Date();
      const expires = new Date(value.accessTokenExpiresAt);
      console.log(value);
      if (currentDate > expires) {
        return { signedIn: false, user: "", token: "" };
      } else {
        return { signedIn: true, user: value.userId, token: value.accessToken };
      }
    }
  }

  clearToken() {
    const date = new Date();
    date.setTime(date.getTime() + -10 * 24 * 60 * 60 * 1000);
    document.cookie = `token=; expires=${date.toUTCString()}; path=/;SameSite=Lax; Secure`;
  }
}
