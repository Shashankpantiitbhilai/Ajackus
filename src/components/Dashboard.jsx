import React, { useState, useEffect,useRef } from "react";
import {
  Container, Paper, Typography, Grid, Alert, Box, 
  CircularProgress, IconButton, AppBar, Toolbar, Tooltip,
  FormControl, InputLabel, Select, MenuItem, Switch,
  FormControlLabel, Divider, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from "@mui/material";
import {
  Edit,
  Trash2,
  RefreshCw,
  Download,
  Upload,
  Moon,
  Users,
  Mail,
  Building
} from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import * as XLSX from 'xlsx';
import SearchBar from "./SearchBar";
import SubmitForm from "./DetailForm";
import IndividualCard from "./PersonCard";
import { search } from "../utils/SearchHandler";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { pagination } from "../services/paginationService";
import { getUsers } from "../services/initialLoad";
import DeleteDialog from "./DeleteDialog";
import theme from "./Theme"; // Import theme
const INITIAL_USERS = 8;
const BACKEND_SERVER_BASE_URL = process.env.REACT_APP_BACKEND_BASEURL;

const UserDashboard = () => {
  const tableContainerRef = useRef(null);

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
  
 
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
          BACKEND_SERVER_BASE_URL.concat("users"),
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



  useEffect(() => {
    getUsers(
      setUsers,
      setHasMore,
      setError,
      setIsLoading,
      INITIAL_USERS,
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
          BACKEND_SERVER_BASE_URL.concat(`users/${selectedUser.id}`),
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
          BACKEND_SERVER_BASE_URL.concat("users"),
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
        BACKEND_SERVER_BASE_URL.concat(`users/${userId}`),
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
    getUsers(
      setUsers,
      setHasMore,
      setError,
      setIsLoading,
      INITIAL_USERS,
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
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectedUser = (user) => {
    const firstName = user.name.split(" ")[0];
    const lastName = user.name.split(" ")[1];
    const department = user.company.name;
    const formData = {
      firstName,
      lastName,
      email: user.email,
      department,
      company: {
        name: department,
      },
    };
    setFormData(formData);
    setSelectedUser(user);
    setIsEditing(true);
  };

  // Modified to work with table pagination


  // Modified getFilteredUsers to work with infinite scroll
  const getFilteredUsers = () => {
    let filteredUsers = [...users];
    
    if (searchTerm) {
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.department) {
      filteredUsers = filteredUsers.filter(user => 
        user.company.name.toLowerCase() === filters.department.toLowerCase()
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
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <AppBar position="fixed" elevation={2}>
        <Toolbar>
          <Users className="mr-2" />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
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
              label={<Moon />}
            />
            
            <Divider orientation="vertical" flexItem />
            
            <Tooltip title="Export to Excel">
              <IconButton color="inherit" onClick={exportToExcel}>
                <Download />
              </IconButton>
            </Tooltip>

            <Tooltip title="Import from Excel">
              <IconButton color="inherit" component="label">
                <Upload />
                <input
                  type="file"
                  hidden
                  accept=".xlsx,.xls"
                  onChange={importFromExcel}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ pt: 10, pb: 4 }}>
        <Grid container spacing={3}>
          {/* Left Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Box 
                sx={{ 
                  mb: 3, 
                  p: 2, 
                  borderRadius: 2, 
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Users size={24} />
                <Box>
                  <Typography variant="subtitle2">Total Users</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {users.length}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                {isEditing ? 'Edit User' : 'Add User'}
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
            <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
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

            {error && (
                <Alert severity={severity} sx={{ mb: 3 }} onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              <div
                id="scrollableDiv"
                style={{
                  overflow: 'auto',
                  maxHeight: '600px'
                }}
                ref={tableContainerRef}
              >
                <InfiniteScroll
                  dataLength={users.length}
                  next={() => pagination(page, setUsers, setPage, setHasMore, setError, INITIAL_USERS)}
                  hasMore={hasMore}
                  loader={
                    <Box display="flex" justifyContent="center" p={2}>
                      <CircularProgress color="primary" />
                    </Box>
                  }
                  scrollableTarget="scrollableDiv"
                >
                  <TableContainer>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Department</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {getFilteredUsers().map((user) => (
                          <TableRow
                            key={user.id}
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                              '&:hover': { bgcolor: 'action.hover' }
                            }}
                          >
                            <TableCell component="th" scope="row">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Users size={20} />
                                {user.name}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Mail size={20} />
                                {user.email}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Building size={20} />
                                {user.company.name}
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                onClick={() => handleSelectedUser(user)}
                                color="primary"
                                size="small"
                              >
                                <Edit size={18} />
                              </IconButton>
                              <IconButton
                                onClick={() => handleDeleteConfirmation(user.id)}
                                color="error"
                                size="small"
                              >
                                <Trash2 size={18} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </InfiniteScroll>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        handleDeleteConfirmed={handleDeleteConfirmed}
      />
    </Box>
  );
};

export default UserDashboard;