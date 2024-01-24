import React, { useRef, useState } from "react";

const App = () => {
  const readRef = useRef(null);
  const writeRef = useRef(null);
  const portRef = useRef(null);
  const [dataToSend, setDataToSend] = useState("");
  const [receivedData, setReceivedData] = useState("");
  const [asciiArr, setAsciiArr] = useState([]);

  const connectPort = async () => {
    try {
      portRef.current = await navigator.serial.requestPort();
      // const ports = await navigator.serial.getPorts();

      // Wait for the serial port to open.
      await portRef.current.open({ baudRate: 9600 });
      readData();
    } catch (error) {
      if (error?.message?.includes("already open")) alert("Port already open");
      else {
        alert(
          "Either the browser does not support serial port or is not enabled!"
        );
        console.log(error.message);
      }
    }
  };
  const readData = async () => {
    readRef.current = portRef.current.readable.getReader();

    // Listen to data coming from the serial device.
    while (true) {
      const { value, done } = await readRef.current.read();
      if (done) {
        // Allow the serial port to be closed later.
        console.log("i am closed");
        readRef.current.releaseLock();
        break;
      }
      // // value is a Uint8Array.
      // setReceivedData((prev) => [...prev, value]);
    }
  };
  const writeData = async () => {
    writeRef.current = portRef.current.writable.getWriter();
    const arr = [];
    // dataToSend?.map((val, i) => {
    //   arr.push(dataToSend.codePointAt(i));
    // });
    for (let i = 0; i < dataToSend?.length; i++) {
      arr.push(dataToSend.codePointAt(i));
    }
    setDataToSend("");

    setAsciiArr(arr);

    const data = new Uint8Array(arr); // hello
    await writeRef.current.write(data);

    // Allow the serial port to be closed later.
    writeRef.current.releaseLock();
  };

  const convertToNormalString = () => {
    let ans = "";
    for (let i = 0; i < asciiArr?.length; i++) {
      ans += String(String.fromCharCode(asciiArr[i]));
    }

    // asciiArr?.map((val, idx) => {
    //   ans += String(String.fromCharCode(val));
    // });
    // setReceivedData(ans);

    return ans;
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
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            writeData();
          }
        }}
      />
      <button
        onClick={() => {
          writeData();
        }}
      >
        Send
      </button>
      <br />
      Received Data:{convertToNormalString()}
    </div>
  );
};

export default App;
