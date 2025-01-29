import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress, Box, Typography } from "@mui/material";

const InfiniteScroller = ({
  hasMore,
  users,
  fetchMoreUsers,
}) => {
  return (
    <InfiniteScroll
      dataLength={users.length}
      next={fetchMoreUsers}
      hasMore={hasMore}
      loader={
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress />
        </Box>
      }
      endMessage={
        <Typography textAlign="center" color="textSecondary" py={2}>
          No more users to load
        </Typography>
      }
    ></InfiniteScroll>
  );
};


export default InfiniteScroller;