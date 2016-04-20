package com.gaiakeeper.sugarhome;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;

import org.eclipse.paho.android.service.MqttAndroidClient;
import org.eclipse.paho.client.mqttv3.IMqttActionListener;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.IMqttToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;

public class SugarHomeMain extends AppCompatActivity {
    private static String TAG = "MainActivity";
    private String server = "tcp://iot.eclipse.org:1883";
    private MqttAndroidClient mqttClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sugar_home_main);

        String clientId = MqttClient.generateClientId();
        mqttClient = new MqttAndroidClient(this.getApplicationContext(), server, clientId);
        mqttClient.setCallback(mainMqttCallback);

        try {
            IMqttToken token = mqttClient.connect();
            token.setActionCallback(mainIMqttActionListener);

        } catch (MqttException e) {
            e.printStackTrace();
        }
    }

    private IMqttActionListener mainIMqttActionListener = new IMqttActionListener() {
        @Override
        public void onSuccess(IMqttToken asyncActionToken) {
            Log.d(TAG, "onSuccess");
            String topic = "/sugar_home/air_conditioner/power";
            String payload = "on";
            int mqttQos = 1;

            MqttMessage message = new MqttMessage(payload.getBytes());
            try {
                mqttClient.subscribe(topic, mqttQos);
                mqttClient.publish(topic, message);
            } catch (MqttException e) {
                e.printStackTrace();
            }
        }

        @Override
        public void onFailure(IMqttToken asyncActionToken, Throwable exception) {
            Log.d(TAG, "onFailure");
        }
    };

    private MqttCallback mainMqttCallback = new MqttCallback() {
        @Override
        public void connectionLost(Throwable cause) {
            Log.d(TAG, "connectionLost");
            Log.d(TAG, cause.toString());
        }

        @Override
        public void messageArrived(String topic, MqttMessage message) throws Exception {
            Log.d(TAG, "messageArrived");
            Log.d(TAG, message.toString());
        }

        @Override
        public void deliveryComplete(IMqttDeliveryToken token) {
            Log.d(TAG, "deliveryComplete");
            Log.d(TAG, token.toString());
        }
    };
}
