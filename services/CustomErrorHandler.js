class CustomErrorHandler extends Error {
  constructor(status, msg) {
    super();
    this.status = status;
    this.message = msg;
  }

  static alreadyExists(msg) {
    // 409 is predefined for this
    return new CustomErrorHandler(409, msg);
  }

  static wrongCredentials(msg = "Username or Password is wrong") {
    return new CustomErrorHandler(401, msg);
  }

  static unAuthorized(msg = "unAuthoeized") {
    return new CustomErrorHandler(401, msg);
  }

  static notFound(msg = "404 not Found") {
    return new CustomErrorHandler(404, msg);
  }
}

module.exports = CustomErrorHandler;
