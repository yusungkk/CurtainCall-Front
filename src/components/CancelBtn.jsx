import {Button} from "@mui/material";

export default function CancelBtn({onClick, viewName}) {
    return (
        <Button
            variant="outlined"
            color={'error'}
            onClick={onClick}
            sx={{
                fontFamily: "'Bareun_hipi', sans-serif",
                fontSize: '15px',
                borderRadius: '10px',
                '&:focus': {
                    outline: 'none'
                },
                '&:hover': {
                    borderColor: 'red',
                },
            }}

        >
            {viewName}
        </Button>
    );
};