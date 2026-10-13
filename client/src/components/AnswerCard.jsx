import { Avatar, Paper, Stack, Typography } from "@mui/material"

/* Displays one answer's author, date, upvotes and description */

function AnswerCard({ answer }) {
    const autorName = answer.author?.name ?? 'Deleted user'

    //use first letter of up to two names for the authors avatar.
    const authorInitials = autorName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((name) => name[0])
        .join('')
        .toUpperCase()

    // Display the date in a short format such as "20 sept".
    const formattedDate = new Date(answer.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
    })

    return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, borderColor: '#e2e8f0'}}>
            <Stack direction="row" spacing={1.5} sx={{ mb: 1.5, alignItems: 'center'}}>
                <Avatar
                    sx={{
                        width: 36,
                        height: 36,
                        bgcolor: '#dce5ff',
                        color: '#294b8a',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                    }}
                >
                    {authorInitials}
                </Avatar>

                <Typography variant="body2" sx={{ fontWeight: 600, color: '#36558a' }}>
                    {authorName}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                    {formattedDate}
                </Typography>

                <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                    {answer.upvotes} {answer.upvotes === 1 ? 'upvote' : 'upvotes'}
                </Typography>
            </Stack>

            <Typography
                component="p"
                variant="body1"
                color="text.primary"
                sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere'}}
            >
                {answer.description}
            </Typography>
        </Paper>
    )
}

export default AnswerCard