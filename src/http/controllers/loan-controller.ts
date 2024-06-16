import { App } from '@/app';
import { calculateCreditScore } from '@/utils/calculateCreditScore';
import { getCreditModifier } from '@/utils/getCreditModifier';
import { getSegment } from '@/utils/getSegment';
import { Type } from '@sinclair/typebox';
const MINIMUM_LOAN_AMOUNT = 2000;
const MAXIMUM_LOAN_AMOUNT = 10000;
const MINIMUM_LOAN_DURATION = 12;
const MAXIMUM_LOAN_DURATION = 60;

export const loanController = (app: App) => {
  app.post(
    '/loan',
    {
      schema: {
        body: Type.Object({
          personalCode: Type.String(),
          amount: Type.Number({
            minimum: MINIMUM_LOAN_AMOUNT,
            maximum: MAXIMUM_LOAN_AMOUNT
          }),
          duration: Type.Number({
            minimum: MINIMUM_LOAN_DURATION,
            maximum: MAXIMUM_LOAN_DURATION
          })
        }),
        response: {
          200: Type.Object({
            approved: Type.Boolean(),
            duration: Type.Number(),
            amount: Type.Number(),
            message: Type.String()
          })
        }
      }
    },
    async (req, res) => {
      const { personalCode, amount, duration } = req.body;

      let segment = getSegment(personalCode);

      if (segment === 'debt') {
        return res.status(200).send({
          approved: false,
          amount: 0,
          duration: 0,
          message: 'You already have debt, no loan was approved for you.'
        });
      }

      const creditModifier = getCreditModifier(segment);

      console.table({
        segment,
        creditModifier,
        amount,
        duration
      });
      const creditScore = calculateCreditScore({
        creditModifier,
        loanAmount: amount,
        loanDurationInMonths: duration
      });

      console.log('creditScore', creditScore);

      if (creditScore < 1) {
        // the loan was not approved, so check if a smaller loan is possible

        const highestLoanAmount = creditModifier * 60;

        if (highestLoanAmount < MINIMUM_LOAN_AMOUNT) {
          return res.status(200).send({
            approved: false,
            amount: 0,
            duration: 0,
            message: 'You do not have enough credit score to get a loan.'
          });
        }

        return res.status(200).send({
          approved: false,
          amount: highestLoanAmount,
          duration: 60,
          message: `You do not have enough credit score to get this loan, but the best loan you can get with your score is ${highestLoanAmount}€ with a duration of 60 months.`
        });
      }

      // value that is closest to 1 (highest value)
      let highestLoanAmount = creditModifier * 60;

      if (highestLoanAmount > MAXIMUM_LOAN_AMOUNT) {
        highestLoanAmount = MAXIMUM_LOAN_AMOUNT;
      }

      const message =
        highestLoanAmount === amount
          ? 'Loan was approved.'
          : `Loan was approved, but the best loan that fits your credit score is ${highestLoanAmount}€.`;

      return {
        approved: true,
        amount: highestLoanAmount,
        duration,
        message
      };
    }
  );
};
