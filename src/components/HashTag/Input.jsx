import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const HashtagInput = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const initialTags = value ? value.split(' ').filter(tag => tag.trim() !== '') : [];
    setTags(initialTags);
  }, [value]);

  const handleKeyDown = (e) => {
    if ((e.key === ' ' || e.key === '   ') && inputValue.trim() !== '') {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = (tag) => {
    const formatted = tag.startsWith('#') ? tag : `#${tag}`;
    if (!tags.includes(formatted)) {
      const newTags = [...tags, formatted];
      setTags(newTags);
      onChange({ target: { name: 'hashtags', value: newTags.join(' ') } });
    }
    setInputValue('');
  };

  const removeTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    onChange({ target: { name: 'hashtags', value: newTags.join(' ') } });
  };

  return (
    <div className="form-group">
      <label htmlFor="hashtags" className="form-label">Hashtags</label>
      <div className="hashtag-input-wrapper">
        <div className="hashtag-tags">
          {tags.map((tag, index) => (
            <span key={index} className="hashtag-tag">
              {tag}
              <button type="button" onClick={() => removeTag(index)} className="hashtag-remove">
                <X size={14} />
              </button>
            </span>
          ))}
          <input
            id="hashtags"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite e pressione espaço ou enter"
            className="hashtag-input"
          />
        </div>
      </div>
    </div>
  );
};

export default HashtagInput;
