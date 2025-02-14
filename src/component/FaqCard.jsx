import {Card, CardContent, Icon, Typography} from "@mui/material";

export default function FaqCard({icon: Icon, title, description}) {
    return (
        <Card sx={{ m: 2 }}>
            <CardContent sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                '&:hover': {
                    backgroundColor: '#f5f5f5'
                }
            }}>
                <Icon sx={{ mr: 2 }} />
                <div>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'gray' }}>
                        {description}
                    </Typography>
                </div>
            </CardContent>
        </Card>
    );
};