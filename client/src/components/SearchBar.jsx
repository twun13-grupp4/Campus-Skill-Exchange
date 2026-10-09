import { TextField } from "@mui/material";

function SearchBar({ value, onChange }) { //value är söktexten från sidan,  onChange skickar den nya texten tillbaka till sidan när användaren skriver
    return (
        <TextField
          label="Search questions"
          placeholder="Search by title or description"
          type="search"
          value={value}   
          onChange={(event) => onChange(event.target.value)}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper',
                borderRadius: 3,
            },
          }}
        />
    )
}

export default SearchBar;