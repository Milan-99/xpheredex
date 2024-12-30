import { createReducer } from '@reduxjs/toolkit';
import { TokenList } from '@uniswap/token-lists/dist/types';
// Import the necessary actions
import { updateVersion } from '../global/actions';
import { acceptListUpdate, addList, removeList, selectList } from './actions';
// Import the token list from the SDK
import tokenList from '@baguette-exchange/contracts/tokenlist/baguette.tokenlist.json'; // Replace with the actual path

export interface ListsState {
  readonly byUrl: {
    readonly [url: string]: {
      readonly current: TokenList | null;
      readonly pendingUpdate: TokenList | null;
      readonly loadingRequestId: string | null;
      readonly error: string | null;
    };
  };
  readonly lastInitializedDefaultListOfLists?: string[];
  readonly selectedListUrl: string | undefined;
}

type ListState = ListsState['byUrl'][string];

const NEW_LIST_STATE: ListState = {
  error: null,
  current: null,
  loadingRequestId: null,
  pendingUpdate: null,
};

// type Mutable<T> = { -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U> ? U[] : T[P] };

// Initialize the state
const initialState: ListsState = {
  lastInitializedDefaultListOfLists: [tokenList.name],
  byUrl: {
    [tokenList.name]: {
      ...NEW_LIST_STATE,
      current: tokenList,
    },
  },
  selectedListUrl: tokenList.name,
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(selectList, (state, { payload: url }) => {
      state.selectedListUrl = url;
      // Automatically add the list if it's not already present
      if (!state.byUrl[url]) {
        state.byUrl[url] = {
          ...NEW_LIST_STATE,
          current: tokenList, // Assuming all token lists are the same
        };
      }
    })
    .addCase(addList, (state, { payload: url }) => {
      if (!state.byUrl[url]) {
        state.byUrl[url] = {
          ...NEW_LIST_STATE,
          current: tokenList, // Assuming all token lists are the same
        };
      }
    })
    .addCase(removeList, (state, { payload: url }) => {
      if (state.byUrl[url]) {
        delete state.byUrl[url];
      }
      if (state.selectedListUrl === url) {
        state.selectedListUrl = tokenList.name;
      }
    })
    .addCase(acceptListUpdate, (state, { payload: url }) => {
      if (!state.byUrl[url]?.pendingUpdate) {
        throw new Error('accept list update called without pending update');
      }
      state.byUrl[url] = {
        ...state.byUrl[url],
        pendingUpdate: null,
        current: state.byUrl[url].pendingUpdate,
      };
    })
    .addCase(updateVersion, (state) => {
      // Reset the state with the token list from the SDK
      state.byUrl = {
        [tokenList.name]: {
          ...NEW_LIST_STATE,
          current: tokenList,
        },
      };
      state.selectedListUrl = tokenList.name;
      state.lastInitializedDefaultListOfLists = [tokenList.name];
    })
);
