import { Grid } from '@mui/joy'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { usePageData } from '../../context/page-data/page-data.context.ts'

export default function Banner() {
    const { setPageData } = usePageData()
    const { id } = useParams()

    useEffect(() => {
        setPageData({ title: `Banner ${id}` })
    }, [id, setPageData])

    return (
        <Grid
            container
            spacing={2}
        >
            <h1>Todo implement</h1>
            <h1>ID: {id}</h1>
        </Grid>
    )
}
