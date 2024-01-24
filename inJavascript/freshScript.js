document.addEventListener("DOMContentLoaded", () => {
  let port;

  const connectButton = document.getElementById("connectButton");
  const sendButton = document.getElementById("sendButton");
  const dataInput = document.getElementById("dataInput");
  const receivedDataDiv = document.getElementById("receivedData");
  const convertToNormalString = (asciiArr) => {
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
  connectButton.addEventListener("click", async () => {
    if ("serial" in navigator) {
      // The Web Serial API is supported.
      console.log("ok");
    } else {
      alert("Not possible in your browser");
      return;
    }
    try {
      const filters = [
        { usbVendorId: 0x2341, usbProductId: 0x0043 },
        { usbVendorId: 0x2341, usbProductId: 0x0001 },
      ];

      port = await navigator.serial.requestPort(filters);

      await port.open({ baudRate: 9600 });

      // Listen for data from the serial port

      while (port.readable) {
        const reader = port.readable.getReader();

        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              // Allow the serial port to be closed later.
              reader.releaseLock();
              break;
            }
            if (value) {
              console.log(value);

              const toShow = convertToNormalString(value);
              receivedDataDiv.innerText += toShow;
            }
          }
        } catch (error) {
          // TODO: Handle non-fatal read error.
        }
      }
      //   console.log("reader", await reader.read());
    } catch (error) {
      console.error("Error connecting to serial port:", error);
    }
  });
  sendButton.addEventListener("click", async () => {
    console.log(port);
    receivedDataDiv.innerText = "receivedData:";
    if (port && port.writable) {
      try {
        const writer = port.writable.getWriter();
        const dataToSend = dataInput.value;
        console.log(dataToSend);
        const arr = [];

        for (let i = 0; i < dataToSend?.length; i++) {
          arr.push(dataToSend.codePointAt(i));
        }
        const data = new Uint8Array(arr);
        // const data = new Uint8Array([104, 101, 108, 108, 111]); // hello
        await writer.write(data);

        // Allow the serial port to be closed later.
        writer.releaseLock();
      } catch (error) {
        console.error("Error sending data:", error);
      }
    } else {
      console.error("Serial port not available or not writable.");
    }
  });
});
