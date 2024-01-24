document.addEventListener("DOMContentLoaded", () => {
  let port;

  const connectButton = document.getElementById("connectButton");
  const sendButton = document.getElementById("sendButton");
  const dataInput = document.getElementById("dataInput");
  const receivedDataDiv = document.getElementById("receivedData");

  connectButton.addEventListener("click", async () => {
    if ("serial" in navigator) {
      // The Web Serial API is supported.
      console.log("ok");
    } else {
      alert("Not possible in your browser");
    }

    try {
      // Request access to the serial port
      port = await navigator.serial.requestPort();

      // Open the serial port
      await port.open({ baudRate: 9600 });

      // Listen for data from the serial port
      const reader = port.readable.getReader();
      //   const textDecoder = new TextDecoderStream();
      //   const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      //   const reader = textDecoder.readable.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          reader.releaseLock();
          console.log("hey i am released");
          break;
        }
        console.log(value, done, port);
        receivedDataDiv.innerText += value + "\n";
      }
      //   console.log("reader", await reader.read());
    } catch (error) {
      console.error("Error connecting to serial port:", error);
    }
  });

  sendButton.addEventListener("click", async () => {
    console.log(port);

    if (port && port.writable) {
      try {
        // const writer = port.writable.getWriter();

        // const data = new Uint8Array([123]); // hello
        // await writer.write(data);

        // Allow the serial port to be closed later.
        // writer.releaseLock();

        const textEncoder = new TextEncoderStream();
        const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

        const writer = textEncoder.writable.getWriter();

        await writer.write(dataInput.value);
        // await port.close();

        await writer.releaseLock();

        //
        // const textEncoder = new TextEncoderStream();
        // const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

        // const writer = textEncoder.writable.getWriter();

        // await writer.write("hello");

        // const textEncoder = new TextEncoderStream();
        // const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

        // const writer = textEncoder.writable.getWriter();

        // await writer.write("hello");
        // Allow the serial port to be closed later.
        // writer.releaseLock();

        // Send data to the serial port
        // if ("write" in port) {
        //   // Proceed with writing
        //   await port.write(dataInput.value);
        // } else {
        //   console.error("Browser doesn't support port.write");
        // }
      } catch (error) {
        console.error("Error sending data:", error);
      }
    } else {
      console.error("Serial port not available or not writable.");
    }
  });
});

// const buttonToConnect = document.querySelector("#request");
// const dataInput = document.querySelector("#dataInput");
// const sendButton = document.querySelector("#sendButton");

// const requestPortFun = async () => {
//   const port = await navigator.serial.requestPort();
//   connectAndLoopback(port);
// };
// buttonToConnect.addEventListener("click", requestPortFun);

// async function connectAndLoopback(port) {
//   try {
//     await port.open({
//       baudRate: 115200,
//       dataBits: 8,
//       stopBits: 1,
//       parity: "none",
//     });

//     port.onreceive = async (event) => {
//       const receivedData = new TextDecoder().decode(event.data);
//       console.log("Received data:", receivedData);

//       await port.write(receivedData); // Send back the received data
//     };

//     // Add UI elements for sending data (e.g., text input and button)
//     sendButton.addEventListener("click", async () => {
//       console.log("asdasdasd");
//       const dataToSend = dataInput.value;
//       await port.write(dataToSend);
//       console.log("Data sent:", dataToSend);
//     });
//   } catch (error) {
//     console.error("Error connecting to serial port:", error);
//   }
// }

// <script>
//   const sendButton = document.querySelector("#sendButton");
//   let port;
//   const doSomething = async () => {
//     // Listen to data coming from the serial device.
//     while (true) {
//       const { value, done } = await reader.read();
//       if (done) {
//         // Allow the serial port to be closed later.
//         reader.releaseLock();
//         break;
//       }
//       // value is a Uint8Array.
//       console.log(value);
//     }
//   };
//   sendButton.addEventListener("click", async () => {
//     // Prompt user to select any serial port.
//     port = await navigator.serial.requestPort();
//     await port.open({
//       baudRate: 115200,
//       dataBits: 8,
//       stopBits: 1,
//       parity: "none",
//     });
//     doSomething();
//   });
//   const reader = port.readable.getReader();

//   //   requestPort();
//   //   const dataInput = document.querySelector("#dataInput");
//   //   sendButton.addEventListener("click", async () => {
//   //     const dataToSend = dataInput.value;
//   //     await port.write(dataToSend);
//   //     console.log("Data sent:", dataToSend);
//   //   });
//   //   //   sendButton.addEventListener("click", async () => {
//   //   //     // Prompt user to select any serial port.
//   //   //     console.log("gs");
//   //   //     const port = await navigator.serial.requestPort();
//   //   //   });

//   //   async function requestPort() {
//   //     try {
//   //       const port = await navigator.serial.requestPort();
//   //       await connectAndLoopback(port);
//   //     } catch (error) {
//   //       console.error("Error accessing serial port:", error);
//   //     }
//   //   }

//   //   async function connectAndLoopback(port) {
//   //     try {
//   //       await port.open({ baudRate: 9600 }); // Adjust baud rate as needed

//   //       port.onreceive = async (event) => {
//   //         const receivedData = new TextDecoder().decode(event.data);
//   //         console.log("Received data:", receivedData);

//   //         await port.write(receivedData); // Send back the received data
//   //       };

//   //       // Add UI elements for sending data (e.g., text input and button)
//   //     } catch (error) {
//   //       console.error("Error connecting to serial port:", error);
//   //     }
//   //   }
// </script>
