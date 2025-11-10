import Modal from '@mui/joy/Modal'
import ModalDialog from '@mui/joy/ModalDialog'
import { 
    Button, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    ModalClose,
    Input,
    FormControl,
    FormLabel,
    FormHelperText
} from '@mui/joy'
import Divider from '@mui/joy/Divider'
import Box from '@mui/joy/Box'
import { useState, useEffect } from 'react'
import { BannerDto } from '../../services/dto/banner.dto.ts'
import Image from '../Image.tsx'
import BannerService from '../../services/banner.service.ts'

export default function BannerModal(props: {
    open: boolean;
    onClose: () => void;
    banner?: BannerDto;
}) {
    const [link, setLink] = useState(props.banner?.link || '');
    const [imageUrl, setImageUrl] = useState(props.banner?.imageUrl || '');
    const [errors, setErrors] = useState<{ link?: string; imageUrl?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    useEffect(() => {
        if (props.open) {
            setLink(props.banner?.link || '');
            setImageUrl(props.banner?.imageUrl || '');
            setErrors({});
        }
    }, [props.open, props.banner]);

    const handleSubmit = async () => {
        const newErrors: { link?: string; imageUrl?: string } = {};
        
        if (!link.trim()) {
            newErrors.link = 'Link is required';
        }
        if (!imageUrl.trim()) {
            newErrors.imageUrl = 'Image URL is required';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);           
            return;
        }

        setIsSubmitting(true);
        
        try {
            const banner: BannerDto = {
                id: props.banner?.id || crypto.randomUUID().slice(0, 6),
                link: link.trim(),
                imageUrl: imageUrl.trim(),
            };

            if (props.banner?.id) {
                await BannerService.updateBanner(props.banner.id, banner);
            } else {
                await BannerService.createBanner(banner);
            }
            
            handleClose();
            window.location.reload();
        } catch (error) {
            console.error(`Error ${props.banner?.id ? 'updating' : 'creating'} banner:`, error);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleClose = () => {
        setLink('');
        setImageUrl('');
        setErrors({});
        setIsSubmitting(false);
        props.onClose();
    }

    return (
        <Modal
            open={props.open}
            onClose={handleClose}

        >
            <ModalDialog
                sx={{
                    maxWidth: 560,
                    width: '100%',
                    borderRadius: 3,
                    zIndex: 10000,
                }}
            >
                <ModalClose />
                <DialogTitle>
                    {props.banner ? 'Edit Banner' : 'Create Banner'}
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl error={!!errors.link}>
                            <FormLabel>Link</FormLabel>
                            <Input
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="https://example.com"
                                error={!!errors.link}
                            />
                            {errors.link && (
                                <FormHelperText>{errors.link}</FormHelperText>
                            )}
                        </FormControl>

                        <FormControl error={!!errors.imageUrl}>
                            <FormLabel>Image URL</FormLabel>
                            <Input
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                error={!!errors.imageUrl}
                            />
                            {errors.imageUrl && (
                                <FormHelperText>{errors.imageUrl}</FormHelperText>
                            )}
                        </FormControl>

                        {imageUrl && (
                            <Box sx={{ mt: 1 }}>
                                <FormLabel>Preview</FormLabel>
                                <Box sx={{ mt: 1, borderRadius: 'sm', overflow: 'hidden' }}>
                                    <Image url={imageUrl} />
                                </Box>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ gap: 1.5, pt: 2 }}>
                    <Button
                        variant="plain"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        sx={{
                            px: 3,
                            fontWeight: 500
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        onClick={handleSubmit}
                        color="primary"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        sx={{
                            px: 3,
                            borderRadius: 2,
                            fontWeight: 500
                        }}
                    >
                        {props.banner ? 'Save' : 'Create'}
                    </Button>
                </DialogActions>
            </ModalDialog>
        </Modal>
    )
}