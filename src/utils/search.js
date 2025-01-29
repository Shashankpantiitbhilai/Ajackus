export function search(searchTerm, users) {
  if (searchTerm in ["", undefined, null]) return users;

  const parsed = searchTerm.toLowerCase();

  return users.filter((user) => {
    return (
      user.name.split(" ")[0]?.toLowerCase().includes(parsed) ||
      user.name.split(" ")[1].toLowerCase().includes(parsed) ||
      user.email?.toLowerCase().includes(parsed) ||
      user.company.name?.toLowerCase().includes(parsed)
    );
  });
}
