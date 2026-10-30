import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from "@mui/material"
import {Link as RouterLink} from 'react-router-dom'

/**
 * Summary card for one question in a list - course, status, title,
 * description preview, and author/date. Links to the full question page.
 */
function QuestionCard({question}) {
    const isAnswered = question.status === 'answered'
    // course/author are populated objects now, and may be null if deleted
    const courseName = question.course?.name ?? 'Uncategorized'
    const authorName = question.author?.name ?? 'Deleted user'

    return(
        <Card variant="outlined">
            <CardActionArea component={RouterLink} to={`/questions/${question._id}`}>
                <CardContent>
                    <Stack direction="row" spacing={1} sx ={{mb : 1}}>
                        <Chip label={courseName} size="small" />
                        <Chip label={isAnswered ? 'Answered' : 'Unanswered'} 
                        size="small" 
                        variant="outlined" 
                        color={isAnswered ? 'success' : 'default'}
                        />
                    </Stack>

                    <Typography component="h2" variant="h6">
                        {question.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" noWrap>
                        {question.description}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                        Asked by {authorName} · {new Date(question.createdAt).toLocaleDateString()}
                    </Typography>

                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default QuestionCard