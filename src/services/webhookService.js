import axios from "axios";

class WebhookService {
  constructor() {
    this.webhookUrl =
      "https://n8n.fuwork.com.br/webhook-test/e7f3081a-b31f-4009-aaf3-1afd0312967f";
    this.username = process.env.REACT_APP_WEBHOOK_USERNAME;
    this.password = process.env.REACT_APP_WEBHOOK_PASSWORD;
  }

  async sendPost(postData) {
    try {
      // Create Basic Auth credentials
      const auth = Buffer.from(`${this.username}:${this.password}`).toString(
        "base64"
      );

      // Determine if it's a carousel or single post
      const isCarousel =
        Array.isArray(postData.images) && postData.images.length > 1;

      let idCarrousel = null;
      if (isCarousel && postData.images) {
        const uniqueId = Math.random()
          .toString(36)
          .substring(2, 15)
          .toUpperCase();
        idCarrousel = uniqueId;
      } else {
        postData.tipoConteudo = "Single";
        postData.imagem = postData.images[0];
        postData.imagem_nome = postData.images[0].name;
      }

      // Prepare the payload
      const payload = {
        type: isCarousel ? "carousel" : "single",
        carousel_id: isCarousel ? idCarrousel : null,
        platform: postData.plataforma,
        scheduled_time: postData.data_publicacao,
        caption: this.formatCaption(postData.descricao, postData.hashtags),
        client_id: postData.cliente_id,
        status: postData.status || "agendado", // Definir status padrão
      };

      // Create FormData to handle binary files
      const formData = new FormData();

      if (isCarousel) {
        this.validateCarousel(postData.images); // Adicionar validação

        // Adicionar array carousel_items ao payload
        payload.carousel_items = postData.images.map((image, index) => ({
          // vamos alterar o fileName juntando o momento atual com o nome da imagem hhmmss
          fileName: `${Date.now()}_${image.name}`,
          order: index + 1, // Ordem começando em 1
        }));

        // Anexar imagens ao FormData
        postData.images.forEach((image, index) => {
          formData.append(`image_${index}`, image, image.name);
        });
      } else {
        if (!postData.imagem || !postData.imagem.name) {
          throw new Error("Imagem inválida para postagem simples");
        }
        // Anexar imagem única ao FormData
        // vamos alterar o fileName juntando o momento atual com o nome da imagem hhmmss
        const fileName = `${Date.now()}_${postData.imagem.name}`;
        postData.fileName = fileName;
        formData.append("image", postData.imagem, fileName);
      }

      // Adicionar o payload como string JSON
      formData.append("payload", JSON.stringify(payload));

      const response = await axios.post(this.webhookUrl, formData, {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Erro ao enviar post para o webhook"
        );
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao enviar post:", error);
      throw error;
    }
  }

  formatCaption(description, hashtags) {
    let caption = description || "";
    if (hashtags) {
      caption += "\n\n" + hashtags;
    }
    return caption.trim();
  }

  validateCarousel(images) {
    if (!Array.isArray(images)) {
      throw new Error("Imagens do carrossel devem ser um array");
    }
    if (images.length > 10) {
      throw new Error("Carrossel não pode ter mais de 10 imagens");
    }
    if (images.length === 0) {
      throw new Error("Carrossel deve ter pelo menos uma imagem");
    }
    for (const image of images) {
      if (image.size > 8 * 1024 * 1024) {
        throw new Error("Tamanho da imagem não pode ser maior que 8MB");
      }
    }
    return true;
  }
}

export const webhookService = new WebhookService();
