/**
 * Cloud Controller - Google Drive & OneDrive Integration
 * Handles file info retrieval and downloading from cloud providers
 */

const https = require('https');
const http = require('http');

/**
 * Extract file info from Google Drive public/shared link
 */
exports.getGoogleDriveFileInfo = async (req, res) => {
  try {
    const { fileId } = req.query;
    
    if (!fileId) {
      return res.status(400).json({
        success: false,
        error: 'fileId é obrigatório'
      });
    }

    // For public files, we can get metadata via the export link
    // Google Drive API v3 format for public files
    const metadataUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=name,size,mimeType&key=${process.env.GOOGLE_API_KEY || ''}`;
    
    // Try to fetch metadata (works for public files)
    // For private files, user would need OAuth - for now, we accept the URL directly
    try {
      const response = await fetch(metadataUrl);
      if (response.ok) {
        const data = await response.json();
        return res.json({
          success: true,
          name: data.name,
          size: parseInt(data.size) || 0,
          mimeType: data.mimeType,
          downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`
        });
      }
    } catch (fetchError) {
      console.log('Could not fetch Google Drive metadata, using fallback');
    }

    // Fallback: Accept the file ID and provide download URL
    // User will need to ensure file is publicly accessible
    return res.json({
      success: true,
      name: `google-drive-${fileId.substring(0, 8)}`,
      size: 0,
      mimeType: 'application/octet-stream',
      downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
      note: 'Certifique-se de que o arquivo está compartilhado publicamente'
    });

  } catch (error) {
    console.error('Error getting Google Drive file info:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter informações do arquivo do Google Drive'
    });
  }
};

/**
 * Download file from Google Drive and process it
 */
exports.downloadGoogleDriveFile = async (req, res) => {
  try {
    const { fileId, fileName } = req.body;
    
    if (!fileId) {
      return res.status(400).json({
        success: false,
        error: 'fileId é obrigatório'
      });
    }

    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    // Fetch the file content
    const response = await fetch(downloadUrl);
    
    if (!response.ok) {
      throw new Error('Não foi possível baixar o arquivo. Verifique se está compartilhado.');
    }

    const buffer = await response.arrayBuffer();
    
    return res.json({
      success: true,
      fileName: fileName || `google-drive-${fileId.substring(0, 8)}`,
      size: buffer.byteLength,
      content: Buffer.from(buffer).toString('base64')
    });

  } catch (error) {
    console.error('Error downloading Google Drive file:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao baixar arquivo do Google Drive'
    });
  }
};

/**
 * Extract file info from OneDrive shared link
 */
exports.getOneDriveFileInfo = async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL é obrigatória'
      });
    }

    // OneDrive share links can be converted to direct download
    // Format: https://1drv.ms/x/s!XXXXX or https://onedrive.live.com/...
    
    let downloadUrl = url;
    
    // Convert share link to download link
    if (url.includes('1drv.ms') || url.includes('onedrive.live.com')) {
      // For OneDrive personal, we can try to convert the share link
      // The ?download=1 parameter forces download
      if (url.includes('?')) {
        downloadUrl = url + '&download=1';
      } else {
        downloadUrl = url + '?download=1';
      }
    }

    // Try to get file info by making a HEAD request
    try {
      const response = await fetch(downloadUrl, { method: 'HEAD' });
      const contentDisposition = response.headers.get('content-disposition');
      const contentLength = response.headers.get('content-length');
      
      let fileName = 'onedrive-file';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match) {
          fileName = match[1].replace(/['"]/g, '');
        }
      }

      return res.json({
        success: true,
        name: fileName,
        size: parseInt(contentLength) || 0,
        downloadUrl: downloadUrl
      });
    } catch (fetchError) {
      console.log('Could not fetch OneDrive metadata, using fallback');
    }

    // Fallback
    return res.json({
      success: true,
      name: 'onedrive-file',
      size: 0,
      downloadUrl: downloadUrl,
      note: 'Certifique-se de que o arquivo está compartilhado publicamente'
    });

  } catch (error) {
    console.error('Error getting OneDrive file info:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter informações do arquivo do OneDrive'
    });
  }
};

/**
 * Download file from OneDrive and process it
 */
exports.downloadOneDriveFile = async (req, res) => {
  try {
    const { url, fileName } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL é obrigatória'
      });
    }

    // Fetch the file content
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Não foi possível baixar o arquivo. Verifique se está compartilhado.');
    }

    const buffer = await response.arrayBuffer();
    
    return res.json({
      success: true,
      fileName: fileName || 'onedrive-file',
      size: buffer.byteLength,
      content: Buffer.from(buffer).toString('base64')
    });

  } catch (error) {
    console.error('Error downloading OneDrive file:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao baixar arquivo do OneDrive'
    });
  }
};
