class Authentication {
  constructor() {}

  isAuthencation() {
    const token = localStorage.getItem("token");
    return token;
  }
}

const authentication = new Authentication();
export { authentication };
