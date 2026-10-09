import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material"
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
              
                    <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                        {/* ml: 'auto' på boxen istället för på en enskild knapp, så hela gruppen skjuts åt höger */}
                        <Button
                        component={RouterLink}
                        to="/ask"
                        variant="text"
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                            Ask a question
                        </Button>

                        <Button
                        component={RouterLink}
                        to="/login"
                        variant="text"
                        sx={{
                            flexShrink: 0,
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                        >
                            Log in
                        </Button>

                        <Button
                            component={RouterLink}
                            to="/signup"
                            variant="contained"
                            disableElevation
                            sx={{
                                flexShrink: 0,
                                textTransform: 'none',
                                fontWeight: 700,
                                bgcolor: '#373ee5',
                                color: '#ffffff',
                                borderRadius: '12px',
                                px: 2.5,
                                py: 1.25,
                                '&:hover': {
                                    bgcolor: '#2c32bd',
                                },
                            }}
                        >
                            Sign up

                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default Navbar