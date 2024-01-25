import { fastify } from 'fastify';
import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { getSegment } from './utils/getSegment';
import { getCreditModifier } from './utils/getCreditModifier';
import { calculateCreditScore } from './utils/calculateCreditScore';

export const app = fastify({
  logger: {
    transport: {
      target: '@fastify/one-line-logger'
    }
  }
}).withTypeProvider<TypeBoxTypeProvider>();

app.get('/ping', () => 'pong');

const MINIMUM_LOAN_AMOUNT = 2000;
const MAXIMUM_LOAN_AMOUNT = 10000;
const MINIMUM_LOAN_DURATION = 12;
const MAXIMUM_LOAN_DURATION = 60;

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
    console.log('duration', duration);

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

    const creditScore = calculateCreditScore({
      creditModifier,
      loanAmount: amount,
      loanDurationInMonths: duration
    });

    if (creditScore < 1) {
      // the loan was not approved, so check if a smaller loan is possible

      const highestLoanAmount = creditModifier * 60;
      console.log('creditModifier', creditModifier);
      console.log('creditScore', creditScore);
      console.log(
        'score',
        calculateCreditScore({
          creditModifier,
          loanAmount: highestLoanAmount,
          loanDurationInMonths: 60
        })
      );

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
