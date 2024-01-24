import serial

def send_data(serial_port, data):
    # Ensure data is encoded as bytes before sending
    data_bytes = data.encode('utf-8')
    
    # Send the data to the serial port
    serial_port.write(data_bytes)

# Replace 'COMx' with your actual serial port identifier
serial_port = serial.Serial('COM7', 9600, timeout=1)

try:
    # Example: Sending the string "Hello, Serial Port!"
    send_data(serial_port, "Hello, Serial Port!")

    # You can send more data by calling send_data with different strings

finally:
    serial_port.close()
