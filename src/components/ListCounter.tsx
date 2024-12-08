import { Content } from "@/types/contentTypes"

type ListCounterProps = {
    filteredGamePages: Content[]
}

const ListCounter = ({ filteredGamePages }: ListCounterProps) => {
    return (
        <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)', // Translucent white background
            borderRadius: '12px',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
            margin: '20px 0',
            minWidth: '100px', // Ensure a minimum width
        }}>
            <span style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' // Slight text shadow for depth
            }}>
                Games: {filteredGamePages.length}
            </span>
        </div>
    )
}

export default ListCounter