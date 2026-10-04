import { startsFresh } from './session';

test('a finished run or a shown example starts from a blank pad', () => {
  expect(startsFresh({ exampleShown: true, runComplete: false })).toBe(true);
  expect(startsFresh({ exampleShown: false, runComplete: true })).toBe(true);
  expect(startsFresh({ exampleShown: true, runComplete: true })).toBe(true);
});

test('a stroke during the debounce or a running animation keeps the ink', () => {
  expect(startsFresh({ exampleShown: false, runComplete: false })).toBe(false);
});
