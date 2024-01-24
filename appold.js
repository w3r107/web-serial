import { useContext, useEffect, useRef, useState } from "react";
import SerialProvider, { SerialContext, useSerial } from "./SerialProvider";

function App() {
  const portRef = useRef(null);
  const writerRef = useRef(null);
  const readerRef = useRef(null);
  const [dataToSend, setDataToSend] = useState("");
  const [receivedData, setReceivedData] = useState("");
  const openPort = async (port) => {
    try {
      // await port.close();
      await port.open({ baudRate: 9600 });
      console.log("i am here again");
      portRef.current = port;
      console.log("portRef->>>>>>>>>", portRef);
      readData();
    } catch (error) {
      console.error("Could not open port");
    }
  };

  const manualConnectToPort = async () => {
    const port = await navigator.serial.requestPort();
    await openPort(port);
  };

  const sendDataToBuffer = async () => {
    // console.log("sendDATa", portRef.current.writable.locked);
    // if (portRef.current.writable.locked) {
    //   await portRef.current.close();
    //   openPort(portRef.current);
    // }
    const textEncoder = new TextEncoderStream();

    const writableStreamClosed = textEncoder.readable.pipeTo(
      portRef.current.writable
    );

    writerRef.current = textEncoder.writable.getWriter();

    await writerRef.current.write(dataToSend);
    // writerRef.current.releaseLock();
    // readerRef.current.cancel();
    // await readerRef.current.readableStreamClosed.catch(() => {
    //   /* Ignore the error */
    // });

    // writerRef.current.close();
    // await writableStreamClosed;

    // await portRef.current.close();

    // const writer = portRef.current.writable.getWriter();

    // const data = new Uint8Array([104, 101, 108, 108, 111]); // hello
    // await writer.write(data);
  };
  const readData = async () => {
    // const reader = portRef.current.readable.getReader();

    // console.log("ReceiveDATa", portRef);
    const textDecoder = new TextDecoderStream();
    // if (readerRef.current !== null) {
    readerRef.current.readableStreamClosed = portRef.current.readable.pipeTo(
      textDecoder.writable
    );
    readerRef.current = textDecoder.readable.getReader();
    // }
    let tempData = "";
    while (true) {
      const { value, done } = await readerRef.current.read();
      if (done) {
        readerRef.current.releaseLock();
        break;
      }
      setReceivedData((prev) => [...prev, value]);
      console.log(value);
    }
  };
  return (
    <>
      <h1>hello</h1>
      <button
        onClick={() => {
          manualConnectToPort();
        }}
      >
        Click here to connect.
      </button>
      <br />
      <input
        type="text"
        placeholder="Enter text"
        value={dataToSend}
        onChange={(e) => setDataToSend(e.target.value)}
      />
      <button
        onClick={() => {
          sendDataToBuffer();
        }}
      >
        Send
      </button>
      <h1>{receivedData}</h1>
      {/* <SerialProvider /> */}
    </>
  );
}

export default App;
//




import React, { useRef, useState } from "react";

const App = () => {
  const readRef = useRef(null);
  const writeRef = useRef(null);
  const portRef = useRef(null);
  const [dataToSend, setDataToSend] = useState("");
  const [receivedData, setReceivedData] = useState("");

  const connectPort = async () => {
    portRef.current = await navigator.serial.requestPort();
    // Wait for the serial port to open.
    await portRef.current.open({ baudRate: 9600 });
  };
  const readData = async () => {
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = portRef.current.readable.pipeTo(
      textDecoder.writable
    );
    readRef.current = textDecoder.readable.getReader();

    // Listen to data coming from the serial device.
    while (true) {
      const { value, done } = await readRef.read();
      if (done) {
        // Allow the serial port to be closed later.
        readRef.current.releaseLock();
        break;
      }
      // value is a string.
      setReceivedData((prev) => [...prev, value]);
      console.log(value);
    }
  };
  const writeData = async () => {
    const textEncoder = new TextEncoderStream();
    const writableStreamClosed = textEncoder.readable.pipeTo(
      portRef.current.writable
    );

    writeRef.current = textEncoder.writable.getWriter();

    await writeRef.current.write("hello");
  };

  return (
    <div>
      <button
        onClick={() => {
          connectPort();
        }}
      >
        Click here to connect.
      </button>
      <br />
      <input
        type="text"
        placeholder="Enter text"
        value={dataToSend}
        onChange={(e) => setDataToSend(e.target.value)}
      />
      <button
        onClick={() => {
          writeData();
        }}
      >
        Send
      </button>
      Received Data:{receivedData}
    </div>
  );
};

export default App;
