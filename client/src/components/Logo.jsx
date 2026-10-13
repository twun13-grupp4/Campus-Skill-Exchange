import { Box } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import logo from '../assets/CampusSkillExchange Logo Banner.png'

/**
 * Displays the shared navbar logo as a link.
 * Crops excess vertical whitespace without changing the image file.
 */
function Logo({ to = '/' }) {
  return (
    <Box
      component={RouterLink}
      to={to}
      sx={{
        display: 'inline-flex',
        flexShrink: 0,
        borderRadius: 1,
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: '4px',
        },
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="CampusSkillExchange home"
        sx={{
          display: 'block',
          width: 300,
          height: 56,
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </Box>
  )
}

export default Logo
