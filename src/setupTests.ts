import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// jsdom (Jest 27) lacks these, and react-router v7 needs them at import time
Object.assign(global, { TextEncoder, TextDecoder });
