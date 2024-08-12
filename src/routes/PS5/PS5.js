import React, { useEffect, useState } from 'react';
import p5 from 'p5';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import NavbarDoctor from '../../DoctorRoutes/NavbarDoctor/NavbarDoctor';

const Sketch = () => {
  let xPos = 0;
  let previousHeight = 0; 
  let currentHeight = 0;
  let inByte = 0;
  let BPM = 0;
  let beat_old = 0;
  let belowThreshold = true;
  let beats = new Array(500).fill(0);
  let beatIndex = 0;
  let threshold = 800.0;
  let p5Instance;
  let lastDrawTime = 0;
  const drawInterval = 30; 
  let dataBuffer = ''; 

  useEffect(() => {
    const socket = new SockJS('http://localhost:8081/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');

        client.subscribe('/topic/sensorData', message => {
          const data = JSON.parse(message.body);
          console.log('Received data from WebSocket:', data);
          inByte = parseFloat(data);
          console.log(inByte)
          
        });
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
      }
    });

    client.activate();
    return () => {
      client.deactivate();
    };

  }, []);


  const setup = (p) => {
    p.createCanvas(800, 500);
    p.background(255);
    p.textFont('Arial', 12);
    p5Instance = p;
    p.frameRate(30);
  };

  const draw = (p) => {
    const currentTime = p.millis();
    if (currentTime - lastDrawTime < drawInterval) {
      return;
    }
    lastDrawTime = currentTime;


    if (isNaN(inByte)) {
      return;
    }

    currentHeight = p.height / 2 - p.map(inByte, 0, 1023, -100, 100);

  
    p.stroke(0);
    p.line(xPos - 1, previousHeight, xPos, currentHeight);
    previousHeight = currentHeight;

    xPos++;


    if (xPos >= p.width) {
      xPos = 0;
      p.background(255);
    }

 
    if (p.millis() % 128 === 0) {
      p.fill(255);
      p.rect(0, 0, 200, 20);
      p.fill(0);
      p.text("BPM: " + BPM, 15, 10);
    }
  };

 
 
  useEffect(() => {
    new p5((p) => {
      p.setup = () => {
        setup(p, 'sketch-container');

        p.draw = () => {
          draw(p);
        };
      };
    });

    return () => {
      p5Instance.remove();
    };
  }, []);

  return (
    <>
    <NavbarDoctor />
    <div>
     
      <div id="sketch-container"></div>
    </div>
    </>
  );
};

export default Sketch;
