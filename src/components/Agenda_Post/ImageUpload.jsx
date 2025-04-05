import React from 'react';

const ImageUploadField = ({ formData, setFormData, errors }) => {
  // Função para lidar com a alteração do tipo de imagem
  const handleTipoImagemChange = (tipo) => {
    setFormData(prev => ({
      ...prev,
      tipoImagem: tipo,
      // Limpar o campo de imagem ao trocar o tipo
      imagem: tipo === 'upload' ? prev.imagem : '',
      imagemNome: tipo === 'upload' ? prev.imagemNome : ''
    }));
  };

  // Função para lidar com o upload de arquivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imagem: reader.result,
          imagemNome: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">Imagem</label>
      
      <div className="image-type-selector" style={{ marginBottom: '1rem' }}>
        <label className="radio-label" style={{ marginRight: '1rem' }}>
          <input
            type="radio"
            name="tipoImagem"
            checked={formData.tipoImagem === 'url'}
            onChange={() => handleTipoImagemChange('url')}
            style={{ marginRight: '0.5rem' }}
          />
          URL da Imagem
        </label>
        
        <label className="radio-label">
          <input
            type="radio"
            name="tipoImagem"
            checked={formData.tipoImagem === 'upload'}
            onChange={() => handleTipoImagemChange('upload')}
            style={{ marginRight: '0.5rem' }}
          />
          Upload de Arquivo
        </label>
      </div>
      
      {formData.tipoImagem === 'url' ? (
        <div className="url-input">
          <input
            type="text"
            id="imagem"
            name="imagem"
            value={formData.imagem}
            onChange={(e) => setFormData(prev => ({ ...prev, imagem: e.target.value }))}
            placeholder="https://exemplo.com/imagem.jpg"
            className={`form-input ${errors.imagem ? 'input-error' : ''}`}
          />
        </div>
      ) : (
        <div className="file-upload">
          <input
            type="file"
            id="imagemUpload"
            accept="image/*"
            onChange={handleFileChange}
            className={`form-input ${errors.imagem ? 'input-error' : ''}`}
          />
          {formData.imagemNome && (
            <div className="file-name" style={{ marginTop: '0.5rem' }}>
              Arquivo selecionado: {formData.imagemNome}
            </div>
          )}
          {formData.imagem && formData.imagem.startsWith('data:image') && (
            <div className="image-preview" style={{ marginTop: '1rem' }}>
              <img 
                src={formData.imagem} 
                alt="Preview" 
                style={{ maxWidth: '200px', maxHeight: '200px' }} 
              />
            </div>
          )}
        </div>
      )}
      
      {errors.imagem && <div className="error-message">{errors.imagem}</div>}
    </div>
  );
};

export default ImageUploadField;