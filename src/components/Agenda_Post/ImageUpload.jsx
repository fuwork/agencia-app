import React, { useState } from 'react';

const ImageUploadField = ({ formData, setFormData, errors }) => {
  // Estado para armazenar múltiplas imagens quando for carrossel
  const [carouselImages, setCarouselImages] = useState([]);

  // Função para lidar com a alteração do tipo de conteúdo
  const handleTipoConteudoChange = (e) => {
    const tipoConteudo = e.target.value;
    setFormData(prev => ({
      ...prev,
      tipoConteudo,
      imagem: '',
      imagemNome: ''
    }));
    
    // Limpar o carrossel quando mudar de tipo
    if (tipoConteudo !== 'Carrossel') {
      setCarouselImages([]);
    }
  };

  // Função para lidar com a alteração do tipo de imagem
  const handleTipoImagemChange = (tipo) => {
    setFormData(prev => ({
      ...prev,
      tipoImagem: tipo,
      imagem: tipo === 'upload' ? prev.imagem : '',
      imagemNome: tipo === 'upload' ? prev.imagemNome : ''
    }));
  };

  // Função para lidar com o upload de arquivo único
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

  // Função para lidar com o upload de múltiplos arquivos para o carrossel
  const handleMultipleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      const newImages = [];
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push({
            url: reader.result,
            name: file.name
          });
          
          // Quando todas as imagens forem processadas, atualize o estado
          if (newImages.length === files.length) {
            setCarouselImages(prevImages => [...prevImages, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Função para remover uma imagem do carrossel
  const removeCarouselImage = (index) => {
    setCarouselImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="form-group">
      <label className="form-label">Tipo de Conteúdo</label>
      <select 
        className="form-select"
        value={formData.tipoConteudo || ''}
        onChange={handleTipoConteudoChange}
      >
        <option value="">Selecione o tipo</option>
        <option value="umaImagem">Uma imagem</option>
        <option value="Carrossel">Carrossel</option>
        <option value="Story">Story</option>
      </select>
      
      {formData.tipoConteudo && (
        <div className="mt-4">
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
          
          {formData.tipoConteudo === 'Carrossel' ? (
            // Interface para carrossel (múltiplas imagens)
            <div className="carrossel-upload">
              {formData.tipoImagem === 'url' ? (
                <div className="url-input">
                  <input
                    type="text"
                    placeholder="https://exemplo.com/imagem.jpg"
                    className={`form-input ${errors.imagem ? 'input-error' : ''}`}
                    value={formData.tempUrl || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, tempUrl: e.target.value }))}
                  />
                  <button 
                    type="button" 
                    className="btn btn-primary mt-2"
                    onClick={() => {
                      if (formData.tempUrl) {
                        setCarouselImages(prev => [...prev, { url: formData.tempUrl, name: 'URL Image' }]);
                        setFormData(prev => ({ ...prev, tempUrl: '' }));
                      }
                    }}
                  >
                    Adicionar URL
                  </button>
                </div>
              ) : (
                <div className="file-upload">
                  <input
                    type="file"
                    id="imagemUpload"
                    accept="image/*"
                    multiple
                    onChange={handleMultipleFileChange}
                    className={`form-input ${errors.imagem ? 'input-error' : ''}`}
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    Você pode selecionar múltiplas imagens para o carrossel
                  </div>
                </div>
              )}
              
              {/* Visualização das imagens do carrossel */}
              {carouselImages.length > 0 && (
                <div className="carousel-images mt-4">
                  <h4>Imagens do Carrossel ({carouselImages.length})</h4>
                  <div className="image-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {carouselImages.map((img, index) => (
                      <div key={index} className="image-item" style={{ position: 'relative', width: '150px' }}>
                        <img 
                          src={img.url} 
                          alt={`Carrossel ${index + 1}`} 
                          style={{ width: '100%', height: '120px', objectFit: 'cover' }} 
                        />
                        <div style={{ fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {img.name}
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeCarouselImage(index)}
                          style={{ 
                            position: 'absolute', 
                            top: '5px', 
                            right: '5px', 
                            background: 'rgba(255,0,0,0.7)', 
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Interface para uma única imagem (Uma imagem ou Story)
            <>
              {formData.tipoImagem === 'url' ? (
                <div className="url-input">
                  <input
                    type="text"
                    id="imagem"
                    name="imagem"
                    value={formData.imagem || ''}
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
            </>
          )}
          
          {errors.imagem && <div className="error-message">{errors.imagem}</div>}
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;