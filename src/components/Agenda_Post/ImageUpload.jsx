import React, { useEffect } from 'react';

const ImageUploadField = ({ formData, setFormData, carouselImages, setCarouselImages, errors }) => {
  // Função para lidar com a alteração do tipo de conteúdo
  const handleTipoConteudoChange = (e) => {

    console.log('Event:', e);

    const tipoConteudo = e.target.value;
    
    setFormData(prev => ({
      ...prev,
      tipoConteudo,
      imagem: null,
      imagemNome: '',
      images: [],
    }));
    
        // Atualiza o estado formData com o tipo de conteúdo selecionado
        if (tipoConteudo !== 'Carrossel') {
          setCarouselImages([]);
        }
    
  };

  // Função para lidar com o upload de arquivo único
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imagem: file,
        imagemNome: file.name,
      }));
    }
  };

  // Função para lidar com o upload de múltiplos arquivos para o carrossel
  const handleMultipleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 10;
    
    if (files.length > maxFiles) {
      alert(`Você pode selecionar no máximo ${maxFiles} imagens para o carrossel.`);
      return;
    }
    
    if (files.length > 0) {
      const processImage = (file) => {
        return new Promise((resolve) => {
          const url = URL.createObjectURL(file); // URL temporária para preview
          resolve({
            file, // Arquivo binário
            url,  // URL para visualização
            name: file.name
          });
        });
      };

      Promise.all(files.map(processImage))
        .then(newImages => {
          const totalImages = [...carouselImages, ...newImages];
          if (totalImages.length > maxFiles) {
            alert(`O carrossel não pode ter mais que ${maxFiles} imagens no total.`);
            return;
          }
          // Atualiza o estado carouselImages com objetos completos (file, url, name)
          setCarouselImages(totalImages);
          // Garante que formData.images receba apenas os arquivos binários
          setFormData(prev => {
            const updatedFormData = {
            ...prev,
            images: totalImages.map(img => img.file),
          };
            // console.log('Updated formData:', updatedFormData);
            return updatedFormData;
          });
        });
    }
  };

  // Função para remover uma imagem do carrossel
  const removeCarouselImage = (index) => {
    setCarouselImages(prevImages => {
      const newImages = prevImages.filter((_, i) => i !== index);
      // Atualiza formData.images com os arquivos binários restantes
      setFormData(prev => ({
        ...prev,
        images: newImages.map(img => img.file),
      }));
      return newImages;
    });
  };

  // Cleanup das URLs temporárias ao desmontar o componente
  useEffect(() => {
    return () => {
      carouselImages.forEach(img => URL.revokeObjectURL(img.url));
    };
  }, [carouselImages]);

  return (
    <div className="form-group">
      <label className="form-label">Tipo de Conteúdo</label>
      <select 
        className="form-select"
        value={formData.tipoConteudo || ''}
        onChange={handleTipoConteudoChange}
      >
        <option value="">Oque deseja fazer?</option>
        <option value="Carrossel">Post</option>
        <option value="Story">Story</option>
      </select>
      
      {formData.tipoConteudo && (
        <div className="mt-4">
          <label className="form-label">Imagem</label>
          
          {formData.tipoConteudo === 'Carrossel' ? (
            <div className="carrossel-upload">
              <div className="file-upload">
                <input
                  type="file"
                  id="imagemUpload"
                  accept="image/jpeg"
                  multiple
                  onChange={handleMultipleFileChange}
                  className={`form-input ${errors.imagem ? 'input-error' : ''}`}
                />
                <div className="text-sm text-gray-500 mt-1">
                  Você pode selecionar múltiplas imagens para o carrossel (máximo 10)
                </div>
              </div>
              
              {carouselImages.length > 0 && (
                <div className="carousel-images mt-4">
                  {/* <h4>Imagens do Carrossel ({carouselImages.length})</h4> */}
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
              {formData.imagem && (
                <div className="image-preview" style={{ marginTop: '1rem' }}>
                  <img 
                    src={URL.createObjectURL(formData.imagem)} 
                    alt="Preview" 
                    style={{ maxWidth: '200px', maxHeight: '200px' }} 
                  />
                </div>
              )}
            </div>
          )}
          
          {errors.imagem && <div className="error-message">{errors.imagem}</div>}
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;