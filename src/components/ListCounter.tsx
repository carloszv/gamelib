import { Content } from "@/types/contentTypes"
import { styled, alpha } from '@mui/material';

type ListCounterProps = {
    filteredGamePages: Content[]
}

const CounterContainer = styled('div')(({ theme }) => ({
    background: 'linear-gradient(90deg, #08448c 0%, #047cbb 100%)',
    borderRadius: '12px',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.08)}`,
    margin: '20px 0',
    minWidth: '120px',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: `0 6px 16px ${alpha(theme.palette.common.black, 0.12)}`,
    }
}));

const CounterText = styled('span')(({ theme }) => ({
    color: '#ffffff',
    fontSize: '1.25rem',
    fontWeight: 600,
    letterSpacing: '0.5px',
}));

const ListCounter = ({ filteredGamePages }: ListCounterProps) => {
    return (
        <CounterContainer>
            <CounterText>
                Games: {filteredGamePages.length}
            </CounterText>
        </CounterContainer>
    )
}

export default ListCounter