import { Action } from "../Interfaces";

const initState = {
  identity: "",
};

const reducer = (state = initState, action: Action) => {
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
