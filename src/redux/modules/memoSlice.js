import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// thunk 함수

// 메모 변경하기
export const __changeMemo = createAsyncThunk(
  "memos/CHANGE_MEMO",
  async (payload, thunkAPI) => {
    // firebase 사용방법
    const docRef = doc(db, "memolist", payload.id);
    await updateDoc(docRef, { text: payload.text });
    // toolkit에서 thunkAPI로 함수들이 받아진다. getState 사용하기
    const memo_index = thunkAPI
      .getState()
      .memo.text.findIndex((v) => v.id === payload.id);
    return { index: memo_index, text: payload.text };
  }
);

//메모 추가하기
export const __addMemo = createAsyncThunk(
  "memos/ADD_MEMO",
  async (payload, thunkAPI) => {
    const memoData = await addDoc(collection(db, "memolist"), payload);
    return { id: memoData.id, text: payload.text };
  }
);

//메모 가져오기
export const __getMemo = createAsyncThunk(
  "memos/GET_MEMO",
  async (payload, thunkAPI) => {
    const memoList = await getDocs(collection(db, "memolist"));
    const getMemoList = [];
    memoList.forEach((v) => {
      getMemoList.push({ id: v.id, ...v.data() });
    });
    return getMemoList;
  }
);

//메모 삭제하기
export const __deleteMemo = createAsyncThunk(
  "memos/DELETE_MEMO",
  async (payload, thunkAPI) => {
    const docRef = doc(db, "memolist", payload);
    await deleteDoc(docRef);
    const memo_index = thunkAPI
      .getState()
      .memo.text.findIndex((v) => v.id === payload);
    return memo_index;
  }
);

// slice

const memosSlice = createSlice({
  name: "memo",
  initialState: {
    text: [],
    check: false,
    loading: false,
    error: null,
  },
  // 리듀서를 작성 할 필요는 없었다.
  reducers: {},

  /*만들어진 비동기 액션에 대한 리듀서는 아래와 같이 extraReducers로 작성할 수 있다.
   extraReducers로 지정된 reducer는 외부 작업을 참조하기 위한 것이기 때문에 slice.actions에 생성되지 않는다. 
  또한, ActionReducerMapBuilder를 수신하는 콜백으로 작성하는 것이 권장된다.*/

  // toolkit 장점 통신 상태를 자동으로 받아와 try ~ catch를 사용할 필요가 없다.
  extraReducers: (builder) => {
    builder
      // 메모 가져오기

      //대기중
      .addCase(__getMemo.pending, (state) => {
        state.loading = true;
      })
      //addCase 외에 사용 할 수있는게 더 있다. 공문 참고하자

      // 요청 성공
      .addCase(__getMemo.fulfilled, (state, action) => {
        state.loading = false;
        state.text = action.payload;
      })
      // 요청 실패
      .addCase(__getMemo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // 메모 추가하기
      .addCase(__addMemo.pending, (state) => {
        state.loading = true;
      })
      .addCase(__addMemo.fulfilled, (state, action) => {
        state.loading = false;
        state.text = [action.payload, ...state.text];
      })
      .addCase(__addMemo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //메모 삭제하기
      .addCase(__deleteMemo.pending, (state) => {
        state.loading = true;
      })
      .addCase(__deleteMemo.fulfilled, (state, action) => {
        state.loading = false;
        state.text = state.text.filter((v, l) =>
          l === action.payload ? false : true
        );
      })
      .addCase(__deleteMemo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // 메모 수정하기
      .addCase(__changeMemo.pending, (state) => {
        state.loading = true;
      })
      .addCase(__changeMemo.fulfilled, (state, action) => {
        state.loading = false;
        state.text = state.text.map((v, l) => {
          if (l === action.payload.index) {
            v.text = action.payload.text;
            return v;
          } else {
            return v;
          }
        });
      })
      .addCase(__changeMemo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// reducer dispatch하기 위해 export 하기
export const {} = memosSlice.actions;
export default memosSlice.reducer;
