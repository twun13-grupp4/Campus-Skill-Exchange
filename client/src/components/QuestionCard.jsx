import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from "@mui/material"
import {Link as RouterLink} from 'react-router-dom'

function QuestionCard({question}) {
    const isAnswered = question.status === 'answered'

    return(
        <Card variant="outlined">
            <CardActionArea component={RouterLink} to={`/questions/${question._id}`}>
                <CardContent>
                    <Stack direction="row" spacing={1} sx ={{mb : 1}}>
                        <Chip label={question.courseTag} size="small" />
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
                        Asked by {question.author} · {new Date(question.createdAt).toLocaleDateString()}
                    </Typography>

                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default QuestionCard