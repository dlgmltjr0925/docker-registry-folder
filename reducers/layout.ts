export interface LayoutState {
  isOpenedSideBar: boolean;
}

enum LayoutActionType {
  TOGGLE_SIDE_BAR = 'TOGGLE_SIDE_BAR',
  CLOSE_SIDE_BAR = 'CLOSE_SIDE_BAR',
  OPEN_SIDE_BAR = 'OPEN_SIDE_BAR',
}

type LayoutPayload = any;

interface LayoutAction {
  type: LayoutActionType;
  payload?: LayoutPayload;
}

export const toggleSideBar = () => ({
  type: LayoutActionType.TOGGLE_SIDE_BAR,
});

export const closeSideBar = () => ({
  type: LayoutActionType.CLOSE_SIDE_BAR,
});

export const openSideBar = () => ({
  type: LayoutActionType.OPEN_SIDE_BAR,
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
    case LayoutActionType.CLOSE_SIDE_BAR:
      return {
        ...state,
        isOpenedSideBar: false,
      };
    case LayoutActionType.OPEN_SIDE_BAR:
      return {
        ...state,
        isOpenedSideBar: true,
      };
    default:
      return state;
  }
};

export default layoutReducer;
