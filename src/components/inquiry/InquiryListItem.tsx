import {Chip, Divider, ListItem, ListItemText, Typography} from "@mui/material";
import {CheckCircleOutline} from "@mui/icons-material";

export default function InquiryListItem({inquiry, onClick}) {

    const getStatusLabel = (status) => {
        return status === "READY" ? "답변 대기" : "답변 완료";
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case "TICKET":
                return "티켓";
            case "USER":
                return "회원";
            case "ETC":
                return "기타";
        }
    };

    return (
        <div key={inquiry.id}>
            <ListItem
                alignItems="flex-start"
                onClick={onClick}
                sx={{
                    transition: "background-color 0.2s ease-in-out",
                    fontFamily: "'Bareun_hipi', sans-serif",
                    "&:hover": {
                        backgroundColor: "#f5f5f5",
                        cursor: "pointer",
                    }
                }}
            >
                <Chip
                    label={getStatusLabel(inquiry.status)}
                    icon={<CheckCircleOutline/>}
                    color={inquiry.status === "READY" ? "error" : "success"}
                    size="small"
                    sx={{marginRight: "16px"}}
                />
                <div>
                    <Typography variant="body1" color="black">
                        {inquiry.title}
                    </Typography>
                    <ListItemText
                        secondary={
                            <Typography variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            fontFamily: "'Bareun_hipi', sans-serif",
                                        }}>
                                {getTypeLabel(inquiry.type)} &nbsp;·&nbsp; {new Date(inquiry.createAt).toLocaleDateString()}
                            </Typography>
                        }
                    />
                </div>
            </ListItem>
            <Divider sx={{
                marginBottom: '8px'
            }}/>
        </div>
    )
};