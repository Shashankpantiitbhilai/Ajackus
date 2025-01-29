/**
 * 
 * @param setUsers 
 * @param {*} setError 
 * @param {*} setIsLoading 
 * @param {*} setSeverity 
 * Function allows to fetch all users and set the values of
 * some setters based on our parameters.
 */
const BACKEND_SERVER_BASE_URL = process.env.REACT_APP_BACKEND_BASEURL;

export async function fetchUsers(setUsers, setError, setIsLoading, setSeverity){
    try {
        const response = await fetch(BACKEND_SERVER_BASE_URL.concat('users'));
        if (!response.ok) {
            setSeverity('error');
            throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setSeverity('success');
        setUsers(data);
      } catch (err) {
        setSeverity('error');
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
}