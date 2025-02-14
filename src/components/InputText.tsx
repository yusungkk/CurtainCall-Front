import {TextField} from "@mui/material";

export default function InputText({id, name, label, value, event, isError, errorText, rowNum = 1}) {

    return(
        <TextField
            variant="outlined"
            id={id}
            name={name}
            label={label}
            margin="normal"
            rows = {rowNum}
            multiline={rowNum > 1}
            fullWidth
            value={value}
            onChange={event}
            error={isError}
            helperText={errorText}
            sx={{width: "70%"}}
            required
        />
    )
};