export function signup(req, res) {
  console.log("signup User");
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;
  } catch (err) {}
}
export function login(req, res) {
  console.log("login User");
}
export function logout(req, res) {
  console.log("logout User");
}
