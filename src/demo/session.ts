/**
 * Whether the next stroke starts on a blank pad. A shown example or a finished run (the stage
 * reached its reveal) is replaced; a stroke that follows quickly keeps the ink so multi-stroke
 * digits such as a 4 or a crossed 7 still work.
 */
export const startsFresh = ({ exampleShown, runComplete }: { exampleShown: boolean; runComplete: boolean }): boolean =>
  exampleShown || runComplete;
