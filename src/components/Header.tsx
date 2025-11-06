import GlobalStyles from '@mui/joy/GlobalStyles'
import Box from '@mui/joy/Box'
import IconButton from '@mui/joy/IconButton'
import MenuIcon from '@mui/icons-material/Menu'

import { toggleSidebar } from '../utils'

export default function Header() {
    return (
        <>
            <GlobalStyles
                styles={(theme) => ({
                    ':root': {
                        '--Header-height': '52px',
                        [theme.breakpoints.up('md')]: {
                            '--Header-height': '0px',
                        },
                    },
                })}
            />
            <Box
                sx={{
                    display: { xs: 'flex', md: 'none' },
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                }}
            >
                <IconButton
                    onClick={() => toggleSidebar()}
                    variant="outlined"
                    color="neutral"
                    size="sm"
                >
                    <MenuIcon />
                </IconButton>
            </Box>
        </>
    )
}
