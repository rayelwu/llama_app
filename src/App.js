import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useState } from 'react';

const sysPrompt = {
  "role": "system",
  "content": `
你表示玩家，现在处在一个2维的3*3个单元格的方型棋盘游戏世界；你当前所处的世界位置是：(0,0)。每个单元格中的状态有0,1,2,3。0表示空白，1表示砖块，2表示玩家，3表示目标。你可以往上下左右4个方向行走，但是只能往空白处前进，现在你需要往目标前进，一次只能前进一个单元格。直接输出游戏世界的状态数组，不要输出其他的内容；

示例输入:
当前游戏世界为3*3的棋盘格，状态为: [2,0,0,1,1,0,3,0,0]，你所处的位置为：(0,0), 你往目标前进一个单元格后，世界的状态为？

示例输出:
[0,2,0,1,1,0,3,0,0]
`
}
const userPrompt = {
  "role": "user",
  "content": "继续往目标前进一个单元格后，世界的状态为？"
}

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([sysPrompt, userPrompt])

  return (
    <div className="App">
      <button onClick={() => {

        setLoading(true)
        setData(null)
        axios.post("http://127.0.0.1:11434/api/chat", {
          "model": "deepseek-r1:32b",
          "messages": messages,
          raw: true,
          stream: false
        }).then(response => {
          //setData(response.data.message)
          setLoading(false)
          const content = response.data.message.content
          setData(content.split("</think>")[1]?.replaceAll(/[\n\s]/g, ""))
          setMessages([...messages, response.data.message, userPrompt])
        })
      }}>ClickMe</button>
      <hr />
      {loading && "thinking..."}
      {data && <textarea value={JSON.stringify(data, null, 2)} />}

      <div className=' flex flex-col p-2 bottom-1 m-10 bg-gray-100'>
        {messages.map(m => (<div>{m.role}, {m.content}</div>))}
      </div>
    </div>
  );
}

export default App;
