## Mercado Libre ACS

### Setup
Before running the API, you need to install dependencies with the following command:
``` 
npm install
```

### Running the API
To start the API, run the following command:
``` 
sudo docker compose up
```

### Running the Test suites
To run the tests suites, run the following command:

_(docker compose should be up due to integration tests)_
``` 
npm test
```

### Running Locust

To run Locust tests, run the following commands:

Stress test:
``` 
sudo docker compose down && sudo docker compose up
dotenv -e .env.test -- prisma migrate reset --force && dotenv -e .env.test -- ts-node locust/LocustDBSetter.ts

source venv/bin/activate
locust -f locustfile.py --host=http://localhost:3000 --users=6000 --spawn-rate=100 --autostart --run-time=1m
```
Open http://localhost:8089 to view swarm tests.

Load test:
``` 
sudo docker compose down && sudo docker compose up
dotenv -e .env.test -- prisma migrate reset --force && dotenv -e .env.test -- ts-node locust/LocustDBSetter.ts

source venv/bin/activate
locust -f locustfile.py --host=http://localhost:3000 --users=1500 --spawn-rate=10 --autostart --run-time=5m
```
Open http://localhost:8089 to view swarm tests.


### Running Cypress

To run Cypress tests, run the following command:

``` 
npm install cypress
node_modules/.bin/cypress open
```

### Running Appium

Requirements:
- Android SDK
- Appium-Server

To install Appium-Server, run the following command:

```
npm install -g appium
```

To run Appium tests, run the following commands:

``` 
appium
ts-node appium/appium.ts
```
