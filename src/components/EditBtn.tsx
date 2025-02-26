import {Button} from "@mui/material";

export default function EditBtn({onClick, viewName}) {
    return (
        <Button
            variant="outlined"
            color={'secondary'}
            onClick={onClick}
            sx={{
                marginLeft: '10px',
                fontSize: '15px',
                borderRadius: '10px',
                fontFamily: "'Bareun_hipi', sans-serif",
                '&:focus': {
                    outline: 'none',
                },
                '&:hover': {
                    borderColor: 'secondary',
                },
            }}
        >
            {viewName}
        </Button>
    );
};