

/**
 * @typedef {object} QuizQuestion
 * @property {string} id - An identifier for the question's purpose (e.g., 'urgency').
 * @property {string} question - The text of the question.
 * @property {string[]} options - An array of possible answers.
 * @property {'urgency' | 'theme'} type - The type of question, influencing app logic.
 */

/**
 * The set of quiz questions for the baby's learning trail.
 * @type {QuizQuestion[]}
 */
export const QUIZ_QUESTIONS_BABY = [
    {
        id: 'urgency_baby',
        question: "Como você e o bebê estão se sentindo agora?",
        options: [
            "Bem, apenas com dúvidas comuns",
            "Um pouco preocupada com algo específico",
            "Observando algo diferente no bebê",
            "Acho que preciso de orientação urgente"
        ],
        type: 'urgency'
    },
    {
        id: 'main_concern_baby',
        question: "Qual sua principal preocupação com o bebê hoje?",
        options: [
            // Options are now dynamically generated from the current week's topics in index.js
        ],
        type: 'theme'
    }
];

/**
 * The set of quiz questions for the mother's learning trail.
 * @type {QuizQuestion[]}
 */
export const QUIZ_QUESTIONS_MOTHER = [
    {
        id: 'urgency_mother',
        question: "Como você está se sentindo agora?",
        options: [
            "Bem, apenas com dúvidas comuns da recuperação",
            "Cansada, mas seguindo em frente",
            "Preocupada com algo na minha saúde",
            "Acho que preciso de orientação urgente"
        ],
        type: 'urgency'
    },
    {
        id: 'main_concern_mother',
        question: "Qual sua principal preocupação com você hoje?",
        options: [
            "Minha recuperação física (cicatrização, dores)",
            "Minha saúde emocional (cansaço, tristeza)",
            "Cuidados com as mamas e amamentação",
            "Planejamento futuro (contracepção, consultas)"
        ],
        type: 'theme'
    }
];