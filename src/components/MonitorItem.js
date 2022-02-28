import axios from 'axios'
import {useState, useEffect} from 'react'
import './MonitorItem.css'

function MonitorItem({date, authorization, source}) {
    const [timeList, setTimeList] = useState([])

    useEffect(() => {
        check()
    })

    let body_check = {
        appId: "HZMBWEB_HK",
        bookDate: "",
        equipment: "PC",
        joinType: "WEB",
        lineCode: "HKGZHO",
        version: "2.7.202202.1282"
    }
    
      function check(day){    // 2022年3月？号
        let body = JSON.parse(JSON.stringify(body_check))
        body.bookDate = date
        axios({
            url: 'https://i.hzmbus.com/webh5api/manage/query.book.info.data',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': authorization
            },
            data: body,
            cancelToken: source.token
        }).then((data) => {
            console.log(data.data ? data.data.responseData : '')
            if(data.data.responseData){
                setTimeout(() => {
                    setTimeList(data.data.responseData)
                }, 1000)
            }else{
                setTimeout(() => {
                    check(day)
                }, 1000)
            }
            //setTimeout(check(day), 1000)
        }).catch((error) => {
            setTimeout(() => {
                check(day)
            }, 1000)
        })
    }

    return (
        <div>
            <div className='date'>{date}</div>
            <div className='list'>{timeList.map((time) => (
                <div className={'item'+ (time.totalPeople < time.maxPeople ? ' item_' : '')}>
                    <span>{time.beginTime.substr(0, 5)} : </span>
                    <span>{time.totalPeople} / </span>
                    <span>{time.maxPeople}</span>
                </div>
            ))}</div>
        </div>
    )
}

export default MonitorItem