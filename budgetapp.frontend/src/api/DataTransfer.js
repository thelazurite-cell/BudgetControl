import axios from "axios";

export class DataTransfer {
  token = "";

  instance = {};

  constructor(token) {
    this.token = token;
    this.instance = axios.create({
      baseUrl: "https://192.168.0.15:5001/",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.token,
      },
    });
  }

  find(type, query, response, error) {
    this.instance
      .post(`https://192.168.0.15:5001/${type}/find`, JSON.stringify(query))
      .then((data) => response(data))
      .catch((err) => error(err));
  }

  findAll(type, response, error) {
    this.instance
      .get(`https://192.168.0.15:5001/${type}/findAll`)
      .then((data) => response(data))
      .catch((err) => error(err));
  }
}
