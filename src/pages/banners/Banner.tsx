import { Box, Typography, Button, Skeleton, Link } from '@mui/joy'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { usePageData } from '../../context/page-data/page-data.context.ts'
import BannerService from '../../services/banner.service.ts'
import BannerModal from '../../components/banner/bannerModal.tsx'
import Image from '../../components/Image.tsx'
import { Edit, Delete } from '@mui/icons-material'
import ConfirmModal from '../../components/ConfirmModal.tsx'
import { BannerDto } from '../../services/dto/banner.dto.ts'

export default function Banner() {
    const { setPageData } = usePageData()
    const { id } = useParams()
    const navigate = useNavigate()
    const [banner, setBanner] = useState<BannerDto | null>(null)
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    useEffect(() => {
        const loadBanner = async () => {
            if (!id) return
            setLoading(true)
            const bannerData = await BannerService.getBanner(id)
            setBanner(bannerData || null)
            setLoading(false)
            setPageData({ title: bannerData ? `Banner ${id}` : 'Banner not found' })
        }
        loadBanner()
    }, [id, setPageData])

    const handleDelete = async () => {
        if (!id) return
        await BannerService.deleteBanner(id)
        navigate('/banners')
    }

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '60vh',
                gap: 3,
                px: 2
            }}>
                <Skeleton variant="rectangular" width="100%" height={400} sx={{ maxWidth: 900, borderRadius: 2 }} />
                <Box sx={{ width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Skeleton variant="text" width="40%" height={32} />
                    <Skeleton variant="text" width="80%" height={24} />
                </Box>
            </Box>
        )
    }

    if (!banner) {
        return (
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '60vh', 
                gap: 3,
                px: 2
            }}>
                <Typography level="h2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                    Banner not found
                </Typography>
                <Button 
                    variant="soft"
                    onClick={() => navigate('/banners')}
                    sx={{ px: 3 }}
                >
                    Go back to Banners
                </Button>
            </Box>
        )
    }

    return (
        <>
            <Box sx={{ 
                width: '100%',
                maxWidth: 900,
                mx: 'auto',
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 3, sm: 4, md: 5 },
                display: 'flex',
                flexDirection: 'column',
                gap: 4
            }}>
                <Box sx={{ 
                    mb: 0,
                    borderRadius: 2,
                    overflow: 'hidden',
                    backgroundColor: 'background.surface',
                    boxShadow: 'sm'
                }}>
                    <Image url={banner.imageUrl} />
                </Box>

                <Box>
                    <Typography 
                        level="body-xs" 
                        sx={{ 
                            mb: 1.5,
                            color: 'text.tertiary',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontWeight: 500
                        }}
                    >
                        Link
                    </Typography>
                    <Link
                        href={banner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: 'primary.plainColor',
                            wordBreak: 'break-all',
                            lineHeight: 1.6,
                            fontSize: '1rem',
                            '&:hover': {
                                textDecoration: 'underline',
                            }
                        }}
                    >
                        {banner.link}
                    </Link>
                </Box>

                <Box sx={{ 
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    pt: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Button
                        variant="solid"
                        color="primary"
                        startDecorator={<Edit />}
                        onClick={() => setModalOpen(true)}
                        sx={{ 
                            flex: 1,
                            px: 3,
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 500
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        color="danger"
                        startDecorator={<Delete />}
                        onClick={() => setDeleteModalOpen(true)}
                        sx={{ 
                            flex: 1,
                            px: 3,
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 500
                        }}
                    >
                        Delete
                    </Button>
                </Box>
            </Box>

            <BannerModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                banner={banner}
            />

            <ConfirmModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                confirm={handleDelete}
                action="delete this banner"
            />
        </>
    )
}
