export function logoutUser() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
