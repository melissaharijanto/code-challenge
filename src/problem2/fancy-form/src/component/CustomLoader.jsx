import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const CustomLoader = ({ mt }) => {
  return (
    <Box sx={{ width: '100%', mt: mt, color: '#DBBFFE' }}>
      <CircularProgress color="inherit" />
    </Box>
  );
};

export default CustomLoader;
