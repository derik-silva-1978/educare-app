const vimeoService = require('../services/vimeoService');
const { ContentVideo } = require('../models');

const checkStatus = async (req, res) => {
  try {
    const configured = vimeoService.isConfigured();
    
    return res.json({
      success: true,
      data: {
        configured,
        message: configured 
          ? 'Vimeo API is configured and ready'
          : 'Vimeo API is not configured. Please set VIMEO_ACCESS_TOKEN.'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getVideoInfo = async (req, res) => {
  try {
    const { videoId } = req.params;
    
    const videoInfo = await vimeoService.getVideoInfo(videoId);
    
    return res.json({
      success: true,
      data: videoInfo
    });
  } catch (error) {
    console.error('Error getting video info:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const generateEmbed = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { responsive = true, autoplay = false } = req.query;
    
    const embedCode = vimeoService.generateEmbedCode(videoId, {
      responsive: responsive === 'true' || responsive === true,
      autoplay: autoplay === 'true' || autoplay === true
    });
    
    return res.json({
      success: true,
      data: { embedCode }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const syncVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { contentId } = req.body;
    
    const result = await vimeoService.syncVideoToDatabase(videoId, contentId);
    
    return res.json({
      success: true,
      message: result.created ? 'Video synced successfully' : 'Video updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error syncing video:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const listVideos = async (req, res) => {
  try {
    const { page = 1, perPage = 25 } = req.query;
    
    const result = await vimeoService.listVideos(parseInt(page), parseInt(perPage));
    
    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error listing videos:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const searchVideos = async (req, res) => {
  try {
    const { query, page = 1, perPage = 25 } = req.query;
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query parameter is required' });
    }
    
    const result = await vimeoService.searchVideos(query, parseInt(page), parseInt(perPage));
    
    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error searching videos:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getSyncedVideos = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await ContentVideo.findAndCountAll({
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    return res.json({
      success: true,
      data: {
        videos: rows.map(v => ({
          id: v.id,
          vimeoVideoId: v.vimeo_video_id,
          thumbnailUrl: v.thumbnail_url,
          durationSeconds: v.duration_seconds,
          contentId: v.content_id,
          createdAt: v.created_at
        })),
        pagination: {
          total: count,
          page: parseInt(page),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting synced videos:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  checkStatus,
  getVideoInfo,
  generateEmbed,
  syncVideo,
  listVideos,
  searchVideos,
  getSyncedVideos
};
