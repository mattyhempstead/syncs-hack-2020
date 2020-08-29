

const UNIT_LENGTH = 8;
const HEADER_THRESHOLD = 5;
const RELAXED_THRESHOLD = 5;
const HEADER = [0b10101010, 0b01010101, 0b10101010, 0b01010101];
console.log("Header", HEADER);

let sample_buffer = [];
let unit_buffer = [];
let state = 1;
let header_pos = 1;
let counter = 0;
let length = null;


const restart_state_machine = () => {
  sample_buffer = [];
  unit_buffer = [];
  state = 1;
  header_pos = 1;
}

//States:
//1 : Fill up buffer, search if value is first header if full
//2 : gobble any more first header values you see
//3 : in header-reading mode: read a unit, see if is next header-value (and repeat till done). If fail, go to 2
//4 : read message length
//5 : read message payload

const decode_message = n => {
  // Add to buffer until its full
  sample_buffer.push(n);
  if (sample_buffer.length > UNIT_LENGTH) sample_buffer.shift();
  //console.log(state, sample_buffer);


  if (state === 1) {
    if (sample_buffer.length === UNIT_LENGTH) {
      unit = get_sample_buffer_value(sample_buffer);
      if (unit === HEADER[0]) {
        state = 2;
        counter = 0;
      }
    }
  } else if (state === 2) {
    if (n !== HEADER[0]) {
      state = 3;
      header_pos = 1;
      sample_buffer = [];
    }
    if (counter === (UNIT_LENGTH - HEADER_THRESHOLD)/2) {
        state = 3;
    }
  } else if (state === 3) {
    if (sample_buffer.length === UNIT_LENGTH) {
      unit = get_sample_buffer_value(sample_buffer);
      if (unit === HEADER[header_pos]) {
        header_pos++;
        if (header_pos === HEADER.length) {
          counter = 0;
          state = 4;
        }
        sample_buffer = [];
      } else {
          state = 1;
      }
    }
  } else if (state === 4) {
    if (sample_buffer.length === UNIT_LENGTH) {
        length = get_sample_buffer_value(sample_buffer, true);
        state = 5;
        counter = 0;
        sample_buffer = [];
     }
  } else if (state === 5) {
    if (sample_buffer.length === UNIT_LENGTH) {
        unit_buffer.push(get_sample_buffer_value(sample_buffer, true));
        sample_buffer = [];
        counter++;
        if (counter === length) {
            console.log("MESSAGE RECEIVED:");
            console.log("Length:");
            console.log(length);
            console.log("Payload:");
            console.log(unit_buffer);
            for (code of unit_buffer) {
                console.log(String.fromCharCode(code));
            }
            restart_state_machine();
        }
    }
  }

 /* if (sample_buffer.length == UNIT_LENGTH) {
    unit = get_sample_buffer_value(sample_buffer);
    
    if (unit !== -1) {
      found_header = true;

      unit_buffer.push(unit);
      console.log("Got unit", unit);

      // Clear buffer once we find a unit
      sample_buffer = [];
    } else {
      if (found_header) throw new Error("wow idk was kinda expecting a value but ok");
    }
  }*/
}



/**
 * Returns the most common number in the buffer if it is above the THRESHOLD.
 * Returns -1 if nothing above THRESHOLD
 */
const get_sample_buffer_value = (buff, relaxed_thresh) => {
  seen_values = {}
  current_max = null;
  for (value of buff) {
    if (value in seen_values) {
      seen_values[value] += 1;
      if (current_max == null) {
        current_max = value;
      } else {
        if (seen_values[value] > seen_values[current_max]) {
          current_max = value;
        }
      }
    } else {
      seen_values[value] = 1
    }
  }
  
  if (seen_values[current_max] >= (relaxed_thresh ? RELAXED_THRESHOLD : HEADER_THRESHOLD)) {
    return current_max;
  } else {
    return -1;
  }
  
}



to_send = [168, 216, 65, 48, 105, 79, 116, 214, 117, 53, 232, 237, 84, 88, 248, 170, 181, 240, 89, 17, 219, 60, 170, 170, 170, 170, 170, 170, 170, 170, 89, 85, 85, 85, 85, 85, 85, 100, 170, 170, 142, 170, 170, 170, 170, 170, 85, 85, 85, 85, 85, 85, 85, 85, 11, 11, 52, 11, 11, 11, 11, 11, 72, 72, 32, 72, 72, 72, 72, 72, 101, 203, 40, 101, 101, 101, 101, 101, 130, 108, 108, 108, 149, 108, 108, 108, 108, 108, 89, 108, 108, 108, 108, 108, 111, 12, 111, 111, 126, 111, 111, 111, 32, 195, 32, 32, 32, 179, 32, 32, 162, 87, 84, 87, 87, 87, 87, 87, 111, 111, 133, 111, 111, 111, 111, 111, 114, 114, 114, 114, 10, 114, 84, 114, 108, 108, 108, 108, 108, 205, 108, 108, 100, 100, 100, 100, 100, 100, 189, 100, 8];
restart_state_machine();
for (send of to_send) {
    decode_message(send);
}
