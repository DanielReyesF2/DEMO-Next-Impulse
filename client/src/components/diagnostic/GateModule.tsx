import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ArrowRight, 
  ArrowLeft,
  Shield,
  ShieldCheck,
  ShieldX,
  Target
} from 'lucide-react';
import { DIAGNOSTIC_CONFIG, DiagnosticModule } from '@shared/diagnosticConfig';

interface GateModuleProps {
  answers: Record<string, string>;
  currentQuestionIndex: number;
  onAnswer: (questionId: string, answer: string) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
}

export function GateModule({ 
  answers, 
  currentQuestionIndex, 
  onAnswer, 
  onNext, 
  onBack, 
  canGoBack 
}: GateModuleProps) {
  const gateModule = DIAGNOSTIC_CONFIG.find(m => m.id === "A") as DiagnosticModule;
  const currentQuestion = gateModule.questions[currentQuestionIndex];
  
  // Calculate gate status
  const gateBlockers = gateModule.gate_blockers || [];
  const gateThreshold = gateModule.gate_threshold || 0.8;
  
  const blockerStatus = gateBlockers.map(questionId => {
    const question = gateModule.questions.find(q => q.id === questionId);
    const answer = answers[questionId];
    const score = question ? (question.options[answer] ?? 0) : 0;
    const isCritical = score < gateThreshold;
    
    return {
      questionId,
      question: question?.text || '',
      answer,
      score,
      isCritical,
      isAnswered: !!answer
    };
  });
  
  const answeredBlockers = blockerStatus.filter(b => b.isAnswered);
  const criticalBlockers = blockerStatus.filter(b => b.isCritical && b.isAnswered);
  const gateProgress = (answeredBlockers.length / blockerStatus.length) * 100;
  const gateStatus = answeredBlockers.length === blockerStatus.length && criticalBlockers.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Gate Status Header */}
      <div className="bg-white shadow-xl border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{
                  backgroundColor: gateStatus 
                    ? '#1e293b' 
                    : criticalBlockers.length > 0 
                      ? '#64748b' 
                      : '#334155'
                }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl border border-slate-200"
              >
                {gateStatus ? (
                  <ShieldCheck className="w-8 h-8 text-white" />
                ) : criticalBlockers.length > 0 ? (
                  <ShieldX className="w-8 h-8 text-white" />
                ) : (
                  <Shield className="w-8 h-8 text-white" />
                )}
              </motion.div>
              
              <div>
                <h1 className="text-3xl font-black text-gray-900">
                  Evaluación Estratégica TRUE
                </h1>
                <p className="text-lg text-gray-600">
                  Análisis de oportunidades para maximizar su impacto
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-600">Progreso de Evaluación</div>
              <div className="text-2xl font-black text-gray-900">{Math.round(gateProgress)}%</div>
            </div>
          </div>
          
          <Progress value={gateProgress} className="h-2 mb-6" />
          
          {/* Gate Status Banner */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-6 rounded-2xl border ${
              gateStatus
                ? 'bg-slate-50 border-slate-300 text-slate-800'
                : criticalBlockers.length > 0
                  ? 'bg-slate-50 border-slate-300 text-slate-700'
                  : 'bg-slate-50 border-slate-300 text-slate-700'
            } shadow-lg`}
          >
            <div className="flex items-center space-x-3">
              {gateStatus ? (
                <CheckCircle className="w-6 h-6 text-slate-600" />
              ) : criticalBlockers.length > 0 ? (
                <Target className="w-6 h-6 text-slate-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-slate-600" />
              )}
              
              <div className="flex-1">
                <div className="font-bold text-lg">
                  {gateStatus 
                    ? '🚀 Perfectos para TRUE Zero Waste'
                    : criticalBlockers.length > 0
                      ? '💪 Áreas de mayor oportunidad identificadas'
                      : '🎯 Evaluando potencial estratégico...'
                  }
                </div>
                <div className="text-sm">
                  {gateStatus 
                    ? 'Excelente posicionamiento para certificación completa'
                    : criticalBlockers.length > 0
                      ? `${criticalBlockers.length} área(s) de máximo impacto identificada(s)`
                      : `${answeredBlockers.length}/${blockerStatus.length} aspectos evaluados`
                  }
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Critical Blockers Alert */}
      {criticalBlockers.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-start space-x-3">
              <Target className="w-5 h-5 text-slate-600 mt-0.5" />
              <div>
                <div className="font-bold text-slate-800 text-lg">Áreas de Mayor Oportunidad Estratégica:</div>
                <ul className="text-slate-600 mt-3 space-y-2">
                  {criticalBlockers.map(blocker => (
                    <li key={blocker.questionId} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                      <span>Oportunidad en: <strong>{blocker.question.toLowerCase()}</strong></span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Question Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-2xl border border-slate-200 rounded-3xl overflow-hidden bg-white">
              <CardContent className="p-10">
                <div className="space-y-10">
                  {/* Question Header */}
                  <div className="text-center space-y-6">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg ${
                        gateBlockers.includes(currentQuestion.id)
                          ? 'bg-slate-800'
                          : 'bg-slate-700'
                      }`}>
                        {currentQuestionIndex + 1}
                      </div>
                      {gateBlockers.includes(currentQuestion.id) && (
                        <div className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-sm font-medium border border-slate-200">
                          OPORTUNIDAD CLAVE
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-3xl font-black text-slate-900 leading-tight">
                      {currentQuestion.text}
                    </h3>
                    
                    {currentQuestion.description && (
                      <p className="text-slate-600 text-lg bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
                        💡 {currentQuestion.description}
                      </p>
                    )}
                  </div>

                  {/* Answer Options */}
                  <div className="space-y-3">
                    {Object.entries(currentQuestion.options).map(([option, score]) => (
                      <motion.button
                        key={option}
                        onClick={() => onAnswer(currentQuestion.id, option)}
                        className={`w-full p-6 rounded-2xl border text-left transition-all duration-300 ${
                          answers[currentQuestion.id] === option
                            ? score >= gateThreshold
                              ? 'border-slate-400 bg-slate-50 shadow-xl'
                              : 'border-slate-400 bg-slate-50 shadow-xl'
                            : 'border-slate-200 bg-white hover:border-slate-400 hover:shadow-lg hover:-translate-y-1'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-semibold text-slate-900 flex-1">
                            {option}
                          </span>
                          <div className="flex items-center space-x-3">
                            <div className={`px-4 py-2 rounded-full text-sm font-medium border ${
                              score >= gateThreshold
                                ? 'bg-slate-100 text-slate-700 border-slate-300'
                                : 'bg-slate-100 text-slate-600 border-slate-300'
                            }`}>
                              {score >= gateThreshold ? 'FORTALEZA' : 'OPORTUNIDAD'}
                            </div>
                            <span className="text-sm text-slate-500 font-medium">
                              {Math.round(score * 100)}pts
                            </span>
                            {answers[currentQuestion.id] === option && (
                              score >= gateThreshold ? (
                                <CheckCircle className="w-5 h-5 text-slate-600" />
                              ) : (
                                <Target className="w-5 h-5 text-slate-600" />
                              )
                            )}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-6 pt-8">
                    <Button
                      variant="outline"
                      onClick={onBack}
                      disabled={!canGoBack}
                      className="flex-1 py-4 rounded-2xl border-slate-300 text-slate-700 hover:bg-slate-50 transition-all duration-200"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Anterior
                    </Button>
                    
                    {answers[currentQuestion.id] && (
                      <Button
                        onClick={onNext}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 py-4 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl"
                      >
                        {currentQuestionIndex === gateModule.questions.length - 1 ? 'Completar Gate' : 'Siguiente'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}