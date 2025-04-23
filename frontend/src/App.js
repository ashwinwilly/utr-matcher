import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [utr, setUTR] = useState('');
  const [rate, setRate] = useState('');
  const [major, setMajor] = useState('');
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState('');
  const [school, setSchool] = useState(null);
  const [error, setError] = useState('');

  // 🔍 School suggestions
  const [allSchools, setAllSchools] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // 🎓 Major suggestions
  const [allMajors] = useState([
    'Computer Science',
    'Economics',
    'Engineering',
    'Biology',
    'Business',
    'Marketing',
    'Film',
    'Finance'
  ]);
  const [majorSuggestions, setMajorSuggestions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/schools')
      .then(res => res.json())
      .then(data => setAllSchools(data));
  }, []);

  const handleMatch = async () => {
    setSchool(null);
    const res = await fetch(`http://localhost:5000/api/match?utr=${utr}&rate=${rate}&major=${major}`);
    const data = await res.json();
    setResults(data);
  };

  const handleReset = () => {
    setUTR('');
    setRate('');
    setMajor('');
    setSearch('');
    setResults([]);
    setSchool(null);
    setSuggestions([]);
    setMajorSuggestions([]);
    setError('');
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    const matches = allSchools.filter(s =>
      s.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(matches.slice(0, 5));
  };

  const searchBySlug = async (slug) => {
    const res = await fetch(`http://localhost:5000/api/school/${slug}`);
    if (res.ok) {
      const data = await res.json();
      setSchool(data);
      setResults([]);
      setError('');
    } else {
      setSchool(null);
      setResults([]);
      setError('School not found.');
    }
  };

  return (
    <div className="container">
      <h1>🎾 College Tennis Matcher</h1>

      <div className="card">
        <h2>🔍 Search for a School</h2>
        <input
          placeholder="Enter school name (e.g. UCLA)"
          value={search}
          onChange={handleSearchChange}
        />
        <button onClick={() => searchBySlug(search.toLowerCase().replace(/\s+/g, '-'))}>
          Search
        </button>

        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => {
                  setSearch(s.name);
                  setSuggestions([]);
                  searchBySlug(s.slug);
                }}
              >
                {s.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      {school && (
        <div className="card">
          <h2>{school.schoolName}</h2>
          <p><strong>UTR Range:</strong> {school.teamUTRRange.min} – {school.teamUTRRange.max}</p>
          <p><strong>Acceptance Rate:</strong> {school.acceptanceRate}%</p>
          <p><strong>Top Majors:</strong> {school.topMajors.join(', ')}</p>
        </div>
      )}

      <div className="card">
        <h2>🎯 Match Me to Schools</h2>
        <input
          placeholder="Your UTR"
          value={utr}
          onChange={e => setUTR(e.target.value)}
        />
        <input
          placeholder="Max Acceptance Rate (%)"
          value={rate}
          onChange={e => setRate(e.target.value)}
        />
        <input
          placeholder="Preferred Major"
          value={major}
          onChange={(e) => {
            const value = e.target.value;
            setMajor(value);
            const matches = allMajors.filter(m =>
              m.toLowerCase().includes(value.toLowerCase())
            );
            setMajorSuggestions(matches.slice(0, 5));
          }}
        />
        {majorSuggestions.length > 0 && (
          <ul className="suggestions">
            {majorSuggestions.map((m, i) => (
              <li
                key={i}
                onClick={() => {
                  setMajor(m);
                  setMajorSuggestions([]);
                }}
              >
                {m}
              </li>
            ))}
          </ul>
        )}

        <button onClick={handleMatch}>Find Matches</button>
        <button className="reset-button" onClick={handleReset}>
  ♻️ Reset All
</button>
      </div>

      {results.length > 0 && (
        <div className="card">
          <h2>🎓 Matched Schools</h2>
          <ul>
            {results.map(s => (
              <li key={s.slug}>
                <strong>{s.schoolName}</strong> — UTR {s.teamUTRRange.min}–{s.teamUTRRange.max}, Acceptance: {s.acceptanceRate}%
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.length === 0 && utr && rate && major && (
        <p className="error">No schools match your criteria.</p>
      )}
    </div>
  );
}

export default App;
