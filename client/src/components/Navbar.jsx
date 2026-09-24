import { AppBar, Container, Toolbar, Typography } from "@mui/material"

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
                       component="span"
                       sx={{ fontWeight: 400, letterSpacing: '-0.5px' }}
                    >
                        <strong>Campus</strong>SkillExchange
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default Navbar