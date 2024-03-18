export const validator = (email, password) => {
  const validEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

  if (!validEmail) return "Email is not valid.";

  return null;
};
