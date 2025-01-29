import React, { useState, useEffect } from "react";
import {
  Grid, Paper, Typography, Card, Alert, Box,
  CircularProgress, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Button
} from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import SubmitForm from "./DetailForm";
import IndividualCard from "./PersonCard";
import { fetchMoreUsers } from "../services/paginationService";
import { fetchInitialUsers } from "../services/initialLoad";

const USERS_PER_PAGE = 8;
const BACKEND_SERVER_BASE_ADDRESS = process.env.REACT_APP_BACKEND_BASEADDRESS;

const UserManagement = ({ 
  users, setUsers, error, setError, 
  severity, setSeverity, isLoading, setIsLoading 
}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
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
          throw new Error("Failed to update user");
        }
        setError("User details edited!");
        setSeverity("success");
      } else {
        formData.name = formData.firstName + " " + formData.lastName;
        formData.company.name = formData.department;
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
          throw new Error("Failed to add user");
        }
        setError("User Saved");
        setSeverity("success");
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
      setSeverity("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (userToDelete) {
      try {
        setIsLoading(true);
        const response = await fetch(
          BACKEND_SERVER_BASE_ADDRESS.concat(`users/${userToDelete}`),
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete user");
        }
        setUsers(users.filter((user) => user.id !== userToDelete));
        setError("User deleted");
        setSeverity("error");
      } catch (err) {
        setError(err.message);
        setSeverity("error");
      } finally {
        setIsLoading(false);
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      }
    }
  };

  const resetForm = () => {
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

  return (
    <Grid container spacing={3}>
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

      <Grid item xs={12} md={9}>
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
            {users.map((user) => (
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
                    handleDelete={() => {
                      setUserToDelete(user.id);
                      setDeleteDialogOpen(true);
                    }}
                    resetForm={resetForm}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      </Grid>

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
    </Grid>
  );
};

export default UserManagement;