import { Button } from "@mui/material";

export default function LoadMoreBtn({ onClick, isDisabled, viewName }) {
    return (
        <Button
            variant="outlined"
            sx={{
                fontSize: '20px',
                fontWeight: 'bold',
                borderColor: 'black',
                color: "black",
                borderRadius: '10px',
                paddingLeft: 5,
                paddingRight: 5,
                '&:focus': {
                    outline: 'none',
                    borderColor: 'black',
                },
                '&:hover': {
                    outline: 'none',
                    borderColor: 'black',
                },
                '&:active': {
                    borderColor: 'black',
                },
            }}
            onClick={onClick}
            disabled={isDisabled}
        >
            {viewName}
        </Button>
    );
}
