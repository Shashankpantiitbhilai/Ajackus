/**
 * 
 * 
 * @param {*} setHasMore 
 * @param {*} setError 
 * @param {*} setIsLoading 
 * @param {*} USERS_PER_PAGE 
 * @param {*} setSeverity 
 * 
 * The function intiallu used to trigger loading a few users based on
 * the value of USER_PER_PAGE.
 */

const BACKEND_SERVER_BASE_ADDRESS = process.env.REACT_APP_BACKEND_BASEADDRESS;


export const fetchInitialUsers = async (
  setUsers,
  setHasMore,
  setError,
  setIsLoading,
  USERS_PER_PAGE,
  setSeverity
) => {
  try {
    const response = await fetch(BACKEND_SERVER_BASE_ADDRESS.concat("users"));
    if (!response.ok) {
        setSeverity('error');
            throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    console.log("Received data: ", data);
    setSeverity('success');
    // Simulate pagination by slicing the initial data
    setUsers(data.slice(0, USERS_PER_PAGE));
    setHasMore(data.length > USERS_PER_PAGE);
    setIsLoading(false);
  } catch (err) {
    setSeverity('error');
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};
