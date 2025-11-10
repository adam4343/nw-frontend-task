import { Grid, Box, Typography, Button } from '@mui/joy'
import InfiniteScroll from 'react-infinite-scroll-component'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { PageRequest } from '../services/dto/page.request.ts'
import { PageResponse } from '../services/dto/page.response.ts'
import { Add } from '@mui/icons-material'

export default function ScrollableCards<T>(props: {
    loadMore: (page: PageRequest) => Promise<PageResponse<T> | undefined>
    mapCard: (value: T, deleteItem: (id: string) => void) => React.JSX.Element
    skeletonMap: (_: any, index: number) => React.JSX.Element
    emptyStateTitle?: string
    emptyStateDescription?: string
    onCreateClick?: () => void
}) {
    const initial = [...Array(12)].map(props.skeletonMap)
    const [cards, setCards] = useState<React.JSX.Element[]>(initial)
    const [page, setPage] = useState<number>(0)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isEmpty, setIsEmpty] = useState<boolean>(false)
    const hasLoadedInitial = useRef(false)
    const { loadMore: loadMoreData, mapCard } = props

    const deleteItem = useCallback((id: string) => {
        setCards((prevCardsState) => {
            const i = prevCardsState.findIndex((card) => card.key == id)
            if (i != -1) {
                const newCards = [...prevCardsState]
                newCards.splice(i, 1)
                if (newCards.length === 0) {
                    setIsEmpty(true)
                    setHasMore(false)
                }
                return newCards
            }
            return prevCardsState
        })
    }, [])

    const loadBanners = useCallback(async () => {
        const newCards = await props.loadMore({ page, pageSize: 12 })
        if (!newCards || newCards.content.length === 0) {
            setHasMore(false)
            return
        }
        const newElements = newCards.content.map((value) => props.mapCard(value, deleteItem))
        setCards((prevCards) => [...prevCards, ...newElements])
        const nextPage = page + 1
        setHasMore(nextPage <= newCards.maxPageNumber)
        setPage(nextPage)
    }, [page, deleteItem, props])

    useEffect(() => {
        if (hasLoadedInitial.current) return
        hasLoadedInitial.current = true
        
        const loadInitialBanners = async () => {
            setIsLoading(true)
            const newCards = await loadMoreData({ page: 0, pageSize: 12 })
            setIsLoading(false)
            
            if (!newCards || newCards.content.length === 0) {
                setHasMore(false)
                setIsEmpty(true)
                setCards([])
                return
            }
            const newElements = newCards.content.map((value) => mapCard(value, deleteItem))
            setCards(newElements) 
            setHasMore(1 <= newCards.maxPageNumber)
            setPage(1)
            setIsEmpty(false)
        }
        
        loadInitialBanners().catch((reason) => {
            console.error(reason)
            setIsLoading(false)
        })
    }, [loadMoreData, mapCard, deleteItem])

    const loadMore = () => {
        loadBanners().catch((reason) => console.error(reason))
    }

    if (isEmpty && !isLoading && cards.length === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    textAlign: 'center',
                    px: 2,
                }}
            >
                <Box
                    sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        backgroundColor: 'background.level1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                    }}
                >
                    <Add sx={{ fontSize: 48, color: 'text.tertiary' }} />
                </Box>
                <Typography
                    level="h3"
                    sx={{
                        mb: 1,
                        fontWeight: 600,
                    }}
                >
                    {props.emptyStateTitle || 'No banners yet'}
                </Typography>
                <Typography
                    level="body-md"
                    sx={{
                        mb: 3,
                        color: 'text.tertiary',
                        maxWidth: 400,
                    }}
                >
                    {props.emptyStateDescription || 'Get started by creating your first banner. Add images and links to showcase your content.'}
                </Typography>
                {props.onCreateClick && (
                    <Button
                        size="lg"
                        color="primary"
                        startDecorator={<Add />}
                        onClick={props.onCreateClick}
                        sx={{
                            px: 3,
                        }}
                    >
                        Create Your First Banner
                    </Button>
                )}
            </Box>
        )
    }

    return (
        <InfiniteScroll
            dataLength={cards.length}
            next={loadMore}
            hasMore={hasMore}
            scrollableTarget="scroll"
            loader={
                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 2}}
                
                >
                    {[...Array(3)].map((_, i) => (
                        <Grid
                            key={`loader-${i}`}
                            xl={3}
                            lg={4}
                            md={6}
                            sm={6}
                            xs={12}
                        >
                            {props.skeletonMap(null, i)}
                        </Grid>
                    ))}
                </Grid>
            }
            style={{ width: '100%' }}
        >
            <Grid
                container
                spacing={2}
                sx={{ m: 0}}
            >
                {...cards}
            </Grid>
        </InfiniteScroll>
    )
}
