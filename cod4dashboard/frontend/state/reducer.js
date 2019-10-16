export default function reducer(state, { type, payload }) {
  switch (type) {
    case 'START_LOADING':
      return {
        ...state,
        loading: true
      };
    case 'STOP_LOADING':
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
}
