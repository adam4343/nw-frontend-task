import BannerService from '../../services/banner.service.ts'
import ScrollableCards from '../../components/ScrollableCards.tsx'
import { useEffect, useState } from 'react'
import { usePageData } from '../../context/page-data/page-data.context.ts'
import BannerCard from '../../components/banner/BannerCard.tsx'
import BannerModal from '../../components/banner/bannerModal.tsx'
import ConfirmModal from '../../components/ConfirmModal.tsx'
import { BannerDto } from '../../services/dto/banner.dto.ts'

export default function Banners() {
    const { setPageData } = usePageData()
    const [modalOpen, setModalOpen] = useState(false)
    const [editingBanner, setEditingBanner] = useState<BannerDto | undefined>(undefined)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [bannerToDelete, setBannerToDelete] = useState<BannerDto | null>(null)

    useEffect(() => {
        setPageData({ title: 'Banners' })
    }, [setPageData])

    const handleEdit = (banner: BannerDto) => {
        setEditingBanner(banner)
        setModalOpen(true)
    }

    const handleCloseModal = () => {
        setModalOpen(false)
        setEditingBanner(undefined)
    }

    const handleDeleteClick = (banner: BannerDto) => {
        setBannerToDelete(banner)
        setDeleteModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!bannerToDelete?.id) return
        await BannerService.deleteBanner(bannerToDelete.id)
            .catch((reason) => console.error(reason))
        window.location.reload()
    }

    return (
        <>
            <ScrollableCards
                loadMore={page => BannerService.getBanners(page)}
                mapCard={(banner, _deleteItem) => (
                    <BannerCard
                        key={banner.id}
                        banner={banner}
                        onEdit={handleEdit}
                        delete={() => handleDeleteClick(banner)}
                    />
                )}
                skeletonMap={(_, i) => <BannerCard key={'skeleton-' + i} />}
                onCreateClick={() => {
                    setEditingBanner(undefined)
                    setModalOpen(true)
                }}
            />
            <BannerModal
                open={modalOpen}
                onClose={handleCloseModal}
                banner={editingBanner}
            />
            <ConfirmModal
                open={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false)
                    setBannerToDelete(null)
                }}
                confirm={handleConfirmDelete}
                action="delete this banner"
            />
        </>
    )
}
