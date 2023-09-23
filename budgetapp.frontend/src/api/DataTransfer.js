import axios from "axios";

/**
 * Handles the manipulation of data transfer objects.
 *
 * @export
 * @class DataTransfer
 */
export class DataTransfer {
  token = "";

  instance = {};
  apiUrl = "https://192.168.0.21:5001/";

  /**
   * Creates an instance of the DataTransfer class.
   * @param {*} token the user's authentication token
   * @memberof DataTransfer
   */
  constructor(token) {
    this.token = token;
    this.instance = axios.create({
      baseUrl: this.apiUrl,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.token,
      },
    });
  }

  /**
   * Find records that match the given query
   *
   * @param {*} type the type of record to find
   * @param {*} query the query to match against
   * @param {*} response the response callback
   * @param {*} error the error callback
   * @memberof DataTransfer
   */
  find(type, query, response, error) {
    this.instance
      .post(`${this.apiUrl}${type}/find`, JSON.stringify(query))
      .then((data) => response(data))
      .catch((err) => error(err));
  }

  /**
   * Finds all records for the given type
   *
   * @param {*} type the type of record to find
   * @param {*} response the response callback
   * @param {*} error the error callback
   * @memberof DataTransfer
   */
  findAll(type, response, error) {
    this.instance
      .get(`${this.apiUrl}${type}/findAll`)
      .then((data) => response(data))
      .catch((err) => error(err));
  }

  /**
   * Insert records of the given type
   *
   * @param {*} insert contains information regarding the type of record to insert & the records that need Inserting
   * @param {*} response the response callback
   * @param {*} error the error callback
   * @memberof DataTransfer
   */
  insert(insert, response, error) {
    const isArray = Array.isArray(insert.data);
    this.instance
      .put(
        `${this.apiUrl}${insert.type}/insert${isArray ? "Many" : ""}`,
        JSON.stringify(insert.data)
      )
      .then((data) => response(data))
      .catch((err) => error(err));
  }

  /**
   * Update records of the given type
   *
   * @param {*} update contains information regarding the type of record to update & the information to update
   * @param {*} response the response callback
   * @param {*} error the error callback
   * @memberof DataTransfer
   */
  update(update, response, error) {
    this.instance
      .post(
        `${this.apiUrl}${update.type}/update/${update.id}`,
        JSON.stringify(update.data)
      )
      .then((data) => response(data))
      .catch((err) => error(err));
  }

  /**
   * delete a record of the given type that has the given id
   *
   * @param {*} deleteRecord contains information regarding the type of record to delete and the id to use
   * @param {*} response the response callback
   * @param {*} error the error callback
   * @memberof DataTransfer
   */
  deleteRecord(deleteRecord, response, error) {
    this.instance
      .delete(`${this.apiUrl}${deleteRecord.type}/delete/${deleteRecord.id}`)
      .then((data) => response(data))
      .catch((err) => error(err));
  }
}
