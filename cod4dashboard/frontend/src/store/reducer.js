export default function reducer(state, { type, payload }) {
  switch (type) {
    case 'SET_ADMINS':
      return {
        ...state,
        admins: payload
      };
    case 'SET_VIPS':
      return {
        ...state,
        vips: payload
      };
    default:
      return state;
  }
}
