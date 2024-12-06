import React from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(event.target.value);
    };

    return (
        <input 
            type="text" 
            placeholder="Search..." 
            onChange={handleChange}
            style={{
                fontSize: '16px',
                padding: '10px',
                width: '300px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                marginTop: 20
            }}
        />
    );
};

export default SearchBar;
