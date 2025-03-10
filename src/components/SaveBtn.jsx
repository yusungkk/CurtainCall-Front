import {Button} from "@mui/material";

export default function SaveBtn({btnType, viewName, isDisabled}) {
    return (
        <Button
            type={btnType}
            variant="outlined"
            color={"success"}
            disabled={isDisabled}
            sx={{
                fontFamily: "'Bareun_hipi', sans-serif",
                borderRadius: '10px',
                fontSize: '15px',
                '&:focus': {
                    outline: 'none',
                },
                '&:hover': {
                    borderColor: 'green',
                },
            }}
        >
            {viewName}
        </Button>
    )
}