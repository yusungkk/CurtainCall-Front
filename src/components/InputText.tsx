import {TextField} from "@mui/material";

export default function InputText({id, name, label, value, event, isError, errorText, onBlur, width = '70%', rowNum = 1}) {

    return (
        <TextField
            variant="outlined"
            id={id}
            name={name}
            label={label}
            margin="normal"
            rows={rowNum}
            multiline={rowNum > 1}
            fullWidth
            value={value}
            onBlur={onBlur}
            onChange={event}
            error={isError}
            helperText={errorText}
            sx={{
                fontFamily: "'Bareun_hipi', sans-serif",
                width: {width}
        }}
            required
        />
    )
};