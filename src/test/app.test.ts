import { app } from '../app';

const Segment = {
  SEGMENT_DEBT: '49002010965',
  SEGMENT_1: '49002010976',
  SEGMENT_2: '49002010987',
  SEGMENT_3: '49002010998'
} as const;

describe('opti-loan', () => {
  it('Should simulate for a user in Segment 2', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/loan',
      payload: {
        personalCode: Segment.SEGMENT_2,
        amount: 3000,
        duration: 12
      }
    });

    expect(response.statusCode).toEqual(200);
    expect(response.json()['approved']).toEqual(true);
  });

  it('Should return the max suitable amount for a user without debts', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/loan',
      payload: {
        personalCode: Segment.SEGMENT_2,
        amount: 4000,
        duration: 12
      }
    });

    const jsonResponse = response.json();
    expect(response.statusCode).toEqual(200);
    expect(jsonResponse['approved']).toEqual(false);
    expect(jsonResponse['amount']).toEqual(3600);
    expect(jsonResponse['duration']).toEqual(12);
  });

  it('Should return the suitable loan period for a user without debts', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/loan',
      payload: {
        personalCode: Segment.SEGMENT_1,
        amount: 2000,
        duration: 12
      }
    });

    const jsonResponse = response.json();
    expect(response.statusCode).toEqual(200);
    expect(jsonResponse['approved']).toEqual(true);
    // The expected loan period needs to be adjusted based on your actual business logic
    expect(jsonResponse['duration']).toBeGreaterThan(12);
  });

  it('Should return a negative decision for a super high loan amount', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/loan',
      payload: {
        personalCode: Segment.SEGMENT_1,
        amount: 6001,
        duration: 12
      }
    });

    expect(response.statusCode).toEqual(200);
    expect(response.json()['approved']).toEqual(false);
  });
});
