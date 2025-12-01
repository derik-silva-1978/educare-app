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

// Importação dos modelos da Jornada 2.0
const JourneyV2 = require('./JourneyV2');
const JourneyV2Week = require('./JourneyV2Week');
const JourneyV2Topic = require('./JourneyV2Topic');
const JourneyV2Quiz = require('./JourneyV2Quiz');
const JourneyV2Badge = require('./JourneyV2Badge');
const UserJourneyV2Progress = require('./UserJourneyV2Progress');
const UserJourneyV2Badge = require('./UserJourneyV2Badge');

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
  // Modelos da Jornada 2.0
  JourneyV2,
  JourneyV2Week,
  JourneyV2Topic,
  JourneyV2Quiz,
  JourneyV2Badge,
  UserJourneyV2Progress,
  UserJourneyV2Badge
};
