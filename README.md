# Sugar Home
This repository provides smart home service framework over [MQTT](http://mqtt.org). MQTT is one of best IoT framework and there are lots of MQTT brokers. It's simple and easy as shown in the below.

![Alt text](http://www.hivemq.com/wp-content/uploads/Screen-Shot-2014-10-22-at-12.21.07.png?raw=true "MQTT Publish/Subscribe Architecture")

However, constructing smart home service, it's too much premitive. Sugar Home will guide how to develop smart home service using MQTT (or CoAP, later). 

## Overall Architecture

![Alt text](/document/image/overall_architecture.jpg?raw=true "Overall Architecture of Sugar Home")

Mobile and devices are connected to MQTT broker ([iot.eclipse.org:1883](http://iot.eclipse.org/getting-started#sandboxes)). To turn on the device, mobile publishes MQTT topic. MQTT broker notifies the topic changed to the already subscribed device. Finally, the device is turned on. In the same manner, the device publishes the sensor data updated to MQTT broker. MQTT broker notifies the topic changed to the already subscribed mobile. Mobile lets you know the changed. Sugar Home has the protocol between mobile and device based on MQTT topic (resource).

Dongle can be the Internet broker to device. As shown in the above architecture, instead of device, dongle is connected to MQTT server. Dongle and device are communicating under IoT dongle protocol through UART, which is described in [IoT Dongle Platform](https://github.com/gaiakeeper/iot_dongle_platform). Device can be independent from the Internet service.

## MQTT Topic Structure

![Alt text](/document/image/MQTT_topic.jpg?raw=true "MQTT Topic Structure")

The above describes the basic topic structure. Home has unique ID. Device also has unique ID. Therefore, each resource in device can be represented in "\<Home ID\>/\<Device ID\>/\<Resource ID\>". Topic from device and topic from mobile (client) can be separated.

To communicate through this topic structure, mobile should know device ID, device should know home ID. In the configuration stage, they need to exchange IDs each other. And, they need to know resource ID. Device and its resource IDs are pre-defined in Sugar Home Protocol.

## Sugar Home Configuration
For more user-friendly interface, home configuration should be managed. The below shows the simplified home configuration, similar to folder and file structure. ROOM is composed of DEVICE and ROOM. Home is a root ROOM. DEVICE has device type. ROOM and DEVICE have name given by user.

![Alt text](/document/image/sugar_home_configuration.jpg?raw=true "Sugar Home Configuration")

For share, this configuration should be stored in Sugar Home Server. But, in the development phase, it may be stored in mobile only.

## Device Setup
When user buys new device, user needs to setup it using mobile app as shown in the below.

![Alt text](/document/image/device_setup.jpg?raw=true "Device Setup")

For Wi-Fi connection, device should know Wi-Fi AP information (SSID, PASSWORD). For MQTT connection, device should know MQTT server (HOST, PORT) and Home ID. Mobile needs to provide the required information to device. Device also needs to provide device information (TYPE, ID) to mobile. Based on device information, mobile adds device. User can manage (locate device at room, rename device, etc) the new device in home configuration.

In the development phase, user may add the new device manually.
