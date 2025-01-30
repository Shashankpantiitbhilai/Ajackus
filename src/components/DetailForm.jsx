import React from "react";
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box,
  Divider,
  styled
} from "@mui/material";
import { 
  UserPlus, 
  UserCog, 
  X as CloseIcon, 
  Send as SendIcon 
} from "lucide-react";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}));

const FormHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  '& svg': {
    marginRight: theme.spacing(2),
    color: theme.palette.primary.main,
    strokeWidth: 1.5
  }
}));

const FormContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  }
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(2),
  marginTop: theme.spacing(4),
  paddingTop: theme.spacing(3),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const SubmitForm = ({
  isEditing,
  handleSubmit,
  formData,
  handleInputChange,
  resetForm
}) => {
  return (
    <StyledPaper elevation={0}>
      <FormHeader>
        {isEditing ? (
          <UserCog size={28} />
        ) : (
          <UserPlus size={28} />
        )}
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          {isEditing ? "Edit User Profile" : "Add New Team Member"}
        </Typography>
      </FormHeader>

      <form onSubmit={handleSubmit}>
        <FormContainer>
          <StyledTextField
            fullWidth
            name="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            placeholder="Enter first name"
            variant="outlined"
          />

          <StyledTextField
            fullWidth
            name="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            placeholder="Enter last name"
            variant="outlined"
          />

          <StyledTextField
            fullWidth
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="email@company.com"
            variant="outlined"
          />

          <StyledTextField
            fullWidth
            name="department"
            label="Department"
            value={formData.department}
            onChange={handleInputChange}
            required
            placeholder="Enter department"
            variant="outlined"
          />
        </FormContainer>

        <ButtonContainer>
          <Button
            variant="outlined"
            onClick={resetForm}
            startIcon={<CloseIcon size={18} />}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: 'none',
              borderColor: 'divider',
              '&:hover': {
                borderColor: 'primary.main',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            startIcon={<SendIcon size={18} />}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: 'none',
              boxShadow: 2,
              '&:hover': {
                boxShadow: 3,
              }
            }}
          >
            {isEditing ? "Update User" : "Add User"}
          </Button>
        </ButtonContainer>
      </form>
    </StyledPaper>
  );
};

export default SubmitForm;