curl -X POST \
  http://car.tubsoft.com:80/api/v1/alarms \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: e5293a82-1075-40ad-bbfb-c37bbb2fd3fc' \
  -H 'cache-control: no-cache' \
  -d '[{
"terminalNo": "19022810230",
 "alarmNumber": 1011,
 "alarmStatus": 1
}]'
