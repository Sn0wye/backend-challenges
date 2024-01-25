import { Segment } from './getSegment';

const modifiers = {
  debt: 0,
  '1': 100,
  '2': 300,
  '3': 1000
} as const;

export function getCreditModifier(segment: Segment) {
  return modifiers[segment as keyof typeof modifiers] ?? 0;
}
