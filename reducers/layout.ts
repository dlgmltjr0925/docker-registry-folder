export interface LayoutState {
  isOpenedSideBar: boolean;
}

enum LayoutActionType {
  TOGGLE_SIDE_BAR = 'TOGGLE_SIDE_BAR',
}

type LayoutPayload = any;

interface LayoutAction {
  type: LayoutActionType;
  payload?: LayoutPayload;
}

export const toggleSideBar = () => ({
  type: LayoutActionType.TOGGLE_SIDE_BAR,
});

const initialState: LayoutState = {
  isOpenedSideBar: true,
};

const layoutReducer = (state = initialState, action: LayoutAction) => {
  switch (action.type) {
    case LayoutActionType.TOGGLE_SIDE_BAR:
      return {
        ...state,
        isOpenedSideBar: !state.isOpenedSideBar,
      };
    default:
      return state;
  }
};

export default layoutReducer;
