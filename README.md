# jsmoker
This summer (2017) me and my father finally finnished the fish and meatsmoker we started building some years back. I made it an "internet of things fish smoker" by connecting it to our home wifi. This way he can monitor the cooking process. This repository contains the code for both the nodeMCU microchip used for internet connectivity, temperature and smoke sensor readings and the small website that works as a GUI for my father to monitor the smoking process.

## Tech and libraries

### Hardware

Wireless module CH340 NodeMcu V3 development board based on the ESP8266
 
DHT11, DHT-11 Digital Temperature and Humidity Sensor

MQ-3 Gas Sensor Module, for smoke detection

### Software

The website part of this project is an old reused project reworeked quick and dirty. The essential library to get this working smoothly is https://github.com/websockets/ws.
