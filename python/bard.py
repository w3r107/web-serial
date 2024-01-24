import serial
import time
# Replace with the actual port name of your USB to TTL device
# port = '/dev/ttyUSB0'  # Linux/macOS
port = 'COM7'  # Windows (adjust accordingly)

# Set the baud rate matching your device
baudrate = 115200

with serial.Serial(port, baudrate, timeout=1) as ser:
    while True:
        try:
            # Send data to the device (which will loop back to the receiver)
            data_to_send = input("Enter data to send (or 'exit' to quit): ")
            if data_to_send == 'exit':
                break
            ser.write(data_to_send.encode())

            # Read back the received data
            time.sleep(0.1)  # Adjust delay as needed
            received_data = ser.read(ser.inWaiting())
            print("Received data:", received_data.decode())
        except serial.SerialException as e:
            print("Error:", e)

            # with serial.Serial(port, baudrate, timeout=1) as ser:
    # while True:
    #     try:
    #         # ... (send data code remains the same)

    #         # Read back the received data with a slight delay
    #         time.sleep(0.1)  # Adjust delay as needed
    #         received_data = ser.read(ser.inWaiting())
    #         print("Received data:", received_data.decode())
    #     except serial.SerialException as e:
    #         print("Error:", e)