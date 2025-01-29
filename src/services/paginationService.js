/**
 * 
 * @param page 
 * @param {*} setUsers 
 * @param {*} setPage 
 * @param {*} setHasMore 
 * @param {*} setError 
 * @param {*} USERS_PER_PAGE 
 * 
 * Function used to fetch users as we scroll down in our list.
 * To be used in infinite scrolling react component which
 * wraps our page.
 */


const BACKEND_SERVER_BASE_ADDRESS = process.env.REACT_APP_BACKEND_BASEADDRESS;

export const fetchMoreUsers = async (
  page,
  setUsers,
  setPage,
  setHasMore,
  setError,
  USERS_PER_PAGE
) => {
  try {
    const response = await fetch(BACKEND_SERVER_BASE_ADDRESS.concat("users"));
    if (!response.ok) throw new Error("Failed to fetch more users");
    const data = await response.json();

    const nextPage = page + 1;
    const start = (nextPage - 1) * USERS_PER_PAGE;
    const end = start + USERS_PER_PAGE;
    const newUsers = data.slice(start, end);

    if (newUsers.length > 0) {
      setUsers((prevUsers) => [...prevUsers, ...newUsers]);
      setPage(nextPage);
      setHasMore(end < data.length);
    } else {
      setHasMore(false);
    }
  } catch (err) {
    setError(err.message);
  }
};
