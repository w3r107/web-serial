import React, { useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Test from "./components/Test";

const App = () => {
  const readRef = useRef(null);
  const writeRef = useRef(null);
  const portRef = useRef(null);
  const [dataToSend, setDataToSend] = useState("");
  const [receivedData, setReceivedData] = useState("");
  const [asciiArr, setAsciiArr] = useState([]);
  const [toShowStringArray, setToShowStringArray] = useState([]);
  const connectPort = async () => {
    try {
      portRef.current = await navigator.serial.requestPort();
      // const ports = await navigator.serial.getPorts();

      // Wait for the serial port to open.
      await portRef.current.open({ baudRate: 9600 });
      readData();
    } catch (error) {
      alert(
        "Either the browser does not support serial port or is not enabled or the port is already is in use!"
      );
      console.log(error.message);
    }
  };
  const readData = async () => {
    readRef.current = portRef.current.readable.getReader();

    try {
      while (true) {
        const { value, done } = await readRef.current.read();
        if (done) {
          // Allow the serial port to be closed later.
          reader.releaseLock();
          break;
        }
        if (value) {
          const toShow = convertToNormalString(value);
          setToShowStringArray((prev) => [...prev, toShow]);

          //  receivedDataDiv.innerText += toShow;
        }
      }
    } catch (error) {
      // TODO: Handle non-fatal read error.
    }
  };
  const writeData = async () => {
    setToShowStringArray([]);
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

  const convertToNormalString = (asciiArr) => {
    let ans = "";
    for (let i = 0; i < asciiArr?.length; i++) {
      ans += String(String.fromCharCode(asciiArr[i]));
    }
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
      Received Data:{toShowStringArray}
    </div>
    // <Routes>
    //   <Route path="/menu" element={<Test />} />
    // </Routes>
  );
};

export default App;
