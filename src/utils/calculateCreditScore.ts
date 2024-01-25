type CalculateCreditScoreOpts = {
  creditModifier: number;
  loanAmount: number;
  loanDurationInMonths: number;
};

export function calculateCreditScore({
  creditModifier,
  loanAmount,
  loanDurationInMonths
}: CalculateCreditScoreOpts) {
  return (creditModifier / loanAmount) * loanDurationInMonths;
}
