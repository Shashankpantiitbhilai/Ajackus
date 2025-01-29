import React from "react";
import "../style/Dashboard.css";
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Box
} from "@mui/material";
import { 
  Edit as EditIcon, 
  Add as AddIcon 
} from "@mui/icons-material";

const SubmitForm = ({
  isEditing,
  handleSubmit,
  formData,
  handleInputChange,
  resetForm
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 2,
        bgcolor: 'background.paper', // Using theme background
      }}
    >
      <Box 
        display="flex" 
        alignItems="center" 
        mb={3}
        sx={{
          '& .MuiSvgIcon-root': {
            color: 'primary.main'
          }
        }}
      >
        {isEditing ? <EditIcon sx={{ mr: 1 }} /> : <AddIcon sx={{ mr: 1 }} />}
        <Typography 
          variant="h5"
          sx={{ 
            color: 'text.primary',
            fontWeight: 500
          }}
        >
          {isEditing ? "Edit User" : "Add New User"}
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                },
                '& .MuiOutlinedInput-input': {
                  color: 'text.primary',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                },
                '& .MuiOutlinedInput-input': {
                  color: 'text.primary',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                },
                '& .MuiOutlinedInput-input': {
                  color: 'text.primary',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="department"
              label="Department"
              value={formData.department}
              onChange={handleInputChange}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                },
                '& .MuiOutlinedInput-input': {
                  color: 'text.primary',
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box 
              display="flex" 
              justifyContent="flex-end" 
              gap={2}
            >
              <Button 
                variant="outlined" 
                onClick={resetForm} 
                sx={{ 
                  px: 4,
                  color: 'text.primary',
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                startIcon={isEditing ? <EditIcon /> : <AddIcon />}
                sx={{ 
                  px: 4,
                  bgcolor: 'primary.main',
                  color: 'common.white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }}
              >
                {isEditing ? "Update User" : "Add User"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default SubmitForm;