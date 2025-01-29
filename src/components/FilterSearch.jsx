import React, { useState } from "react";
import {
  Grid, Paper, FormControl, InputLabel,
  Select, MenuItem
} from "@mui/material";
import SearchBar from "./SearchBar";
import { search } from "../utils/SearchHandler";

const FilterSearch = ({ users, setUsers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    department: "",
    sortBy: "name",
    sortOrder: "asc"
  });

  // Apply filters to search results
  const applyFilters = (users) => {
    let filteredUsers = [...users];

    if (filters.department) {
      filteredUsers = filteredUsers.filter(
        user => user.company.name.toLowerCase() === filters.department.toLowerCase()
      );
    }

    filteredUsers.sort((a, b) => {
      const aValue = filters.sortBy === 'name' ? a.name : a.email;
      const bValue = filters.sortBy === 'name' ? b.name : b.email;
      return filters.sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    return filteredUsers;
  };

  // Get filtered and searched users
  const getFilteredUsers = () => {
    return applyFilters(search(searchTerm, users));
  };

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Department</InputLabel>
                <Select
                  value={filters.department}
                  label="Department"
                  onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                >
                  <MenuItem value="">All</MenuItem>
                  {[...new Set(users.map(user => user.company.name))].map(dept => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filters.sortBy}
                  label="Sort By"
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Order</InputLabel>
                <Select
                  value={filters.sortOrder}
                  label="Order"
                  onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FilterSearch;