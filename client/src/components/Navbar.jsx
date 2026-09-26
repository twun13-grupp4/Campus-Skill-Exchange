import { AppBar, Button, Container, Toolbar, Typography } from "@mui/material"
import { Link as RouterLink } from 'react-router-dom'

function Navbar() {
    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                bgcolor: 'background.paper',
                color: 'text.primary',
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
                            textDecoration: 'none',
                            borderRadius: 1,
                            '&:focus-visible': {
                                outline: '2px solid',
                                outlineColor: 'primary.main',
                                outlineOffset: '4px',
                            },
                        }}
                    >
                        <strong>Campus</strong>SkillExchange
                    </Typography>

                    <Button
                       component={RouterLink}
                       to="/login"
                       variant="text"
                       sx={{
                        ml: 'auto',
                        flexShrink: 0,
                        textTransform: 'none',
                        fontWeight: 600,
                       }}
                    >
                        Log in
                    </Button>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default Navbar