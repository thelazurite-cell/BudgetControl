export class DtoHelper {
  static hasIdentifier(item) {
    if (!item._id) {
      return false;
    }
    return item._id || item._id.trim().length === 0;
  }
}
