const {
  ContentItem,
  ContentVideo,
  TrainingModule,
  TrainingLesson,
  UserContentProgress,
  ContentPricing,
  UserEnrollment,
  User,
  Profile
} = require('../models');
const { Op } = require('sequelize');
const { stripeService } = require('../services/stripeService');

const listTrainings = async (req, res) => {
  try {
    const { audience = 'all', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const userRole = req.user?.role;

    const where = {
      type: 'training'
    };

    // Only published for non-authenticated users; include draft for owner/admin
    if (userRole === 'owner' || userRole === 'admin') {
      where.status = { [Op.in]: ['published', 'draft'] };
    } else {
      where.status = 'published';
    }

    if (audience !== 'all') {
      where.target_audience = { [Op.or]: [audience, 'all'] };
    }

    const { count, rows } = await ContentItem.findAndCountAll({
      where,
      include: [
        { model: ContentPricing, as: 'pricing' },
        { model: TrainingModule, as: 'modules', attributes: ['id'] }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    const trainings = rows.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description,
      thumbnailUrl: t.thumbnail_url,
      audience: t.target_audience,
      status: t.status,
      modulesCount: t.modules?.length || 0,
      pricing: t.pricing ? {
        price: t.pricing.price_brl,
        discountPrice: t.pricing.discount_price_brl,
        isFree: t.pricing.is_free
      } : null,
      createdAt: t.created_at
    }));

    return res.json({
      success: true,
      data: trainings,
      pagination: {
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error listing trainings:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getTrainingDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const training = await ContentItem.findOne({
      where: { id, type: 'training' },
      include: [
        { model: ContentPricing, as: 'pricing' },
        {
          model: TrainingModule,
          as: 'modules',
          include: [{
            model: TrainingLesson,
            as: 'lessons',
            include: [{ model: ContentVideo, as: 'video' }],
            order: [['order_index', 'ASC']]
          }],
          order: [['order_index', 'ASC']]
        }
      ]
    });

    if (!training) {
      return res.status(404).json({ success: false, error: 'Treinamento não encontrado' });
    }

    let enrollment = null;
    let progress = [];
    
    if (userId) {
      enrollment = await UserEnrollment.findOne({
        where: { user_id: userId, content_id: id }
      });

      if (enrollment) {
        progress = await UserContentProgress.findAll({
          where: { user_id: userId, content_id: id }
        });
      }
    }

    const isEnrolled = !!enrollment;
    const isFree = training.pricing?.is_free || !training.pricing;

    const modules = training.modules.map(m => ({
      id: m.id,
      title: m.title,
      description: m.description,
      orderIndex: m.order_index,
      durationMinutes: m.duration_minutes,
      isPreview: m.is_preview,
      lessons: m.lessons.map(l => {
        const lessonProgress = progress.find(p => p.lesson_id === l.id);
        const canAccess = isEnrolled || isFree || l.is_preview;
        
        return {
          id: l.id,
          title: l.title,
          contentType: l.content_type,
          durationMinutes: l.duration_minutes,
          isPreview: l.is_preview,
          canAccess,
          progress: lessonProgress ? {
            percent: lessonProgress.progress_percent,
            completed: !!lessonProgress.completed_at
          } : null,
          video: canAccess && l.video ? {
            thumbnailUrl: l.video.thumbnail_url,
            durationSeconds: l.video.duration_seconds
          } : null
        };
      })
    }));

    const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const completedLessons = progress.filter(p => p.completed_at).length;

    return res.json({
      success: true,
      data: {
        id: training.id,
        title: training.title,
        description: training.description,
        thumbnailUrl: training.thumbnail_url,
        audience: training.target_audience,
        isEnrolled,
        pricing: training.pricing ? {
          price: training.pricing.price_brl,
          discountPrice: training.pricing.discount_price_brl,
          isFree: training.pricing.is_free,
          stripePriceId: training.pricing.stripe_price_id
        } : { isFree: true },
        progress: isEnrolled ? {
          completedLessons,
          totalLessons,
          percent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
        } : null,
        modules
      }
    });
  } catch (error) {
    console.error('Error getting training details:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getLessonContent = async (req, res) => {
  try {
    const { trainingId, lessonId } = req.params;
    const userId = req.user.id;

    const lesson = await TrainingLesson.findOne({
      where: { id: lessonId },
      include: [
        { model: ContentVideo, as: 'video' },
        {
          model: TrainingModule,
          as: 'module',
          where: { training_id: trainingId }
        }
      ]
    });

    if (!lesson) {
      return res.status(404).json({ success: false, error: 'Aula não encontrada' });
    }

    const training = await ContentItem.findByPk(trainingId, {
      include: [{ model: ContentPricing, as: 'pricing' }]
    });

    const isFree = training.pricing?.is_free || !training.pricing;
    
    if (!lesson.is_preview && !isFree) {
      const enrollment = await UserEnrollment.findOne({
        where: { user_id: userId, content_id: trainingId, status: 'active' }
      });

      if (!enrollment) {
        return res.status(403).json({ 
          success: false, 
          error: 'Você precisa estar matriculado para acessar esta aula',
          requiresEnrollment: true
        });
      }
    }

    await UserContentProgress.upsert({
      user_id: userId,
      content_id: trainingId,
      lesson_id: lessonId,
      last_accessed_at: new Date()
    }, {
      conflictFields: ['user_id', 'content_id', 'lesson_id']
    });

    return res.json({
      success: true,
      data: {
        id: lesson.id,
        title: lesson.title,
        contentType: lesson.content_type,
        durationMinutes: lesson.duration_minutes,
        contentData: lesson.content_data,
        video: lesson.video ? {
          embedCode: lesson.video.vimeo_embed_code,
          thumbnailUrl: lesson.video.thumbnail_url,
          durationSeconds: lesson.video.duration_seconds,
          transcription: lesson.video.transcription
        } : null
      }
    });
  } catch (error) {
    console.error('Error getting lesson content:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const updateLessonProgress = async (req, res) => {
  try {
    const { trainingId, lessonId } = req.params;
    const { progressPercent, watchedSeconds, completed } = req.body;
    const userId = req.user.id;

    const [progress, created] = await UserContentProgress.upsert({
      user_id: userId,
      content_id: trainingId,
      lesson_id: lessonId,
      progress_percent: progressPercent,
      watched_duration_seconds: watchedSeconds,
      completed_at: completed ? new Date() : null,
      last_accessed_at: new Date()
    }, {
      returning: true
    });

    return res.json({
      success: true,
      data: {
        progressPercent: progress.progress_percent,
        watchedSeconds: progress.watched_duration_seconds,
        completed: !!progress.completed_at
      }
    });
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const enrollUser = async (req, res) => {
  try {
    const { trainingId } = req.params;
    const userId = req.user.id;

    const training = await ContentItem.findOne({
      where: { id: trainingId, type: 'training' },
      include: [{ model: ContentPricing, as: 'pricing' }]
    });

    if (!training) {
      return res.status(404).json({ success: false, error: 'Treinamento não encontrado' });
    }

    const existingEnrollment = await UserEnrollment.findOne({
      where: { user_id: userId, content_id: trainingId }
    });

    if (existingEnrollment) {
      return res.json({
        success: true,
        message: 'Já matriculado neste treinamento',
        data: { enrollmentId: existingEnrollment.id }
      });
    }

    const isFree = training.pricing?.is_free || !training.pricing;

    if (!isFree) {
      return res.status(400).json({
        success: false,
        error: 'Este treinamento requer pagamento',
        requiresPayment: true,
        stripePriceId: training.pricing?.stripe_price_id
      });
    }

    const enrollment = await UserEnrollment.create({
      user_id: userId,
      content_id: trainingId,
      status: 'active',
      enrolled_at: new Date()
    });

    return res.status(201).json({
      success: true,
      message: 'Matrícula realizada com sucesso',
      data: { enrollmentId: enrollment.id }
    });
  } catch (error) {
    console.error('Error enrolling user:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getUserEnrollments = async (req, res) => {
  try {
    const userId = req.user.id;

    const enrollments = await UserEnrollment.findAll({
      where: { user_id: userId, status: 'active' },
      include: [{
        model: ContentItem,
        as: 'content',
        include: [{ model: ContentPricing, as: 'pricing' }]
      }],
      order: [['enrolled_at', 'DESC']]
    });

    const progress = await UserContentProgress.findAll({
      where: { user_id: userId }
    });

    const data = enrollments.map(e => {
      const contentProgress = progress.filter(p => p.content_id === e.content_id);
      const completedLessons = contentProgress.filter(p => p.completed_at).length;
      
      return {
        id: e.id,
        trainingId: e.content_id,
        title: e.content.title,
        thumbnailUrl: e.content.thumbnail_url,
        enrolledAt: e.enrolled_at,
        progress: {
          completedLessons,
          percent: contentProgress.length > 0 
            ? Math.round((completedLessons / contentProgress.length) * 100) 
            : 0
        }
      };
    });

    return res.json({ success: true, data });
  } catch (error) {
    console.error('Error getting user enrollments:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const createTraining = async (req, res) => {
  try {
    const { title, description, thumbnailUrl, audience, pricing, modules } = req.body;

    const training = await ContentItem.create({
      type: 'training',
      title,
      description,
      thumbnail_url: thumbnailUrl,
      target_audience: audience || 'all',
      status: 'draft',
      created_by: req.user.id
    });

    if (pricing) {
      await ContentPricing.create({
        content_id: training.id,
        price_brl: pricing.price || 0,
        discount_price_brl: pricing.discountPrice,
        is_free: pricing.isFree || false
      });
    }

    if (modules && modules.length > 0) {
      for (let i = 0; i < modules.length; i++) {
        const moduleData = modules[i];
        const trainingModule = await TrainingModule.create({
          training_id: training.id,
          order_index: i,
          title: moduleData.title,
          description: moduleData.description,
          duration_minutes: moduleData.durationMinutes,
          is_preview: moduleData.isPreview || false
        });

        if (moduleData.lessons && moduleData.lessons.length > 0) {
          for (let j = 0; j < moduleData.lessons.length; j++) {
            const lessonData = moduleData.lessons[j];
            await TrainingLesson.create({
              module_id: trainingModule.id,
              order_index: j,
              title: lessonData.title,
              content_type: lessonData.contentType || 'video',
              video_id: lessonData.videoId,
              content_data: lessonData.contentData,
              duration_minutes: lessonData.durationMinutes,
              is_preview: lessonData.isPreview || false
            });
          }
        }
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Treinamento criado com sucesso',
      data: { id: training.id }
    });
  } catch (error) {
    console.error('Error creating training:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const updateTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, thumbnailUrl, audience, status, pricing } = req.body;

    const training = await ContentItem.findOne({
      where: { id, type: 'training' }
    });

    if (!training) {
      return res.status(404).json({ success: false, error: 'Treinamento não encontrado' });
    }

    await training.update({
      title: title || training.title,
      description: description || training.description,
      thumbnail_url: thumbnailUrl || training.thumbnail_url,
      target_audience: audience || training.target_audience,
      status: status || training.status
    });

    if (pricing) {
      await ContentPricing.upsert({
        content_id: id,
        price_brl: pricing.price,
        discount_price_brl: pricing.discountPrice,
        is_free: pricing.isFree
      });
    }

    return res.json({
      success: true,
      message: 'Treinamento atualizado com sucesso'
    });
  } catch (error) {
    console.error('Error updating training:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const deleteTraining = async (req, res) => {
  try {
    const { id } = req.params;

    const training = await ContentItem.findOne({
      where: { id, type: 'training' }
    });

    if (!training) {
      return res.status(404).json({ success: false, error: 'Treinamento não encontrado' });
    }

    await training.destroy();

    return res.json({
      success: true,
      message: 'Treinamento excluído com sucesso'
    });
  } catch (error) {
    console.error('Error deleting training:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const createCheckoutSession = async (req, res) => {
  try {
    const { trainingId } = req.params;
    const userId = req.user.id;
    const { successUrl, cancelUrl } = req.body;

    const training = await ContentItem.findOne({
      where: { id: trainingId, type: 'training' },
      include: [{ model: ContentPricing, as: 'pricing' }]
    });

    if (!training) {
      return res.status(404).json({ success: false, error: 'Treinamento não encontrado' });
    }

    if (!training.pricing?.stripe_price_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Treinamento não possui preço configurado no Stripe' 
      });
    }

    const existingEnrollment = await UserEnrollment.findOne({
      where: { user_id: userId, content_id: trainingId, status: 'active' }
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        error: 'Você já está matriculado neste treinamento'
      });
    }

    const user = await User.findByPk(userId, {
      include: [{ model: Profile, as: 'profile' }]
    });

    const customer = await stripeService.getOrCreateCustomer(
      userId,
      user.email,
      user.profile?.fullName
    );

    const baseUrl = process.env.REPLIT_DOMAINS 
      ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
      : 'http://localhost:5000';

    const session = await stripeService.createOneTimeCheckoutSession(
      customer.id,
      training.pricing.stripe_price_id,
      successUrl || `${baseUrl}/educare-app/trainings/${trainingId}?payment=success`,
      cancelUrl || `${baseUrl}/educare-app/trainings/${trainingId}?payment=cancelled`,
      {
        userId,
        trainingId,
        type: 'training_purchase'
      }
    );

    return res.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url
      }
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const handlePaymentSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user.id;

    const session = await stripeService.getCheckoutSession(sessionId);

    if (!session || session.payment_status !== 'paid') {
      return res.status(400).json({ success: false, error: 'Pagamento não confirmado' });
    }

    const trainingId = session.metadata?.trainingId;

    if (!trainingId) {
      return res.status(400).json({ success: false, error: 'ID do treinamento não encontrado' });
    }

    const [enrollment, created] = await UserEnrollment.findOrCreate({
      where: { user_id: userId, content_id: trainingId },
      defaults: {
        status: 'active',
        enrolled_at: new Date(),
        stripe_checkout_session_id: sessionId,
        stripe_payment_intent_id: session.payment_intent,
        amount_paid_brl: session.amount_total ? session.amount_total / 100 : null
      }
    });

    if (!created) {
      await enrollment.update({
        status: 'active',
        stripe_checkout_session_id: sessionId,
        stripe_payment_intent_id: session.payment_intent
      });
    }

    return res.json({
      success: true,
      message: 'Matrícula confirmada com sucesso',
      data: { enrollmentId: enrollment.id }
    });
  } catch (error) {
    console.error('Error handling payment success:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  listTrainings,
  getTrainingDetails,
  getLessonContent,
  updateLessonProgress,
  enrollUser,
  getUserEnrollments,
  createTraining,
  updateTraining,
  deleteTraining,
  createCheckoutSession,
  handlePaymentSuccess
};
