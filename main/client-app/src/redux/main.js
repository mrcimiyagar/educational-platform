
import { combineReducers, createStore } from 'redux';

export let CHANGE_CONFERENCE_MODE = 'CHANGE_CONFERENCE_MODE';
export let CHANGE_PEOPLECHAT_MODE = 'CHANGE_PEOPLECHAT_MODE';
export let SWITCH_ROOM_TREE_MENU = 'SWITCH_ROOM_TREE_MENU';
export let SWITCH_WEBINAR = 'SWITCH_WEBINAR';
export let SWITCH_CONFERENCE = 'SWITCH_CONFERENCE';
export let SET_CURRENT_ROOM = 'SET_CURRENT_ROOM';
export const PeopleChatModes = {
    ALL: 1,
    CHAT: 2,
    NONE: 3,
};
Object.freeze(PeopleChatModes);

export function setCurrentRoom(room) {
  return {
    type: SET_CURRENT_ROOM,
    room,
  }
}

export function changeConferenceMode(cm) {
    return {
      type: CHANGE_CONFERENCE_MODE,
      cm,
    }
}

export function changePeopleChatMode(pcm) {
    return {
      type: CHANGE_PEOPLECHAT_MODE,
      pcm,
    }
}

export function switchRoomTreeMenu(rtm) {
    return {
      type: SWITCH_ROOM_TREE_MENU,
      rtm,
    }
}

export function switchWebinar(selector, wm) {
  return {
    type: SWITCH_WEBINAR,
    selector,
    wm,
  }
}

export function switchConf(selector, cm) {
  return {
    type: SWITCH_CONFERENCE,
    selector,
    cm,
  }
}

const defaultState = {
    main: {
        isInConference: false,
        peopleAndChat: PeopleChatModes.ALL,
        currentRoom: undefined,
    },
    webinar: {
      video: false,
      audio: false,
      screen: false
    },
    conf: {
      video: false,
      audio: false,
      isAudioEnable: false,
      isVideoEnable: false
    },
    roomTreeMode: false,
}

function global(state = defaultState, action) {
    switch (action.type) {
        case SET_CURRENT_ROOM:
          return {
              ...state,
              main: {
                  ...state.main,
                  currentRoom: action.room
                }
            };
        case CHANGE_CONFERENCE_MODE:
          return {
              ...state,
              main: {
                  ...state.main,
                  isInConference: action.cm
                }
            };
        case CHANGE_PEOPLECHAT_MODE:
          return {
              ...state,
              main: {
                ...state.main,
                  peopleAndChat: action.pcm
                }
            };
        case SWITCH_ROOM_TREE_MENU:
          return {
              ...state,
              roomTreeMode: action.rtm
            };
        case SWITCH_WEBINAR:
          return {
              ...state,
              webinar: {
                ...state.webinar,
                [action.selector]: action.wm
              }    
            };
        case SWITCH_CONFERENCE:
          return {
              ...state,
              conf: {
                ...state.conf,
                [action.selector]: action.cm
              }    
            };
        default:
          return state;
      }
}


const globalApp = combineReducers({
    global
});

const store = createStore(globalApp);

export default store;
