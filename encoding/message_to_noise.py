import random

message = [0b10101010, 0b01010101, 0b10101010, 0b01010101, 11, 72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]

noise_length = random.randint(6, 25)
result = [random.randint(0, 255) for x in range(noise_length)]
for char in message:
    for i in range(8):
        print(i)
        result.append(char if random.random() <= 0.8 else random.randint(0,255))

print(result)
print(len(result))
