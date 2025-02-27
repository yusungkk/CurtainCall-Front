import {Box, Typography, Link, Container} from "@mui/material";
import {useNavigate} from "react-router-dom";

export default function Footer() {
    const navigate = useNavigate();

    const handleInquiryBtn = () => {
        navigate("/faqs");
    }
    return (
        <>
            <Box sx={{paddingBottom: "500px"}}/>
            <Box
                component="footer"
                sx={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    backgroundColor: "#f5f5f5",
                    padding: "40px 0",
                    width: "100%",
                    height: "auto",
                }}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        textAlign: "left",
                    }}
                >
                    {/* 회사 정보 */}
                    <Box sx={{maxWidth: "30%"}}>
                        <Typography variant="body2" color="text.secondary">
                            <strong>커튼콜(주)</strong>
                            <br/>
                            대표이사: 함기용, 심은미, 손홍인, 박희재, 김유성
                            <br/>
                            사업자등록번호 581-88-00303
                            <br/>
                            통신판매업 신고번호: 제2022-서울강남-04515호
                            <br/>
                            <Link href="https://elice.training/" underline="hover">
                                사업자정보 확인
                            </Link>
                        </Typography>
                    </Box>

                    {/* 고객센터 */}
                    <Box sx={{textAlign: "center", maxWidth: "30%"}}>
                        <Typography variant="body2" color="text.secondary">
                            <strong onClick={handleInquiryBtn}
                                    style={{color: "#1976d2", cursor: "pointer"}}>
                                365고객센터&nbsp;
                            </strong>
                            | 언제든지 눌러주세요
                            <br/>
                            <Typography component="span" sx={{fontWeight: "bold", fontSize: "18px"}}>
                                1833-6068
                            </Typography>
                            <br/>
                            서울특별시 강남구 선릉로 433
                            <br/>
                            email: <Link href="mailto:kdt@elice.io">kdt@elice.io</Link>
                        </Typography>
                    </Box>

                    {/* 이용 안내 */}
                    <Box sx={{maxWidth: "30%"}}>
                        <Typography variant="body2" color="text.secondary">
                            <strong>홈페이지 이용 안내</strong>
                            <br/>
                            본 홈페이지는 엘리스 클라우드 백엔드 트랙 5기
                            <br/>
                            3차 팀 프로젝트 중 6팀의 결과물입니다.
                            <br/>
                            <Link href="https://kdt-gitlab.elice.io/cloud_track/class_05/web_project3/team06"
                                  underline="hover">
                                프로젝트 정보 확인
                            </Link>
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </>
    );
}