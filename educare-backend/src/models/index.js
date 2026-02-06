const { sequelize } = require('../config/database');

// Importação dos modelos
const User = require('./User');
const Profile = require('./Profile');
const Child = require('./Child');
const Team = require('./Team');
const TeamMember = require('./TeamMember');
const License = require('./License');
const SubscriptionPlan = require('./SubscriptionPlan');
const Subscription = require('./Subscription');
const Quiz = require('./Quiz');
const Question = require('./Question');
const QuizQuestion = require('./QuizQuestion');
const QuizSession = require('./QuizSession');
const Answer = require('./Answer');
const Achievement = require('./Achievement');
const UserAchievement = require('./UserAchievement');
const Journey = require('./Journey');
const UserJourney = require('./UserJourney');
const ChatGroup = require('./ChatGroup');
const ChatMessage = require('./ChatMessage');
const ChatInvite = require('./ChatInvite');
const JourneyBotSession = require('./JourneyBotSession');
const JourneyBotResponse = require('./JourneyBotResponse');
const JourneyBotQuestion = require('./JourneyBotQuestion');
const Activity = require('./Activity');
const ContentItem = require('./ContentItem');
const AppFaq = require('./AppFaq');
const FaqUserFeedback = require('./FaqUserFeedback');

// Modelos de Saúde (n8n v3.0)
const BiometricsLog = require('./BiometricsLog');
const SleepLog = require('./SleepLog');
const Appointment = require('./Appointment');
const VaccineHistory = require('./VaccineHistory');

// Modelos de Marcos do Desenvolvimento
const OfficialMilestone = require('./OfficialMilestone');
const MilestoneMapping = require('./MilestoneMapping');
const MilestoneCandidateScore = require('./MilestoneCandidateScore');

// Modelos de Relatórios de Desenvolvimento
const ChildDevelopmentReport = require('./ChildDevelopmentReport');

// Modelos de Treinamentos (FASE 2)
const ContentVideo = require('./ContentVideo');
const TrainingModule = require('./TrainingModule');
const TrainingLesson = require('./TrainingLesson');
const UserContentProgress = require('./UserContentProgress');
const ContentPricing = require('./ContentPricing');
const UserEnrollment = require('./UserEnrollment');

// Modelos do RAG
const KnowledgeDocument = require('./KnowledgeDocument');
const KbBaby = require('./KbBaby');
const KbMother = require('./KbMother');
const KbProfessional = require('./KbProfessional');

// Modelo de Prompts dos Assistentes
const AssistantPrompt = require('./AssistantPrompt');
const AssistantLLMConfig = require('./AssistantLLMConfig');

// Modelos de Saúde Materna
const MaternalHealthProfile = require('./MaternalHealthProfile');
const MaternalDailyHealth = require('./MaternalDailyHealth');
const MaternalMentalHealth = require('./MaternalMentalHealth');
const MaternalAppointment = require('./MaternalAppointment');

// Importação dos modelos da Jornada 2.0
const JourneyV2 = require('./JourneyV2');
const JourneyV2Week = require('./JourneyV2Week');
const JourneyV2Topic = require('./JourneyV2Topic');
const JourneyV2Quiz = require('./JourneyV2Quiz');
const JourneyV2Badge = require('./JourneyV2Badge');
const UserJourneyV2Progress = require('./UserJourneyV2Progress');
const UserJourneyV2Badge = require('./UserJourneyV2Badge');

// Modelos de Curadoria V2 e Mídia
const MaternalCurationMapping = require('./MaternalCurationMapping');
const JourneyV2Media = require('./JourneyV2Media');
const MediaResource = require('./MediaResource');

// Definição das associações

// User <-> Profile (1:1)
User.hasOne(Profile, { foreignKey: 'userId', as: 'profile' });
Profile.belongsTo(User, { foreignKey: 'userId' });

// Profile <-> Child (1:N)
Profile.hasMany(Child, { foreignKey: 'profileId', as: 'children' });
Child.belongsTo(Profile, { foreignKey: 'profileId' });

// User <-> Team (1:N) - Owner
User.hasMany(Team, { foreignKey: 'ownerId', as: 'ownedTeams' });
Team.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// Team <-> TeamMember (1:N)
Team.hasMany(TeamMember, { foreignKey: 'teamId', as: 'members' });
TeamMember.belongsTo(Team, { foreignKey: 'teamId', as: 'team' });

// User <-> TeamMember (1:N)
User.hasMany(TeamMember, { foreignKey: 'userId', as: 'teamMemberships' });
TeamMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> TeamMember (1:N) - Inviter
User.hasMany(TeamMember, { foreignKey: 'invitedBy', as: 'sentInvitations' });
TeamMember.belongsTo(User, { foreignKey: 'invitedBy', as: 'inviter' });

// User <-> License (1:N) - Owner
User.hasMany(License, { foreignKey: 'ownerId', as: 'ownedLicenses' });
License.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// License <-> Team (1:N)
License.hasMany(Team, { foreignKey: 'licenseId', as: 'teams' });
Team.belongsTo(License, { foreignKey: 'licenseId', as: 'license' });

// SubscriptionPlan <-> Subscription (1:N)
SubscriptionPlan.hasMany(Subscription, { foreignKey: 'planId', as: 'subscriptions' });
Subscription.belongsTo(SubscriptionPlan, { foreignKey: 'planId', as: 'plan' });

// User <-> Subscription (1:N)
User.hasMany(Subscription, { foreignKey: 'userId', as: 'subscriptions' });
Subscription.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Quiz <-> Question (N:M)
Quiz.belongsToMany(Question, { through: QuizQuestion, foreignKey: 'quizId', as: 'questions' });
Question.belongsToMany(Quiz, { through: QuizQuestion, foreignKey: 'questionId', as: 'quizzes' });

// Child <-> QuizSession (1:N)
Child.hasMany(QuizSession, { foreignKey: 'childId', as: 'quizSessions' });
QuizSession.belongsTo(Child, { foreignKey: 'childId', as: 'child' });

// QuizSession <-> Answer (1:N)
QuizSession.hasMany(Answer, { foreignKey: 'sessionId', as: 'sessionAnswers' });
Answer.belongsTo(QuizSession, { foreignKey: 'sessionId', as: 'session' });

// Question <-> Answer (1:N)
Question.hasMany(Answer, { foreignKey: 'questionId', as: 'answers' });
Answer.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });

// User <-> UserAchievement (1:N)
User.hasMany(UserAchievement, { foreignKey: 'userId', as: 'achievements' });
UserAchievement.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Child <-> UserAchievement (1:N)
Child.hasMany(UserAchievement, { foreignKey: 'childId', as: 'achievements' });
UserAchievement.belongsTo(Child, { foreignKey: 'childId', as: 'child' });

// Achievement <-> UserAchievement (1:N)
Achievement.hasMany(UserAchievement, { foreignKey: 'achievementId', as: 'userAchievements' });
UserAchievement.belongsTo(Achievement, { foreignKey: 'achievementId', as: 'achievement' });

// User <-> UserJourney (1:N)
User.hasMany(UserJourney, { foreignKey: 'userId', as: 'journeys' });
UserJourney.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Child <-> UserJourney (1:N)
Child.hasMany(UserJourney, { foreignKey: 'childId', as: 'journeys' });
UserJourney.belongsTo(Child, { foreignKey: 'childId', as: 'child' });

// Journey <-> UserJourney (1:N)
Journey.hasMany(UserJourney, { foreignKey: 'journeyId', as: 'userJourneys' });
UserJourney.belongsTo(Journey, { foreignKey: 'journeyId', as: 'journey' });

// User <-> Journey (1:N) - Creator
User.hasMany(Journey, { foreignKey: 'createdBy', as: 'createdJourneys' });
Journey.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// User <-> Quiz (1:N) - Creator
User.hasMany(Quiz, { foreignKey: 'createdBy', as: 'createdQuizzes' });
Quiz.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// === ASSOCIAÇÕES DE CHAT ===

// Team <-> ChatGroup (1:N)
Team.hasMany(ChatGroup, { foreignKey: 'team_id', as: 'chatGroups' });
ChatGroup.belongsTo(Team, { foreignKey: 'team_id', as: 'team' });

// Child <-> ChatGroup (1:N)
Child.hasMany(ChatGroup, { foreignKey: 'child_id', as: 'chatGroups' });
ChatGroup.belongsTo(Child, { foreignKey: 'child_id', as: 'child' });

// ChatGroup <-> ChatMessage (1:N)
ChatGroup.hasMany(ChatMessage, { foreignKey: 'chat_group_id', as: 'messages' });
ChatMessage.belongsTo(ChatGroup, { foreignKey: 'chat_group_id', as: 'chatGroup' });

// User <-> ChatMessage (1:N) - Sender
User.hasMany(ChatMessage, { foreignKey: 'sender_id', as: 'sentMessages' });
ChatMessage.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

// ChatMessage <-> ChatMessage (Self-referencing for replies)
ChatMessage.belongsTo(ChatMessage, { foreignKey: 'reply_to_id', as: 'replyTo' });
ChatMessage.hasMany(ChatMessage, { foreignKey: 'reply_to_id', as: 'replies' });

// User <-> JourneyBotSession (1:N)
User.hasMany(JourneyBotSession, { foreignKey: 'user_id', as: 'journeyBotSessions' });
JourneyBotSession.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Child <-> JourneyBotSession (1:N)
Child.hasMany(JourneyBotSession, { foreignKey: 'child_id', as: 'journeyBotSessions' });
JourneyBotSession.belongsTo(Child, { foreignKey: 'child_id', as: 'child' });

// User <-> JourneyBotResponse (1:N)
User.hasMany(JourneyBotResponse, { foreignKey: 'user_id', as: 'journeyBotResponses' });
JourneyBotResponse.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Child <-> JourneyBotResponse (1:N)
Child.hasMany(JourneyBotResponse, { foreignKey: 'child_id', as: 'journeyBotResponses' });
JourneyBotResponse.belongsTo(Child, { foreignKey: 'child_id', as: 'child' });

// JourneyBotResponse <-> JourneyBotQuestion (N:1) - Logical association only (no FK constraint due to type mismatch)
JourneyBotQuestion.hasMany(JourneyBotResponse, { foreignKey: 'question_id', as: 'responses', constraints: false });
JourneyBotResponse.belongsTo(JourneyBotQuestion, { foreignKey: 'question_id', as: 'question', constraints: false });

// ChatInvite associations
// Team <-> ChatInvite (1:N)
Team.hasMany(ChatInvite, { foreignKey: 'team_id', as: 'invites' });
ChatInvite.belongsTo(Team, { foreignKey: 'team_id', as: 'team' });

// User <-> ChatInvite (1:N) - invited user
User.hasMany(ChatInvite, { foreignKey: 'invited_user_id', as: 'receivedInvites' });
ChatInvite.belongsTo(User, { foreignKey: 'invited_user_id', as: 'invitedUser' });

// User <-> ChatInvite (1:N) - user who invited
User.hasMany(ChatInvite, { foreignKey: 'invited_by_id', as: 'sentInvites' });
ChatInvite.belongsTo(User, { foreignKey: 'invited_by_id', as: 'invitedBy' });

// === ASSOCIAÇÕES DA JORNADA 2.0 ===

// JourneyV2 <-> JourneyV2Week (1:N)
JourneyV2.hasMany(JourneyV2Week, { foreignKey: 'journey_id', as: 'weeks' });
JourneyV2Week.belongsTo(JourneyV2, { foreignKey: 'journey_id', as: 'journey' });

// JourneyV2Week <-> JourneyV2Topic (1:N)
JourneyV2Week.hasMany(JourneyV2Topic, { foreignKey: 'week_id', as: 'topics' });
JourneyV2Topic.belongsTo(JourneyV2Week, { foreignKey: 'week_id', as: 'week' });

// JourneyV2Week <-> JourneyV2Quiz (1:N)
JourneyV2Week.hasMany(JourneyV2Quiz, { foreignKey: 'week_id', as: 'quizzes' });
JourneyV2Quiz.belongsTo(JourneyV2Week, { foreignKey: 'week_id', as: 'week' });

// JourneyV2Week <-> JourneyV2Badge (1:N)
JourneyV2Week.hasMany(JourneyV2Badge, { foreignKey: 'week_id', as: 'badges' });
JourneyV2Badge.belongsTo(JourneyV2Week, { foreignKey: 'week_id', as: 'week' });

// User <-> UserJourneyV2Progress (1:N)
User.hasMany(UserJourneyV2Progress, { foreignKey: 'user_id', as: 'journeyV2Progress' });
UserJourneyV2Progress.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Child <-> UserJourneyV2Progress (1:N)
Child.hasMany(UserJourneyV2Progress, { foreignKey: 'child_id', as: 'journeyV2Progress' });
UserJourneyV2Progress.belongsTo(Child, { foreignKey: 'child_id', as: 'child' });

// JourneyV2 <-> UserJourneyV2Progress (1:N)
JourneyV2.hasMany(UserJourneyV2Progress, { foreignKey: 'journey_id', as: 'userProgress' });
UserJourneyV2Progress.belongsTo(JourneyV2, { foreignKey: 'journey_id', as: 'journey' });

// JourneyV2Week <-> UserJourneyV2Progress (1:N)
JourneyV2Week.hasMany(UserJourneyV2Progress, { foreignKey: 'week_id', as: 'userProgress' });
UserJourneyV2Progress.belongsTo(JourneyV2Week, { foreignKey: 'week_id', as: 'week' });

// User <-> UserJourneyV2Badge (1:N)
User.hasMany(UserJourneyV2Badge, { foreignKey: 'user_id', as: 'journeyV2Badges' });
UserJourneyV2Badge.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Child <-> UserJourneyV2Badge (1:N)
Child.hasMany(UserJourneyV2Badge, { foreignKey: 'child_id', as: 'journeyV2Badges' });
UserJourneyV2Badge.belongsTo(Child, { foreignKey: 'child_id', as: 'child' });

// JourneyV2Badge <-> UserJourneyV2Badge (1:N)
JourneyV2Badge.hasMany(UserJourneyV2Badge, { foreignKey: 'badge_id', as: 'userBadges' });
UserJourneyV2Badge.belongsTo(JourneyV2Badge, { foreignKey: 'badge_id', as: 'badge' });

// Associações ContentItem
User.hasMany(ContentItem, { foreignKey: 'created_by', as: 'createdContent' });
ContentItem.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.hasMany(ContentItem, { foreignKey: 'updated_by', as: 'updatedContent' });
ContentItem.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });

// === ASSOCIAÇÕES DE SAÚDE (n8n v3.0) ===

// Child <-> BiometricsLog (1:N)
Child.hasMany(BiometricsLog, { foreignKey: 'child_id', as: 'biometricsLogs' });
BiometricsLog.belongsTo(Child, { foreignKey: 'child_id', as: 'child' });

// Child <-> SleepLog (1:N)
Child.hasMany(SleepLog, { foreignKey: 'child_id', as: 'sleepLogs' });
SleepLog.belongsTo(Child, { foreignKey: 'child_id', as: 'child' });

// Child <-> Appointment (1:N)
Child.hasMany(Appointment, { foreignKey: 'child_id', as: 'appointments' });
Appointment.belongsTo(Child, { foreignKey: 'child_id', as: 'child' });

// Child <-> VaccineHistory (1:N)
Child.hasMany(VaccineHistory, { foreignKey: 'child_id', as: 'vaccineHistory' });
VaccineHistory.belongsTo(Child, { foreignKey: 'child_id', as: 'child' });

// === ASSOCIAÇÕES DE MARCOS DO DESENVOLVIMENTO ===

// OfficialMilestone <-> MilestoneMapping (1:N)
OfficialMilestone.hasMany(MilestoneMapping, { foreignKey: 'official_milestone_id', as: 'mappings' });
MilestoneMapping.belongsTo(OfficialMilestone, { foreignKey: 'official_milestone_id', as: 'milestone' });

// JourneyBotQuestion <-> MilestoneMapping (1:N)
JourneyBotQuestion.hasMany(MilestoneMapping, { foreignKey: 'journey_question_id', as: 'milestoneMappings' });
MilestoneMapping.belongsTo(JourneyBotQuestion, { foreignKey: 'journey_question_id', as: 'journeyQuestion' });

// User (Curador) <-> MilestoneMapping (1:N) - quem verificou
User.hasMany(MilestoneMapping, { foreignKey: 'verified_by', as: 'verifiedMappings' });
MilestoneMapping.belongsTo(User, { foreignKey: 'verified_by', as: 'verifier' });

// OfficialMilestone <-> MilestoneCandidateScore (1:N)
OfficialMilestone.hasMany(MilestoneCandidateScore, { foreignKey: 'official_milestone_id', as: 'candidateScores' });
MilestoneCandidateScore.belongsTo(OfficialMilestone, { foreignKey: 'official_milestone_id', as: 'milestone' });

// JourneyBotQuestion <-> MilestoneCandidateScore (1:N)
JourneyBotQuestion.hasMany(MilestoneCandidateScore, { foreignKey: 'journey_question_id', as: 'candidateScores' });
MilestoneCandidateScore.belongsTo(JourneyBotQuestion, { foreignKey: 'journey_question_id', as: 'question' });

// JourneyV2Quiz <-> MilestoneMapping (1:N) — V2 quiz vinculado a marcos
JourneyV2Quiz.hasMany(MilestoneMapping, { foreignKey: 'journey_v2_quiz_id', as: 'milestoneMappings' });
MilestoneMapping.belongsTo(JourneyV2Quiz, { foreignKey: 'journey_v2_quiz_id', as: 'journeyV2Quiz' });

// === ASSOCIAÇÕES DE CURADORIA MATERNA ===

// JourneyV2Quiz <-> MaternalCurationMapping (1:N)
JourneyV2Quiz.hasMany(MaternalCurationMapping, { foreignKey: 'journey_v2_quiz_id', as: 'maternalCurations' });
MaternalCurationMapping.belongsTo(JourneyV2Quiz, { foreignKey: 'journey_v2_quiz_id', as: 'quiz' });

// JourneyV2Topic <-> MaternalCurationMapping (1:N)
JourneyV2Topic.hasMany(MaternalCurationMapping, { foreignKey: 'journey_v2_topic_id', as: 'maternalCurations' });
MaternalCurationMapping.belongsTo(JourneyV2Topic, { foreignKey: 'journey_v2_topic_id', as: 'topic' });

// User (Curador) <-> MaternalCurationMapping (1:N)
User.hasMany(MaternalCurationMapping, { foreignKey: 'verified_by', as: 'verifiedMaternalMappings' });
MaternalCurationMapping.belongsTo(User, { foreignKey: 'verified_by', as: 'verifier' });

// === ASSOCIAÇÕES DE MÍDIA V2 ===

// JourneyV2Topic <-> JourneyV2Media (1:N)
JourneyV2Topic.hasMany(JourneyV2Media, { foreignKey: 'journey_v2_topic_id', as: 'mediaItems' });
JourneyV2Media.belongsTo(JourneyV2Topic, { foreignKey: 'journey_v2_topic_id', as: 'topic' });

// JourneyV2Quiz <-> JourneyV2Media (1:N)
JourneyV2Quiz.hasMany(JourneyV2Media, { foreignKey: 'journey_v2_quiz_id', as: 'mediaItems' });
JourneyV2Media.belongsTo(JourneyV2Quiz, { foreignKey: 'journey_v2_quiz_id', as: 'quiz' });

// MediaResource <-> JourneyV2Media (1:N)
MediaResource.hasMany(JourneyV2Media, { foreignKey: 'media_resource_id', as: 'journeyV2Usages' });
JourneyV2Media.belongsTo(MediaResource, { foreignKey: 'media_resource_id', as: 'mediaResource' });

// === ASSOCIAÇÕES DE RELATÓRIOS DE DESENVOLVIMENTO ===

// Child <-> ChildDevelopmentReport (1:N)
Child.hasMany(ChildDevelopmentReport, { foreignKey: 'child_id', as: 'developmentReports' });
ChildDevelopmentReport.belongsTo(Child, { foreignKey: 'child_id', as: 'child' });

// User <-> ChildDevelopmentReport (1:N)
User.hasMany(ChildDevelopmentReport, { foreignKey: 'user_id', as: 'developmentReports' });
ChildDevelopmentReport.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// JourneyBotSession <-> ChildDevelopmentReport (1:1)
JourneyBotSession.hasOne(ChildDevelopmentReport, { foreignKey: 'session_id', as: 'report', constraints: false });
ChildDevelopmentReport.belongsTo(JourneyBotSession, { foreignKey: 'session_id', as: 'session', constraints: false });

// === ASSOCIAÇÕES DE TREINAMENTOS (FASE 2) ===

// ContentItem <-> ContentVideo (1:N)
ContentItem.hasMany(ContentVideo, { foreignKey: 'content_id', as: 'videos' });
ContentVideo.belongsTo(ContentItem, { foreignKey: 'content_id', as: 'content' });

// ContentItem <-> TrainingModule (1:N)
ContentItem.hasMany(TrainingModule, { foreignKey: 'training_id', as: 'modules' });
TrainingModule.belongsTo(ContentItem, { foreignKey: 'training_id', as: 'training' });

// TrainingModule <-> TrainingLesson (1:N)
TrainingModule.hasMany(TrainingLesson, { foreignKey: 'module_id', as: 'lessons' });
TrainingLesson.belongsTo(TrainingModule, { foreignKey: 'module_id', as: 'module' });

// ContentVideo <-> TrainingLesson (1:N)
ContentVideo.hasMany(TrainingLesson, { foreignKey: 'video_id', as: 'lessons' });
TrainingLesson.belongsTo(ContentVideo, { foreignKey: 'video_id', as: 'video' });

// User <-> UserContentProgress (1:N)
User.hasMany(UserContentProgress, { foreignKey: 'user_id', as: 'contentProgress' });
UserContentProgress.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ContentItem <-> UserContentProgress (1:N)
ContentItem.hasMany(UserContentProgress, { foreignKey: 'content_id', as: 'userProgress' });
UserContentProgress.belongsTo(ContentItem, { foreignKey: 'content_id', as: 'content' });

// TrainingLesson <-> UserContentProgress (1:N)
TrainingLesson.hasMany(UserContentProgress, { foreignKey: 'lesson_id', as: 'userProgress' });
UserContentProgress.belongsTo(TrainingLesson, { foreignKey: 'lesson_id', as: 'lesson' });

// ContentItem <-> ContentPricing (1:1)
ContentItem.hasOne(ContentPricing, { foreignKey: 'content_id', as: 'pricing' });
ContentPricing.belongsTo(ContentItem, { foreignKey: 'content_id', as: 'content' });

// User <-> UserEnrollment (1:N)
User.hasMany(UserEnrollment, { foreignKey: 'user_id', as: 'enrollments' });
UserEnrollment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ContentItem <-> UserEnrollment (1:N)
ContentItem.hasMany(UserEnrollment, { foreignKey: 'content_id', as: 'enrollments' });
UserEnrollment.belongsTo(ContentItem, { foreignKey: 'content_id', as: 'content' });

// === ASSOCIAÇÕES DE SAÚDE MATERNA ===

// User <-> MaternalHealthProfile (1:1)
User.hasOne(MaternalHealthProfile, { foreignKey: 'user_id', as: 'maternalProfile' });
MaternalHealthProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// MaternalHealthProfile <-> MaternalDailyHealth (1:N)
MaternalHealthProfile.hasMany(MaternalDailyHealth, { foreignKey: 'profile_id', as: 'dailyHealth' });
MaternalDailyHealth.belongsTo(MaternalHealthProfile, { foreignKey: 'profile_id', as: 'profile' });

// MaternalHealthProfile <-> MaternalMentalHealth (1:N)
MaternalHealthProfile.hasMany(MaternalMentalHealth, { foreignKey: 'profile_id', as: 'mentalHealth' });
MaternalMentalHealth.belongsTo(MaternalHealthProfile, { foreignKey: 'profile_id', as: 'profile' });

// MaternalHealthProfile <-> MaternalAppointment (1:N)
MaternalHealthProfile.hasMany(MaternalAppointment, { foreignKey: 'profile_id', as: 'appointments' });
MaternalAppointment.belongsTo(MaternalHealthProfile, { foreignKey: 'profile_id', as: 'profile' });

// AssistantPrompt <-> User (created_by, updated_by)
User.hasMany(AssistantPrompt, { foreignKey: 'created_by', as: 'createdPrompts' });
AssistantPrompt.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
User.hasMany(AssistantPrompt, { foreignKey: 'updated_by', as: 'updatedPrompts' });
AssistantPrompt.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });

// Exportação dos modelos
module.exports = {
  sequelize,
  User,
  Profile,
  Child,
  Team,
  TeamMember,
  License,
  SubscriptionPlan,
  Subscription,
  Quiz,
  Question,
  QuizQuestion,
  QuizSession,
  Answer,
  Achievement,
  UserAchievement,
  Journey,
  UserJourney,
  ChatGroup,
  ChatMessage,
  ChatInvite,
  JourneyBotSession,
  JourneyBotResponse,
  JourneyBotQuestion,
  Activity,
  ContentItem,
  AppFaq,
  FaqUserFeedback,
  // Modelos do RAG
  KnowledgeDocument,
  KbBaby,
  KbMother,
  KbProfessional,
  // Modelos da Jornada 2.0
  JourneyV2,
  JourneyV2Week,
  JourneyV2Topic,
  JourneyV2Quiz,
  JourneyV2Badge,
  UserJourneyV2Progress,
  UserJourneyV2Badge,
  // Modelos de Saúde (n8n v3.0)
  BiometricsLog,
  SleepLog,
  Appointment,
  VaccineHistory,
  // Modelos de Marcos do Desenvolvimento
  OfficialMilestone,
  MilestoneMapping,
  MilestoneCandidateScore,
  // Modelos de Relatórios de Desenvolvimento
  ChildDevelopmentReport,
  // Modelos de Treinamentos (FASE 2)
  ContentVideo,
  TrainingModule,
  TrainingLesson,
  UserContentProgress,
  ContentPricing,
  UserEnrollment,
  // Modelo de Prompts dos Assistentes
  AssistantPrompt,
  AssistantLLMConfig,
  // Modelos de Saúde Materna
  MaternalHealthProfile,
  MaternalDailyHealth,
  MaternalMentalHealth,
  MaternalAppointment,
  // Modelos de Curadoria V2 e Mídia
  MaternalCurationMapping,
  JourneyV2Media,
  MediaResource
};
