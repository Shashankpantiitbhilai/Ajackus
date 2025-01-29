import { Search as SearchIcon } from "@mui/icons-material";
import { TextField } from "@mui/material";
import { useState } from "react";
const SearchBar = ({ searchTerm, setSearchTerm }) => {

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  }

  return (
    <>
      <SearchIcon sx={{ color: "text.secondary", mr: 2 }} />
      <TextField
        value={searchTerm}
        onChange={handleChange}
        fullWidth
        variant="standard"
        placeholder="Search users..."
        InputProps={{ disableUnderline: true }}
      />
    </>
  );
};

export default SearchBar;
