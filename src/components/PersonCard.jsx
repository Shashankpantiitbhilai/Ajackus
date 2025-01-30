import React from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  Paper,
  styled,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { getRandomColor } from "../utils/ColorUtils";
import { getInitials } from "../utils/nameUtils";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const UserInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out',
  '.MuiPaper-root:hover &': {
    opacity: 1,
  },
}));

const CompanyBadge = styled(Box)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.spacing(3),
  fontSize: '0.75rem',
  fontWeight: 500,
  display: 'inline-block',
  marginTop: theme.spacing(1),
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(9),
  height: theme.spacing(9),
  fontSize: '1.75rem',
  fontWeight: 500,
  marginBottom: theme.spacing(2),
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[2],
}));

const PersonCard = ({
  user,
  handleSelectedUser,
  setFormData,
  setIsEditing,
  handleDelete,
}) => {
  const handleEdit = () => {
    handleSelectedUser(user);
    setFormData(user);
    setIsEditing(true);
  };

  return (
    <StyledPaper elevation={2}>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <ActionButtons>
          <Tooltip title="Edit User">
            <IconButton
              size="small"
              onClick={handleEdit}
              sx={{
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete User">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(user.id)}
              sx={{
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'error.lighter' },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </ActionButtons>

        <LargeAvatar sx={{ bgcolor: getRandomColor() }}>
          {getInitials(user.name?.split(' ')[0], user.name?.split(' ')[1])}
        </LargeAvatar>

        <UserInfo>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            {user?.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ wordBreak: 'break-all' }}
          >
            {user.email}
          </Typography>
          <CompanyBadge>
            {user?.company?.name}
          </CompanyBadge>
        </UserInfo>
      </Box>
    </StyledPaper>
  );
};

export default PersonCard;