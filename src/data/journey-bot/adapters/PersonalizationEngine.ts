export interface PersonalizationContext {
  childName: string;
  motherName: string;
  childGender?: 'male' | 'female' | 'other';
}

export class PersonalizationEngine {
  static personalizeText(text: string, context: PersonalizationContext): string {
    let personalizedText = text;

    // Replace child name placeholders
    personalizedText = personalizedText.replace(/{childName}/g, context.childName);
    
    // Replace mother/caregiver name placeholders
    personalizedText = personalizedText.replace(/{motherName}/g, context.motherName);

    // Handle gender-specific pronouns if needed
    if (context.childGender) {
      personalizedText = this.applyGenderPronouns(personalizedText, context.childGender);
    }

    return personalizedText;
  }

  private static applyGenderPronouns(text: string, gender: 'male' | 'female' | 'other'): string {
    let result = text;

    switch (gender) {
      case 'male':
        result = result.replace(/{ele\/ela}/g, 'ele');
        result = result.replace(/{dele\/dela}/g, 'dele');
        result = result.replace(/{o\/a}/g, 'o');
        break;
      case 'female':
        result = result.replace(/{ele\/ela}/g, 'ela');
        result = result.replace(/{dele\/dela}/g, 'dela');
        result = result.replace(/{o\/a}/g, 'a');
        break;
      case 'other':
        result = result.replace(/{ele\/ela}/g, 'ele/ela');
        result = result.replace(/{dele\/dela}/g, 'dele/dela');
        result = result.replace(/{o\/a}/g, 'o/a');
        break;
    }

    return result;
  }

  static extractPersonalizationFromChild(child: any): PersonalizationContext {
    // Extract first name only for more natural conversation
    const firstName = child.first_name || child.name?.split(' ')[0] || 'seu bebê';
    
    return {
      childName: firstName,
      motherName: 'mamãe', // Default, could be customized
      childGender: child.gender
    };
  }

  static createCaregiverContext(caregiverName?: string): PersonalizationContext {
    return {
      childName: 'seu bebê',
      motherName: caregiverName || 'mamãe',
      childGender: undefined
    };
  }

  static personalizeOptions(
    options: Array<{ value: number; text: string; emoji: string }>,
    context: PersonalizationContext
  ): Array<{ value: number; text: string; emoji: string }> {
    return options.map(option => ({
      ...option,
      text: this.personalizeText(option.text, context)
    }));
  }

  static personalizeFeedback(
    feedbacks: { [key: string]: string },
    context: PersonalizationContext
  ): { [key: string]: string } {
    const personalizedFeedbacks: { [key: string]: string } = {};
    
    Object.keys(feedbacks).forEach(key => {
      personalizedFeedbacks[key] = this.personalizeText(feedbacks[key], context);
    });

    return personalizedFeedbacks;
  }

  // Helper to determine appropriate greeting based on time
  static getTimeBasedGreeting(): string {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      return 'Bom dia';
    } else if (hour < 18) {
      return 'Boa tarde';
    } else {
      return 'Boa noite';
    }
  }

  // Create personalized introduction message
  static createIntroductionMessage(context: PersonalizationContext): string {
    const greeting = this.getTimeBasedGreeting();
    return `${greeting} ${context.motherName}! 👋 Eu sou o TitiNauta 🤖 e estou muito feliz em conhecer você e o ${context.childName}!`;
  }
}