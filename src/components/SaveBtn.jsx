import {Button} from "@mui/material";

export default function SaveBtn({btnType, viewName}) {
    return (
        <Button
            type={btnType}
            variant="outlined"
            color={"success"}
            sx={{
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