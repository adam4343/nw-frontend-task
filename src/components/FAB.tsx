import { Button } from '@mui/joy'
import Add from '@mui/icons-material/Add'
import { useState } from 'react'
import BannerModal from './banner/bannerModal'

export default function FAB() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button
                size="sm"
                color="primary"
                startDecorator={<Add />}
                onClick={() => setOpen(true)}
            >
                Add Banner
            </Button>

            <BannerModal
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    )
}
