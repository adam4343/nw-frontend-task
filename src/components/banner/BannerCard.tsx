import { BannerDto } from '../../services/dto/banner.dto.ts'
import { Button, Card, CardActions, CardOverflow, Grid, IconButton, Skeleton, Typography } from '@mui/joy'
import Box from '@mui/joy/Box'
import { Delete, Edit, Link as LinkIcon } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import Image from '../Image.tsx'

export default function BannerCard(props: { banner?: BannerDto; delete?: () => void; onEdit?: (banner: BannerDto) => void }) {
    return (
        <Grid xl={3} lg={4} md={6} sm={6} xs={12}>
            <Card
                variant="plain"
                component={Link}
                to={props.banner?.id ? `/banners/${props.banner.id}` : '#'}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 9,
                    backgroundColor: 'background.surface',
                    border: '1px solid',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        boxShadow: 'lg',
                        transform: 'translateY(-4px)',
                    }
                }}
            >
                <CardOverflow>
                    <Box
                        sx={{
                            aspectRatio: '16/9',
                            overflow: 'hidden',
                            borderRadius: 2,
                            m: 2.5,
                            backgroundColor: 'neutral.50',
                            position: 'relative',
                        }}
                    >
                        <Image url={props.banner?.imageUrl} />
                    </Box>
                </CardOverflow>

                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2.5,
                        px: 2.5,
                        pb: 2
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            minHeight: '24px'
                        }}
                    >
                        <LinkIcon sx={{ fontSize: '1.125rem', color: 'text.tertiary' }} />
                        <Typography
                            level="body-md"
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                color: 'text.secondary',
                                fontWeight: 500,
                                flex: 1,
                                transition: 'color 0.3s, text-decoration 0.3s',
                                '&:hover': {
                                    color: 'primary.plainColor',
                                    textDecoration: 'underline'
                                }
                            }}
                            onClick={(e) => {
                                e.preventDefault()
                                if (props.banner?.link) window.open(props.banner.link, '_blank')
                            }}
                        >
                            <Skeleton loading={!props.banner} variant="text">
                                {props.banner?.link || 'Banner link'}
                            </Skeleton>
                        </Typography>
                    </Box>

                    <CardActions
                        sx={{
                            gap: 1.5,
                            p: 0,
                            mt: 'auto'
                        }}
                    >
                        <Button
                            variant="solid"
                            color="primary"
                            size="md"
                            onClick={(e) => {
                                e.preventDefault()
                                if (props.banner && props.onEdit) {
                                    props.onEdit(props.banner)
                                }
                            }}
                            startDecorator={<Edit />}
                            sx={{
                                flex: 1,
                                borderRadius: 2,
                                fontWeight: 600,
                                transition: 'all 0.3s',
                                '&:hover': {
                                    transform: 'scale(1.02)'
                                }
                            }}
                        >
                            Edit
                        </Button>
                        <IconButton
                            variant="soft"
                            color="danger"
                            size="md"
                            onClick={(e) => {
                                e.preventDefault()
                                if (props.delete) props.delete()
                            }}
                            sx={{
                                borderRadius: 2,
                                transition: 'all 0.3s',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    backgroundColor: 'danger.softHoverBg'
                                }
                            }}
                        >
                            <Delete />
                        </IconButton>
                    </CardActions>
                </Box>
            </Card>
        </Grid>
    )
}
