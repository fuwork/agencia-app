import React, { useState } from 'react';

const PostPreview = ({ formData, carouselImages, clientes }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0); 
  const clienteNome = formData.cliente_id ? 
    clientes.find(c => c.id === formData.cliente_id)?.nome || 'Cliente' : 'Cliente';

  // Função para ir para a próxima imagem no carrossel
  const nextImage = () => {
    if (carouselImages && carouselImages.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  // Função para ir para a imagem anterior no carrossel
  const prevImage = () => {
    if (carouselImages && carouselImages.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
      );
    }
  };

  // Verificar se temos imagens de carrossel disponíveis
  const hasCarouselImages = carouselImages && carouselImages.length > 0;
  
  const getCurrentImageUrl = () => {
    if (formData.tipoConteudo === 'Carrossel' && hasCarouselImages) {
      const currentImage = carouselImages[currentImageIndex];
      return currentImage.file instanceof File 
        ? URL.createObjectURL(currentImage.file) 
        : currentImage.file;
    } else if (formData.imagem) {
      return formData.imagem instanceof File 
        ? URL.createObjectURL(formData.imagem) 
        : formData.imagem;
    }
    return null;
  };

  const imageUrl = getCurrentImageUrl();

  return (
    <div className="preview-container">
      <h3 className="preview-title">Preview do Post</h3>
      
      <div className="preview-post-card">
        <div className="preview-header">
          <div className="preview-avatar"></div>
          <div className="preview-account-info">
            <p className="preview-account-name">{clienteNome}</p>
            <p className="preview-platform">{formData.plataforma}</p>
          </div>
        </div>
        
        <div className="preview-image-container">
          {imageUrl ? (
            <div className="preview-image-wrapper">
              <img 
                src={imageUrl} 
                alt={formData.tipoConteudo === 'Carrossel' ? `Imagem ${currentImageIndex + 1}` : "Imagem do post"} 
                className="preview-image" 
              />
              
              {formData.tipoConteudo === 'Carrossel' && hasCarouselImages && (
                <>
                  <div className="preview-carousel-controls">
                    <button 
                      onClick={prevImage} 
                      className="carousel-control prev"
                      aria-label="Imagem anterior"
                    >
                      &lt;
                    </button>
                    <div className="preview-carousel-indicator">
                      {currentImageIndex + 1}/{carouselImages.length}
                    </div>
                    <button 
                      onClick={nextImage} 
                      className="carousel-control next"
                      aria-label="Próxima imagem"
                    >
                      &gt;
                    </button>
                  </div>
                  
                  <div className="carousel-dots">
                    {carouselImages.map((_, index) => (
                      <span 
                        key={index} 
                        className={`carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="preview-no-image">Imagem não disponível</div>
          )}
        </div>
        
        <div className="preview-content">
          <p className="preview-description">{formData.descricao || 'Sem descrição'}</p>
          <p className="preview-hashtags">{formData.hashtags || 'Sem hashtags'}</p>
        </div>
        
        <div className="preview-footer">
          <p className="preview-publication-date">
            Programado para: {formData.data_publicacao} às {formData.hora_publicacao}
          </p>
        </div>
      </div>
      
      <style jsx>{`
        .preview-container {
          max-width: 500px;
          margin: 0 auto;
        }
        
        .preview-title {
          text-align: center;
          margin-bottom: 15px;
        }
        
        .preview-post-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          background-color: white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .preview-header {
          padding: 12px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #eee;
        }
        
        .preview-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #e1e1e1;
          margin-right: 10px;
        }
        
        .preview-account-name {
          font-weight: bold;
          margin: 0;
        }
        
        .preview-platform {
          color: #666;
          font-size: 0.9em;
          margin: 0;
        }
        
        .preview-image-container {
          position: relative;
          width: 100%;
          padding-top: 100%; /* 1:1 Aspect Ratio */
          background-color: #f8f8f8;
          overflow: hidden;
        }
        
        .preview-image-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .preview-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        
        .preview-no-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #999;
        }
        
        .preview-content {
          padding: 15px;
        }
        
        .preview-description {
          margin-top: 0;
          margin-bottom: 10px;
        }
        
        .preview-hashtags {
          color: #0095f6;
          margin: 0;
        }
        
        .preview-footer {
          padding: 10px 15px;
          border-top: 1px solid #eee;
          color: #666;
          font-size: 0.9em;
        }
        
        .preview-carousel-controls {
          position: absolute;
          bottom: px;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 10px;
        }
        
        .carousel-control {
          background-color: rgba(255, 255, 255, 0.8);
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .preview-carousel-indicator {
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 0.8em;
          position: absolute;
          top: 230px;
          right: 10px;
        }
        
        .carousel-dots {
          position: absolute;
          bottom: 15px;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: center;
          gap: 5px;
        }
        
        .carousel-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
        }
        
        .carousel-dot.active {
          background-color: white;
          box-shadow: 0 0 2px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
};

export default PostPreview;