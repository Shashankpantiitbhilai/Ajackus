import React, { useState, useEffect } from "react";
import {
  Container, Paper, Typography, Grid, Card, Alert, Box, 
  CircularProgress, IconButton, AppBar, Toolbar, Tooltip,
  Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, Button, FormControl, InputLabel, Select,
  MenuItem, Switch, FormControlLabel, Divider
} from "@mui/material";
import {
  Person as PersonIcon,
  Refresh as RefreshIcon,
  FileDownload as FileDownloadIcon,
  FileUpload as FileUploadIcon,
  DarkMode as DarkModeIcon
} from "@mui/icons-material";
import InfiniteScroll from "react-infinite-scroll-component";
import * as XLSX from 'xlsx';
import SearchBar from "./SearchBar";
import SubmitForm from "./DetailForm";
import IndividualCard from "./PersonCard";
import { search } from "../utils/search";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { fetchMoreUsers } from "../services/paginationService";
import { fetchInitialUsers } from "../services/initialLoad";

import theme from "./Theme"; // Import theme
const USERS_PER_PAGE = 8;
const BACKEND_SERVER_BASE_ADDRESS = process.env.REACT_APP_BACKEND_BASEADDRESS;

const UserDashboard = () => {
 

 const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [severity, setSeverity] = useState("error");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [reload, setReload] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [filters, setFilters] = useState({
    department: "",
    sortBy: "name",
    sortOrder: "asc"
  });
   const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    department: "",
    company: {
      name: "",
    },
   });
  
 
   const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users.map(user => ({
      Name: user.name,
      Email: user.email,
      Department: user.company.name
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
  };
const importFromExcel = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = async (e) => {
    const workbook = XLSX.read(e.target.result, { type: 'binary' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    try {
      setIsLoading(true);
      const importedUsers = []; // Array to store the imported users

      for (const row of data) {
        const userData = {
          firstName: row.Name.split(' ')[0],
          lastName: row.Name.split(' ')[1] || '',
          name: row.Name,
          email: row.Email,
          department: row.Department,
          company: {
            name: row.Department
          }
        };
        console.log(userData);

        const response = await fetch(
          BACKEND_SERVER_BASE_ADDRESS.concat("users"),
          {
            method: "POST",
            body: JSON.stringify(userData),
            headers: {
              "Content-type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to import user: ${row.Name}`);
        }

        // Add the imported user to the array
        importedUsers.push(userData);
      }

      // Update the users state with the new imported users
      setUsers((prevUsers) => [
        ...importedUsers.map((user, index) => ({
          ...user,
          id: prevUsers.length + index + 1, // Increment the ID based on the previous users length
        })),
        ...prevUsers,
      ]);

      setError("Users imported successfully");
      setSeverity("success");
     
    } catch (err) {
      setError(err.message);
      setSeverity("error");
    } finally {
      setIsLoading(false);
    }
  };
  reader.readAsBinaryString(file);
};

  // Enhanced delete handling with confirmation
  const handleDeleteConfirmation = (userId) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (userToDelete) {
      await handleDelete(userToDelete);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

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




  const handleSelectedUser = (user) => {
    const firstName = user.name.split(" ")[0];
    const lastName = user.name.split(" ")[1];
    const department = user.company.name;
    user.firstName = firstName;
    user.lastName = lastName;
    user.department = department;
    const formData = {
      firstName: firstName,
      lastName: lastName,
      email: user.email,
      department: department,
      company: {
        name: department,
      },
    };
    setFormData(formData);
    setSelectedUser(user);
  };

  useEffect(() => {
    fetchInitialUsers(
      setUsers,
      setHasMore,
      setError,
      setIsLoading,
      USERS_PER_PAGE,
      setSeverity
    );
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (isEditing && selectedUser) {
        formData.name = formData.firstName + " " + formData.lastName;
        formData.company.name = formData.department;
        const response = await fetch(
          BACKEND_SERVER_BASE_ADDRESS.concat(`users/${selectedUser.id}`),
          {
            method: "PUT",
            body: JSON.stringify(formData),
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        if (!response.ok) {
          setIsLoading(false);
          setSeverity("error");
          throw new Error("Failed to update user");
        }

        setError("User details edited!");
        setSeverity("success");
        setIsLoading(false);
      } else {
        formData.name = formData.firstName + " " + formData.lastName;
        formData.company.name = formData.department;
        setIsLoading(true);
        const response = await fetch(
          BACKEND_SERVER_BASE_ADDRESS.concat("users"),
          {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        if (!response.ok) {
          setIsLoading(false);
          throw new Error("Failed to add user");
        }

        setError("User Saved");
        setSeverity("success");
        setIsLoading(false);
      }

      if (isEditing) {
        setUsers(
          users.map((user) =>
            user.id === selectedUser.id ? { ...user, ...formData } : user
          )
        );
      } else {
        setUsers([{ ...formData, id: users.length + 1 }, ...users]);
      }

      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (userId) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        BACKEND_SERVER_BASE_ADDRESS.concat(`users/${userId}`),
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        setIsLoading(false);
        setSeverity("error");
        throw new Error("Failed to delete user");
      }
      setUsers(users.filter((user) => user.id !== userId));
      setIsLoading(false);
      setSeverity("error");
      setError("User deleted");
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const handleReload = () => {
    setPage(1);
    setHasMore(true);
    setUsers([]); // Reset the users array before fetching initial users
    fetchInitialUsers(
      setUsers,
      setHasMore,
      setError,
      setIsLoading,
      USERS_PER_PAGE,
      setSeverity
    );
  };

  const resetForm = () => {
    console.log("Data data reset");
    setFormData({
      firstName: "",
      lastName: "",
      name: "",
      email: "",
      department: "",
      company: {
        name: "",
      },
    });
    setSelectedUser(null);
    setIsEditing(false);
  };




  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor={theme.palette?.background.default}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme(darkMode)}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <AppBar position="fixed" elevation={2}>
          <Toolbar>
            <PersonIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              User Management Dashboard
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             



                <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              color="default"
            />
          }
          label={<DarkModeIcon />}
        />

              <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: 'rgba(255,255,255,0.12)' }} />

              <Tooltip title="Export to Excel">
                <IconButton color="inherit" onClick={exportToExcel}>
                  <FileDownloadIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Import from Excel">
                <IconButton color="inherit" component="label">
                  <FileUploadIcon />
                  <input
                    type="file"
                    hidden
                    accept=".xlsx,.xls"
                    onChange={importFromExcel}
                  />
                </IconButton>
              </Tooltip>

              <Tooltip title="Refresh">
                <IconButton color="inherit" onClick={handleReload}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ pt: 10, pb: 4 }}>
          <Grid container spacing={3}>
            {/* Left Sidebar */}
            <Grid item xs={12} md={3}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Add/Edit User
                </Typography>
                <SubmitForm
                  isEditing={isEditing}
                  handleSubmit={handleSubmit}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  resetForm={resetForm}
                />
              </Paper>
            </Grid>

            {/* Main Content */}
            <Grid item xs={12} md={9}>
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

              {error && (
                <Alert
                  severity={severity}
                  sx={{ mb: 3, borderRadius: 3 }}
                  onClose={() => setError(null)}
                >
                  {error}
                </Alert>
              )}

              <InfiniteScroll
                dataLength={users.length}
                key={reload}
                next={() => fetchMoreUsers(page, setUsers, setPage, setHasMore, setError, USERS_PER_PAGE)}
                hasMore={hasMore}
                loader={
                  hasMore && (
                    <Box display="flex" justifyContent="center" p={2}>
                      <CircularProgress color="primary" />
                    </Box>
                  )
                }
              >
                <Grid container spacing={3}>
                  {applyFilters(search(searchTerm, users)).map((user) => (
                    <Grid item xs={12} md={6} key={user.id}>
                      <Card
                        elevation={0}
                        sx={{
                          borderRadius: 3,
                          bgcolor: "background.paper",
                          border: "1px solid",
                          borderColor: "divider",
                          '&:hover': {
                            borderColor: 'primary.main',
                          },
                        }}
                      >
                        <IndividualCard
                          user={user}
                          handleSelectedUser={handleSelectedUser}
                          setFormData={setFormData}
                          setIsEditing={setIsEditing}
                          handleDelete={() => handleDeleteConfirmation(user.id)}
                          resetForm={resetForm}
                        />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </InfiniteScroll>
            </Grid>
          </Grid>
        </Container>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button 
              onClick={() => setDeleteDialogOpen(false)}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirmed}
              color="error"
              variant="contained"
              sx={{ borderRadius: 2 }}
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default UserDashboard;