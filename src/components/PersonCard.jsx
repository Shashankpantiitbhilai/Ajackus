import React from "react";
import "../style/Dashboard.css";
import {
  Typography,
  CardContent,
  Box,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Tooltip,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

import { getRandomColor } from "../utils/ColorUtils";
import { getInitials } from "../utils/nameUtils";

const IndividualCard = ({
  user,
  handleSelectedUser,
  setFormData,
  setIsEditing,
  handleDelete,
  resetForm
}) => {
  return (
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar
          sx={{
            bgcolor: getRandomColor(),
            width: 50,
            height: 50,
            mr: 2,
          }}
        >
          {getInitials(user.name?.split(' ')[0], user.name?.split(' ')[1])}
        </Avatar>
        <Box>
          <Typography variant="h6">
            {user?.name?.split(' ')[0]} {user?.name?.split(' ')[1]}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            {user.email}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Chip
          label={user?.company?.name}
          size="small"
          sx={{
            bgcolor: "primary.light",
            color: "primary.contrastText",
          }}
        />
        <Box>
          <Tooltip title="Edit User">
            <IconButton
              size="small"
              onClick={() => {
                
                handleSelectedUser(user);
                setFormData(user);
                setIsEditing(true);
              }}

              sx={{ mr: 1 }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete User">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(user.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </CardContent>
  );
};

export default IndividualCard;
