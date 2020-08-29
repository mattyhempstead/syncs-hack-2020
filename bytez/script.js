

const UNIT_LENGTH = 10;
const HEADER_THRESHOLD = 8;
const RELAXED_THRESHOLD = 7;
const HEADER = [0b10101010, 0b01010101, 0b10101010, 0b01010101];
console.log("Header", HEADER);

let sample_buffer = [];
let unit_buffer = [];
let state = 1;
let header_pos = 1;


//States:
//1 : Fill up buffer, search if value is first header if full
//2 : gobble any more first header values you see
//3 : in header-reading mode: read a unit, see if is next header-value (and repeat till done). If fail, go to 2
//4 : read message length

const decode_message = n => {
  // Add to buffer until its full
  sample_buffer.push(n);
  if (sample_buffer.length > UNIT_LENGTH) sample_buffer.shift();

  console.log(sample_buffer);

  if (state === 1) {
    if (sample_buffer.length === UNIT_LENGTH) {
      unit = get_sample_buffer_value(sample_buffer);
      if (unit === HEADER[0]) {
        state = 2;
      }
    }
  } else if (state === 2) {
    if (n !== HEADER[0]) {
      state = 3;
      header_pos = 1;
      sample_buffer = [];
    }
  } else if (state === 3) {
    if (sample_buffer.length === UNIT_LENGTH) {
      unit = get_sample_buffer_value(sample_buffer);
      if (unit === HEADER[header_pos]) {
        header_pos++;
        if (header_pos === HEADER.length) {
          state = 4;
        }
        sample_buffer = [];
      }
    }
  } else if (state === 4) {
    if (sample_buffer.length === UNIT_LENGTH) {
      unit_buffer.push(get_sample_buffer_value(sample_buffer));
      sample_buffer = [];
      console.log(unit_buffer);
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



to_send = [65, 120, 207, 59, 252, 48, 119, 170, 170, 170, 170, 170, 170, 170, 170, 170, 170, 85, 233, 85, 85, 85, 85, 85, 85, 85, 85, 170, 170, 170, 60, 170, 170, 170, 170, 170, 170, 85, 85, 85, 85, 85, 85, 85, 40, 85, 85, 72, 72, 72, 72, 72, 72, 72, 72, 161, 72, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 238, 108, 108, 108, 182, 108, 108, 108, 108, 108, 108, 108, 108, 108, 108, 108, 108, 108, 108, 108, 111, 239, 111, 111, 111, 111, 111, 111, 111, 111, 32, 32, 32, 32, 146, 32, 32, 32, 231, 32, 87, 87, 87, 87, 87, 87, 54, 87, 224, 87, 111, 111, 111, 111, 23, 111, 111, 111, 111, 111, 114, 114, 114, 114, 114, 114, 114, 114, 114, 114, 192, 108, 108, 108, 108, 108, 108, 108, 108, 108, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
for (send of to_send) {
  decode_message(send);
}


//to_send = [];
//for (c of [])
//for (i = 0; i < 100; i++) {
  //to_send
//}
//console.log(to_send);
//for (send of to_send) {
  //decode_message(send);
//}


