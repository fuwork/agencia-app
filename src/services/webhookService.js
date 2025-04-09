import axios from 'axios';

class WebhookService {
  constructor() {
    this.webhookUrl = process.env.REACT_APP_WEBHOOK_URL || 'http://168.138.68.214:5678/webhook-test/158aa4b8-5f5f-4ed2-9e4a-3b6fd6c82a4f';
    this.username = process.env.REACT_APP_WEBHOOK_USERNAME;
    this.password = process.env.REACT_APP_WEBHOOK_PASSWORD;
  }

  async sendPost(postData) {
    try {

      // Create Basic Auth credentials
      const auth = Buffer.from(`${this.username}:${this.password}`).toString('base64');

      // Determine if it's a carousel or single post
      const isCarousel = Array.isArray(postData.images) && postData.images.length > 1;

      // Prepare the payload
      const payload = {
        type: isCarousel ? 'carousel' : 'single',
        platform: postData.plataforma,
        scheduled_time: postData.data_publicacao,
        caption: this.formatCaption(postData.descricao, postData.hashtags),
        client_id: postData.cliente_id,
        status: postData.status,
      };



      // Create FormData to handle binary files
      const formData = new FormData();
      formData.append('payload', JSON.stringify(payload));

      if (isCarousel) {
        if (!Array.isArray(postData.images) || postData.images.length === 0) {
          throw new Error('Images array is invalid or empty for carousel post');
        }

        console.log('[ postData.images ]', postData);
        postData.images.forEach((image) => {
          // const binaryFile = this.base64ToBlob(image.base64, image.type);
          formData.append('image', image, image.name);
        });
      } else {
        if (!postData.imagem) {
          throw new Error(`Image object is missing required properties (base64 , type  , or name)`);
        }
        // Convert base64 to binary file  
        // const binaryFile = this.base64ToBlob(postData.imagem.base64, postData.imagem.type);
        console.log('[ postData.imagem ]', postData.imagem);
        formData.append('image', postData.imagem, postData.imagem.name);
      }

      const response = await axios.post(this.webhookUrl, formData, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Erro ao enviar post para o webhook');
      }

      const result = response.data;

      return result;
    } catch (error) {
      console.error('Erro ao enviar post:', error);
      throw error;
    }
  }

  // base64ToBlob(base64, mimeType) {
  //   const byteCharacters = atob(base64);
  //   const byteNumbers = new Array(byteCharacters.length);
  //   for (let i = 0; i < byteCharacters.length; i++) {
  //     byteNumbers[i] = byteCharacters.charCodeAt(i);
  //   }
  //   const byteArray = new Uint8Array(byteNumbers);
  //   return new Blob([byteArray], { type: mimeType });
  // }

  formatCaption(description, hashtags) {
    let caption = description || '';
    if (hashtags) {
      caption += '\n\n' + hashtags;
    }
    return caption.trim();
  }

  validateCarousel(images) {
    if (!Array.isArray(images)) {
      throw new Error('Imagens do carrossel devem ser um array');
    }

    if (images.length > 10) {
      throw new Error('Carrossel não pode ter mais de 10 imagens');
    }

    if (images.length === 0) {
      throw new Error('Carrossel deve ter pelo menos uma imagem');
    }

    for (const image of images) {
      if (image.size > 8 * 1024 * 1024) {
        throw new Error('Tamanho da imagem não pode ser maior que 8MB');
      }
    }

    return true;
  }
}

export const webhookService = new WebhookService();
