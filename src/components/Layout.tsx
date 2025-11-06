import { CssVarsProvider } from '@mui/joy/styles'
import CssBaseline from '@mui/joy/CssBaseline'
import { Outlet, useLocation, useParams, Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { usePageData } from '../context/page-data/page-data.context.ts'
import { Sheet, Box, Divider, Typography, Button } from '@mui/joy'
import Breadcrumbs from '@mui/joy/Breadcrumbs'
import { KeyboardArrowRight } from '@mui/icons-material'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
export default function Layout() {
    const { pageData } = usePageData()
    const location = useLocation()
    const { id } = useParams()

    const isSinglePage = !!(location.pathname.includes('/banners/') && id)

    return (
        <CssVarsProvider>
            <CssBaseline />
            <Box sx={{ display: 'flex', minHeight: '100dvh', overflow: 'hidden' }}>              
                <Sidebar />
                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                        overflowY: 'auto',
                        height: '100dvh',
                        gap: 1,
                    }}
                >
                    <Sheet
                        sx={{
                            display: 'flex',
                            gap: 1.5,
                            py: 2.5,
                            px: 3,
                            flexDirection: "column",
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                            }}
                        >
                            <Breadcrumbs
                                aria-label="breadcrumbs"
                                separator={<KeyboardArrowRight />}
                                size="sm"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography
                                    color="neutral"
                                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                                >
                                    <HomeRoundedIcon fontSize="small" />
                                </Typography>

                                <Box
                                    component={Link}
                                    to="/banners"
                                    sx={{
                                        fontSize: 13,
                                        fontWeight: !isSinglePage ? 'bold' : 'normal',
                                        color: 'text.tertiary',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            color: 'primary.plainColor',
                                            textDecoration: 'underline',
                                        },
                                    }}
                                >
                                    Banners
                                </Box>

                                {isSinglePage && (
                                    <Typography
                                        color="primary"
                                        fontSize={13}
                                    >
                                        {id}
                                    </Typography>
                                )}
                            </Breadcrumbs>
                            <Header />
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                                flexWrap: 'wrap',
                                gap: 1,
                            }}
                        >
                            <Typography
                                level="h2"
                                component="h1"
                            >
                                {pageData.title}
                            </Typography>

                            {pageData.button && (
                                <Button
                                    onClick={pageData.button.click}
                                    color="primary"
                                    startDecorator={pageData.button.icon}
                                    size="sm"
                                >
                                    {pageData.button.label}
                                </Button>
                            )}
                        </Box>
                    </Sheet>
                    <Divider />
                    <Sheet
                        id="scroll"
                        sx={{
                            overflowY: 'auto',
                            width: '100%',
                            height: '90dvh',
                            padding: 2,
                        }}
                    >
                        <Outlet />
                    </Sheet>
                    <Divider />
                </Box>
            </Box>
        </CssVarsProvider>
    )
}
