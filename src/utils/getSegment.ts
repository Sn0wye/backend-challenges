export type Segment = 'debt' | '1' | '2' | '3';

const segments = {
  '49002010965': 'debt',
  '49002010976': '1',
  '49002010987': '2',
  '49002010998': '3'
} as const;

export function getSegment(personalCode: string): Segment {
  return segments[personalCode as keyof typeof segments] ?? 'debt';
}
