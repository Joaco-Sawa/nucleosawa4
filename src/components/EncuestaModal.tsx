import { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EncuestaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EncuestaModal({ isOpen, onClose }: EncuestaModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string | string[] }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      question: '¿Cómo calificarías el ambiente laboral en tu equipo?',
      type: 'single' as const,
      options: [
        'Excelente',
        'Muy bueno',
        'Bueno',
        'Regular',
        'Necesita mejorar'
      ]
    },
    {
      id: 2,
      question: '¿Qué aspectos consideras más importantes para mejorar? (Puedes seleccionar múltiples opciones)',
      type: 'multiple' as const,
      options: [
        'Comunicación interna',
        'Reconocimiento y beneficios',
        'Capacitación y desarrollo',
        'Equilibrio vida-trabajo',
        'Herramientas y tecnología'
      ]
    },
    {
      id: 3,
      question: '¿Recomendarías trabajar en nuestra organización a un amigo o familiar?',
      type: 'single' as const,
      options: [
        'Definitivamente sí',
        'Probablemente sí',
        'No estoy seguro/a',
        'Probablemente no',
        'Definitivamente no'
      ]
    }
  ];

  const handleSingleChoice = (optionIndex: number) => {
    setAnswers({
      ...answers,
      [currentQuestion]: questions[currentQuestion].options[optionIndex]
    });
  };

  const handleMultipleChoice = (optionIndex: number) => {
    const questionId = currentQuestion;
    const currentAnswers = (answers[questionId] as string[]) || [];
    const option = questions[currentQuestion].options[optionIndex];

    if (currentAnswers.includes(option)) {
      setAnswers({
        ...answers,
        [questionId]: currentAnswers.filter(a => a !== option)
      });
    } else {
      setAnswers({
        ...answers,
        [questionId]: [...currentAnswers, option]
      });
    }
  };

  const isQuestionAnswered = () => {
    const answer = answers[currentQuestion];
    if (!answer) return false;
    if (Array.isArray(answer)) return answer.length > 0;
    return true;
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setCurrentQuestion(0);
      setAnswers({});
      onClose();
    }, 2500);
  };

  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              {!isSubmitted ? (
                <>
                  <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div>
                      <h2 className="text-2xl font-bold text-[#45556C]">Encuesta de Clima Organizacional</h2>
                      <p className="text-sm text-slate-500 mt-1">
                        Pregunta {currentQuestion + 1} de {questions.length}
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>

                  <div className="px-6 pt-4">
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                        className="h-full bg-gradient-to-r from-[#FFAD5B] to-[#FF8000]"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <h3 className="text-lg font-bold text-[#45556C] mb-6">
                          {currentQ.question}
                        </h3>

                        <div className="space-y-3">
                          {currentQ.options.map((option, index) => {
                            const isSelected = currentQ.type === 'single'
                              ? answers[currentQuestion] === option
                              : (answers[currentQuestion] as string[] || []).includes(option);

                            return (
                              <button
                                key={index}
                                onClick={() => {
                                  if (currentQ.type === 'single') {
                                    handleSingleChoice(index);
                                  } else {
                                    handleMultipleChoice(index);
                                  }
                                }}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                                  isSelected
                                    ? 'border-[#FF8000] bg-[#FF8000]/5'
                                    : 'border-slate-200 hover:border-[#FF8000]/50 hover:bg-slate-50'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                      isSelected
                                        ? 'border-[#FF8000] bg-[#FF8000]'
                                        : 'border-slate-300'
                                    }`}
                                  >
                                    {isSelected && (
                                      <div className="w-2 h-2 bg-white rounded-full" />
                                    )}
                                  </div>
                                  <span className={`text-sm font-medium ${isSelected ? 'text-[#FF8000]' : 'text-slate-700'}`}>
                                    {option}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center justify-between gap-3 p-6 border-t border-slate-200 bg-slate-50">
                    <button
                      onClick={handlePrevious}
                      disabled={currentQuestion === 0}
                      className={`px-6 py-3 rounded-full font-semibold transition-all ${
                        currentQuestion === 0
                          ? 'text-slate-400 cursor-not-allowed'
                          : 'text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Anterior
                    </button>

                    <div className="flex items-center gap-2">
                      {questions.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentQuestion
                              ? 'bg-[#FF8000] w-6'
                              : index < currentQuestion
                              ? 'bg-[#FF8000]/50'
                              : 'bg-slate-300'
                          }`}
                        />
                      ))}
                    </div>

                    {isLastQuestion ? (
                      <button
                        onClick={handleSubmit}
                        disabled={!isQuestionAnswered()}
                        className={`px-8 py-3 rounded-full font-semibold transition-all ${
                          isQuestionAnswered()
                            ? 'bg-[#FF8000] hover:bg-[#FF9119] text-white shadow-md shadow-[#FF8000]/20'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Enviar
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        disabled={!isQuestionAnswered()}
                        className={`px-8 py-3 rounded-full font-semibold transition-all ${
                          isQuestionAnswered()
                            ? 'bg-[#FF8000] hover:bg-[#FF9119] text-white shadow-md shadow-[#FF8000]/20'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Siguiente
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center p-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-6" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-[#45556C] mb-3">
                    ¡Gracias por participar!
                  </h3>
                  <p className="text-slate-600 max-w-md">
                    Tu opinión es muy valiosa para nosotros y nos ayuda a construir un mejor ambiente de trabajo.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
