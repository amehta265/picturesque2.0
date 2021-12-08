import {createContext} from 'react';

export default createContext<{
  answer?: String
  setAnswer: (answer?: String) => void
}>({
  answer: undefined,
  setAnswer: () => {},
});

