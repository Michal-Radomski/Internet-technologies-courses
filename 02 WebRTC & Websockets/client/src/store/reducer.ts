const initState = {
  identity: "",
};

const reducer = (state = initState, action: { type: any }) => {
  switch (action.type) {
    case "DUMMY_ACTION":
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default reducer;
