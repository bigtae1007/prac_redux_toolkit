import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { __addMemo, __changeMemo, __deleteMemo, __getMemo } from "./redux/modules/memoSlice";

export default function Example(){
  const memoList = useSelector(state=>state.memo.text)
const dispatch = useDispatch();
const [text, setText] = useState("")
useEffect(()=>{
  // thunk 함수 호출
  dispatch(__getMemo())

},[])

const changeText = (e)=>{
setText(e.target.value)
}

const sendText = ()=>{
  // thunk 함수 호출
dispatch(__addMemo({text : text}))
}

const deleteMemo = (id)=>{
  // thunk 함수 호출
  dispatch(__deleteMemo(id))
}

const changeMemo = id => {
  // thunk 함수 호출
  dispatch(__changeMemo({id:id, text: text}))
}

return(

  <>
  <div>
    <input type="text" onChange={changeText} value={text} />
    <br></br>
    <button onClick={sendText}>저장하기</button>
    {
      memoList.map(v=>{
        return(
        <WrapDiv key={v.id}>
    <p>{v.text} </p> 
    <button onClick={()=>{deleteMemo(v.id)}}>삭제</button>
    <button onClick={()=>{changeMemo(v.id)}}>수정</button>
    </WrapDiv>
      )})
    }
    
  </div>
  </>
)
}

const WrapDiv = styled.div`
  display: flex;
  align-items: center;
 button{
   width: 50px;
   height: 30px;
   background-color: #ccc;
   border: none;
   border-radius: 10px;
   margin-left: 10px;
 }
`