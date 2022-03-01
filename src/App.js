import './App.css';
import axios from 'axios'
import {useState, useEffect} from 'react'
import MonitorItem from './components/MonitorItem.js'

let CancelToken = axios.CancelToken
let source = CancelToken.source()

function App() {
  const [email, setEmail] = useState('742548742@qq.com')
  const [password, setPassword] = useState('zhanglei233')
  const [startDate, setStartDate] = useState('1')
  const [endDate, setEndDate] = useState('8')
  const [authorization, setAuthorization] = useState()
  const [monitorList, setMonitorList] = useState([])

  const emailChange = (event) => {
    setEmail(event.target.value)
  }

  const passwordChange = (event) => {
    setPassword(event.target.value)
  }

  let body_login = {
    appId: "HZMBWEB_HK",
    code: "",
    equipment: "PC",
    joinType: "WEB",
    passWord: "",
    version: "2.7.202202.1282",
    webUserid: "",
}

  const login = () => {
    body_login.webUserid = email
    body_login.passWord = password
    if(authorization){
      let array = []
            for(let i = parseInt(startDate); i <= parseInt(endDate); i++){
              array.push('2022-03-' + (i < 10 ? '0' + i : i))
            }
            // setMonitorList(() => [])
            setMonitorList(() => array)
    }else{
      axios({
          url: '/api/webh5api/login',
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'authorization': authorization
          },
          data: body_login
      }).then((data) => {
          if(data.data.code == 'SUCCESS'){
              setAuthorization(data.data.jwt)
              console.log(data.data.jwt);
              let array = []
              for(let i = parseInt(startDate); i <= parseInt(endDate); i++){
                array.push('2022-03-' + (i < 10 ? '0' + i : i))
              }
              setMonitorList(array)
          }else{
              login()
          }
      }).catch((error) => {
          login()
      })
    }
  }

  return (
    <div className="App">
      <div>
        <span className="label">邮箱：</span>
        <input className="input" value={email} onChange={emailChange}></input>
        <span className="label">密码：</span>
        <input className="input" value={password} onChange={passwordChange}></input>
      </div>
      <div>
        <span className='label_'>从 3月</span>
        <input className='input_' value={startDate} onChange={(event) => {setStartDate(event.target.value)}}></input>
        <span className='label_'>日-</span>
        <input className='input_' value={endDate} onChange={(event) => {setEndDate(event.target.value)}}></input>
        <span className='input_'>日</span>
      </div>
      <div>
        <button className="button" onClick={login}>捡漏</button>
        <button className='button' onClick={() => {
            source.cancel('canceled by user.')
            source = CancelToken.source()
          }
          }>取消</button>
      </div>
      <div>{
        monitorList.map((date) => <MonitorItem key={date} date={date} authorization={authorization} source={source}></MonitorItem>)
      }</div>
    </div>
  );
}

export default App;
