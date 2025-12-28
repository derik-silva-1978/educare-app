const { ContentVideo } = require('../models');

class VimeoService {
  constructor() {
    this.accessToken = process.env.VIMEO_ACCESS_TOKEN;
    this.baseUrl = 'https://api.vimeo.com';
  }

  isConfigured() {
    return !!this.accessToken;
  }

  async makeRequest(endpoint, method = 'GET', body = null) {
    if (!this.isConfigured()) {
      throw new Error('Vimeo API not configured. Please set VIMEO_ACCESS_TOKEN.');
    }

    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.vimeo.*+json;version=3.4'
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, options);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.developer_message || error.error || 'Vimeo API error');
    }

    return response.json();
  }

  async getVideoInfo(vimeoVideoId) {
    const data = await this.makeRequest(`/videos/${vimeoVideoId}`);
    
    return {
      id: vimeoVideoId,
      name: data.name,
      description: data.description,
      duration: data.duration,
      thumbnailUrl: data.pictures?.sizes?.[3]?.link || data.pictures?.base_link,
      embedHtml: data.embed?.html,
      playerUrl: data.player_embed_url,
      status: data.status,
      width: data.width,
      height: data.height
    };
  }

  generateEmbedCode(vimeoVideoId, options = {}) {
    const {
      width = 640,
      height = 360,
      autoplay = false,
      loop = false,
      title = false,
      byline = false,
      portrait = false,
      responsive = true
    } = options;

    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      loop: loop ? '1' : '0',
      title: title ? '1' : '0',
      byline: byline ? '1' : '0',
      portrait: portrait ? '1' : '0'
    });

    const iframeStyle = responsive 
      ? 'position:absolute;top:0;left:0;width:100%;height:100%;'
      : `width:${width}px;height:${height}px;`;

    const wrapperStyle = responsive
      ? 'position:relative;padding-bottom:56.25%;height:0;overflow:hidden;'
      : '';

    const iframe = `<iframe src="https://player.vimeo.com/video/${vimeoVideoId}?${params}" style="${iframeStyle}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;

    return responsive
      ? `<div style="${wrapperStyle}">${iframe}</div>`
      : iframe;
  }

  async syncVideoToDatabase(vimeoVideoId, contentId = null) {
    const videoInfo = await this.getVideoInfo(vimeoVideoId);
    
    const embedCode = this.generateEmbedCode(vimeoVideoId, { responsive: true });

    const [video, created] = await ContentVideo.upsert({
      vimeo_video_id: vimeoVideoId,
      content_id: contentId,
      vimeo_embed_code: embedCode,
      thumbnail_url: videoInfo.thumbnailUrl,
      duration_seconds: videoInfo.duration
    }, {
      returning: true
    });

    return {
      id: video.id,
      vimeoVideoId: video.vimeo_video_id,
      thumbnailUrl: video.thumbnail_url,
      durationSeconds: video.duration_seconds,
      embedCode: video.vimeo_embed_code,
      created
    };
  }

  async listVideos(page = 1, perPage = 25) {
    const data = await this.makeRequest(`/me/videos?page=${page}&per_page=${perPage}`);
    
    return {
      total: data.total,
      page: data.page,
      perPage: data.per_page,
      videos: data.data.map(v => ({
        id: v.uri.split('/').pop(),
        name: v.name,
        description: v.description,
        duration: v.duration,
        thumbnailUrl: v.pictures?.sizes?.[2]?.link,
        status: v.status,
        createdAt: v.created_time
      }))
    };
  }

  async searchVideos(query, page = 1, perPage = 25) {
    const data = await this.makeRequest(`/me/videos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`);
    
    return {
      total: data.total,
      page: data.page,
      perPage: data.per_page,
      videos: data.data.map(v => ({
        id: v.uri.split('/').pop(),
        name: v.name,
        description: v.description,
        duration: v.duration,
        thumbnailUrl: v.pictures?.sizes?.[2]?.link,
        status: v.status
      }))
    };
  }
}

module.exports = new VimeoService();
