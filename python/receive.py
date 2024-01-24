import serial

def main():
    # Replace 'COMx' with your actual serial port identifier
    serial_port = serial.Serial('COM7', 9600, timeout=1)

    try:
        while True:
            # Read data from the serial port
            data = serial_port.readline().decode('utf-8').strip()

            if data:
                print(f"Received: {data}")

                # Send the data back to the serial port
                serial_port.write(data.encode('utf-8'))
                serial_port.write(b'\n')  # Add a newline for better readability
    except KeyboardInterrupt:
        print("Exiting...")

    serial_port.close()

if __name__ == "__main__":
    main()
