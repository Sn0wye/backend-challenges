# Opti-Loan

## Objective

Design a decision engine which takes in personal code, loan amount, loan period in
months and returns a decision (negative or positive) and the amount.

The idea of the decision engine is to determine what would be the maximum sum, regardless of
the person requested loan amount.

For example if a person applies for 4000 €, but we determine
that we would approve a larger sum then the result should be the maximum sum which we
would approve.

Also in reverse, if a person applies for 4000 € and we would not approve it then
we want to return the largest sum which we would approve, for example 2500 €.

If a suitable loan amount is not found within the selected period, the decision engine should also try to find a new
suitable period.

In real life the solution should connect to external registries and compose a
comprehensive user profile, but for the sake of simplicity this part can be mocked as a hard
coded result for certain personal codes. As the scope of this solution you only need to support 4
different scenarios - a person has debt or a person falls under a different segmentation.

## Example

- 49002010965 - debt
- 49002010976 - segment 1 (credit_modifier = 100)
- 49002010987 - segment 2 (credit_modifier = 300)
- 49002010998 - segment 3 (credit_modifier = 1000)

If a person has debt then we do not approve any amount. If a person has no debt then we take
the identifier and use it for calculating person's credit score taking into account the requested
input.

## Constraints

- Minimum input and output sum should be 2000 €
- Maximum input and output sum should be 10000 €
- Minimum loan period should be 12 months
- Maximum loan period should be 60 months

Scoring algorithm. For calculating credit score a really primitive algorithm should be
implemented. You need to divide the credit modifier with the loan amount and multiply the
result with the loan period in months. If the result is less than 1 then we would not approve such
sum, if the result is larger or equal than 1 then we would approve this sum.

credit score = (credit modifier / loan amount) \* loan period
