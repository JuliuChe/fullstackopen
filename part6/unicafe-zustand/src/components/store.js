import { create } from 'zustand'

const useFeedbackStore = create(set => ({
  statValues: {
    good: 0,
    neutral: 0,
    bad: 0,
    all: 0,
    average: 0,
    positive:0,
  },
  actions: {
    good: () => set(state => ({ statValues: updateStatistics(state.statValues.good + 1, state.statValues.neutral, state.statValues.bad) })),
    neutral: () => set(state => ({ statValues: updateStatistics(state.statValues.good, state.statValues.neutral + 1, state.statValues.bad) })),
    bad: () => set(state => ({ statValues: updateStatistics(state.statValues.good, state.statValues.neutral, state.statValues.bad + 1) })),
  }  
}))

const updateStatistics = (good, neutral, bad) => { 
  console.log('good:', good, 'neutral:', neutral, 'bad: ', bad)
  const all = good + neutral + bad
  console.log({
    good, neutral, bad, all,
    average: all === 0 ? 0 : ((good - bad) / all).toFixed(3),
    positive: all === 0 ? 0 : (good/all*100).toFixed(1)+'%'
  })
  return {
    good, neutral, bad, all,
    average: all === 0 ? 0 : ((good - bad) / all).toFixed(3),
    positive: all === 0 ? 0 : (good/all*100).toFixed(1)+'%'
  }
}

// the hook functions that are used elsewhere in app
export const useFeedbackStatistics = () => useFeedbackStore(state => state.statValues)
export const useFeedbackControls = () => useFeedbackStore(state => state.actions)