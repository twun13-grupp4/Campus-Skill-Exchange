import { AppBar, Container, Toolbar, Typography } from "@mui/material"
import { Link as RouterLink } from 'react-router-dom'

function Navbar() {
    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                bgcolor: 'background.paper',
                color: '#1e293b',
                borderBottom: '1px solid #e2e8f0',
            }}
        >
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ minHeight: { xs: 64, sm: 76} }}>
                    <Typography
                       variant="h6"
                       component={RouterLink}
                       to="/"
                       sx={{ 
                            fontWeight: 400,
                            letterSpacing: '-0.5px',
                            color: 'inherit',
                            textDecoration: 'nonr',
                            borderRadius: 1,
                            '&:focus-visible': {
                                outline: '2px solid #3949ab',
                                outlineOffset: '4px',
                            },
                        }}
                    >
                        <strong>Campus</strong>SkillExchange
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default Navbar