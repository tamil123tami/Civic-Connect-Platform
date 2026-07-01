export const loginAs = (role) => {
  localStorage.setItem("role", role);
};

export const logout = () => {
  localStorage.removeItem("role");
};

export const getRole = () => {
  return localStorage.getItem("role");
};
