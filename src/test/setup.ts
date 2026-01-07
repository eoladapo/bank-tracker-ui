import '@testing-library/jest-dom'
import * as fc from 'fast-check'

// Configure fast-check for property-based testing
fc.configureGlobal({
  numRuns: 100,
  verbose: true,
})
