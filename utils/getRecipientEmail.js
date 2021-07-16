const getRecipientEmail = (users, userLoggedIn) =>
  users?.filter((user) => user !== userLoggedIn?.email)[0];
//filter returns an array of all elements matching the condition. Since userLoggedIn will match only 1, so we return value at 0th

export default getRecipientEmail;
