curl -X POST \
  http://car.tubsoft.com:80/api/v1/alarms \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: e5293a82-1075-40ad-bbfb-c37bbb2fd3fc' \
  -H 'cache-control: no-cache' \
  -d '[{
 "terminalNo": "19022810230",
 "alarmType": 3,
 "location": "123.222,24.111",
 "marsLocation": "123.333,24.444",
 "locateTime" : "2019-12-15T02:00:48",
 "speed": 45,
 "direction": 0
}]'