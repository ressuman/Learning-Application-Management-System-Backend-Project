const formatLearnerResponse = (learner) => ({
  ...learner.toObject(),
  financialSummary: {
    totalOwed: learner.balance,
    registrationFee: learner.registrationFee,
    registrationFeePaid: learner.registrationFeePaid,
    totalCourseFees: learner.totalCourseFees,
    paymentsMade: learner.payments.reduce((sum, p) => sum + p.amount, 0),
  },
});
