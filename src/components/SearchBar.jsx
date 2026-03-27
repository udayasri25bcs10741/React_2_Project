import { MdSearch, MdClose } from 'react-icons/md';

export default function SearchBar({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="search-bar">
      <MdSearch className="search-icon" />
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button className="search-clear" onClick={() => onChange('')} title="Clear">
          <MdClose />
        </button>
      )}
    </div>
  );
}
