import binascii

text = "https://www.google.com/"
binary_conversion = bin(int.from_bytes(text.encode(), 'big'))
binary_conversion = binary_conversion[2:]

for count,i in enumerate(binary_conversion):
    time = 0.5
    sound_array = []

    if count%8 == 0:
        sound_array.append(0)
        base_one = 220
        base_two = 440
    else:
        base_one = 320
        base_two = 550

    if i == 0:
        sound_array.append(base_one)
    else:
        sound_array.append(base_two)
