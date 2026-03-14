import { useGameStore } from './useGameStore'

const resetStore = () => {
  useGameStore.setState({
    currentScreen: 'welcome',
    userProfile: null,
    gripReadings: [],
    result: null,
    leaderboard: [],
  })
  window.localStorage.clear()
}

describe('useGameStore', () => {
  beforeEach(() => {
    resetStore()
  })

  it('stores at most three grip readings and clamps values', () => {
    const { addGripReading } = useGameStore.getState()

    addGripReading(0)
    addGripReading(151)
    addGripReading(42.42)
    addGripReading(60)

    const readings = useGameStore.getState().gripReadings
    expect(readings).toHaveLength(3)
    expect(readings[0].value).toBe(1)
    expect(readings[1].value).toBe(150)
    expect(readings[2].value).toBe(42.4)
  })

  it('calculates result from best of recorded attempts', () => {
    useGameStore.getState().setProfile({
      name: 'Adam',
      age: 35,
      sex: 'male',
    })

    const { addGripReading, calculateAndSetResult } = useGameStore.getState()
    addGripReading(30)
    addGripReading(55.5)
    addGripReading(42)

    calculateAndSetResult()

    const result = useGameStore.getState().result
    expect(result).not.toBeNull()
    expect(result?.bestGrip).toBe(55.5)
  })

  it('adds and sorts leaderboard entries by grip descending', () => {
    const store = useGameStore.getState()

    store.setProfile({ name: 'A', age: 40, sex: 'male' })
    store.addGripReading(40)
    store.calculateAndSetResult()
    store.addToLeaderboard()

    useGameStore.setState({
      userProfile: null,
      gripReadings: [],
      result: null,
    })

    const store2 = useGameStore.getState()
    store2.setProfile({ name: 'B', age: 40, sex: 'male' })
    store2.addGripReading(60)
    store2.calculateAndSetResult()
    store2.addToLeaderboard()

    const leaderboard = useGameStore.getState().leaderboard
    expect(leaderboard).toHaveLength(2)
    expect(leaderboard[0].name).toBe('B')
    expect(leaderboard[1].name).toBe('A')
    expect(leaderboard[0].sex).toBe('male')
  })

  it('clears leaderboard and keeps state reset behavior', () => {
    const store = useGameStore.getState()
    store.setProfile({ name: 'A', age: 25, sex: 'female' })
    store.addGripReading(35)
    store.calculateAndSetResult()
    store.addToLeaderboard()

    expect(useGameStore.getState().leaderboard.length).toBe(1)

    store.clearLeaderboard()
    expect(useGameStore.getState().leaderboard.length).toBe(0)

    store.resetGame()
    const next = useGameStore.getState()
    expect(next.currentScreen).toBe('welcome')
    expect(next.userProfile).toBeNull()
    expect(next.gripReadings).toHaveLength(0)
    expect(next.result).toBeNull()
  })
})
